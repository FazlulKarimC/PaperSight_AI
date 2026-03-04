import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;

// ── Text Chunking ─────────────────────────────────────────────────
// Splits text into overlapping chunks for better retrieval context.

const CHUNK_SIZE = 500; // words per chunk
const CHUNK_OVERLAP = 50; // overlap in words between consecutive chunks

/**
 * Splits a long text into overlapping chunks of approximately CHUNK_SIZE words.
 * Overlap ensures context continuity across chunk boundaries.
 */
export function chunkText(text: string): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const chunks: string[] = [];

    if (words.length <= CHUNK_SIZE) {
        return [words.join(" ")];
    }

    let start = 0;
    while (start < words.length) {
        const end = Math.min(start + CHUNK_SIZE, words.length);
        chunks.push(words.slice(start, end).join(" "));

        if (end >= words.length) break;
        start += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
}

/**
 * Generates a vector embedding for a single text string using Gemini's
 * gemini-embedding-001 model (768-dimension output).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await withRetry(() =>
        ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: text,
            config: {
                outputDimensionality: EMBEDDING_DIMENSIONS,
            },
        })
    );

    const values = response.embeddings?.[0]?.values;
    if (!values || values.length === 0) {
        throw new Error("Embedding generation returned empty values");
    }
    return values;
}

/**
 * Generates embeddings for an array of text chunks.
 * Processes sequentially to stay within API rate limits on free tier.
 */
export async function generateEmbeddings(
    chunks: string[]
): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk);
        embeddings.push(embedding);
    }

    return embeddings;
}

// ── Storage ───────────────────────────────────────────────────────

/**
 * Chunks the summary text, generates embeddings, and stores everything in
 * the pdf_embeddings table. Uses raw SQL for the vector column since
 * Prisma doesn't natively support pgvector types.
 */
export async function storeEmbeddings(
    summaryId: string,
    userId: string,
    text: string
): Promise<void> {
    const chunks = chunkText(text);
    const embeddings = await generateEmbeddings(chunks);

    // Delete any existing embeddings for this summary (idempotent re-index)
    await prisma.pdfEmbedding.deleteMany({
        where: { summaryId },
    });

    // Insert each chunk + its embedding using raw SQL for the vector column
    for (let i = 0; i < chunks.length; i++) {
        const vectorStr = `[${embeddings[i].join(",")}]`;

        await prisma.$queryRaw`
      INSERT INTO pdf_embeddings (id, summary_id, user_id, chunk_text, chunk_index, embedding, created_at)
      VALUES (
        gen_random_uuid(),
        ${summaryId}::uuid,
        ${userId},
        ${chunks[i]},
        ${i},
        ${vectorStr}::vector,
        NOW()
      )
    `;
    }
}

// ── Vector Similarity Search ──────────────────────────────────────

interface SimilarChunk {
    chunkText: string;
    chunkIndex: number;
    similarity: number;
}

/**
 * Searches for the most similar text chunks to a query within a specific
 * summary document. Uses cosine similarity via pgvector's <=> operator.
 *
 * @param summaryId - The summary to search within
 * @param queryEmbedding - The embedding vector of the user's question
 * @param topK - Number of top results to return (default 5)
 * @returns The most relevant text chunks, ordered by similarity
 */
export async function searchSimilarChunks(
    summaryId: string,
    queryEmbedding: number[],
    topK = 5
): Promise<SimilarChunk[]> {
    const vectorStr = `[${queryEmbedding.join(",")}]`;

    const results = await prisma.$queryRaw<
        { chunk_text: string; chunk_index: number; similarity: number }[]
    >`
    SELECT
      chunk_text,
      chunk_index,
      1 - (embedding <=> ${vectorStr}::vector) AS similarity
    FROM pdf_embeddings
    WHERE summary_id = ${summaryId}::uuid
    ORDER BY embedding <=> ${vectorStr}::vector
    LIMIT ${topK}
  `;

    return results.map((r) => ({
        chunkText: r.chunk_text,
        chunkIndex: r.chunk_index,
        similarity: Number(r.similarity),
    }));
}

// ── Check if embeddings exist ─────────────────────────────────────

/**
 * Returns true if embeddings have already been generated for the given summary.
 */
export async function hasEmbeddings(summaryId: string): Promise<boolean> {
    const count = await prisma.pdfEmbedding.count({
        where: { summaryId },
    });
    return count > 0;
}

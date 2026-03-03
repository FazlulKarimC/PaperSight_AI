-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create IVFFlat index on pdf_embeddings for fast similarity search
-- Uses cosine distance operator (<=>) for normalized embeddings
-- lists = 100 is a good default for up to ~100k rows
CREATE INDEX IF NOT EXISTS idx_pdf_embeddings_vector
ON pdf_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

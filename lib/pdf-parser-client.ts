/**
 * Client-side PDF text extraction using pdfjs-dist.
 * Runs entirely in the browser — no server upload needed for text extraction.
 * Uses dynamic import to avoid SSR/static-generation issues.
 */

import type * as PdfjsLib from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

// Lazy loader — only imports pdfjs-dist when actually needed (in the browser)
let _pdfjs: typeof PdfjsLib | null = null;
async function getPdfJs(): Promise<typeof PdfjsLib> {
    if (_pdfjs) return _pdfjs;
    const pdfjsLib = await import("pdfjs-dist");
    // Use the worker file copied to /public (CDN doesn't have v5.5.207 yet)
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    _pdfjs = pdfjsLib;
    return pdfjsLib;
}

// ── Constants ──────────────────────────────────────────────────────
export const MAX_FILE_SIZE_BYTES = 16 * 1024 * 1024; // 16MB per file
export const MAX_FILE_COUNT = 5;
export const MAX_COMBINED_WORDS = 100_000; // ~400k characters
export const MAX_COMBINED_CHARS = 500_000; // hard character limit for API

// ── Types ──────────────────────────────────────────────────────────
export interface ParsedPdf {
    fileName: string;
    text: string;
    wordCount: number;
    pageCount: number;
}

export interface ParseError {
    fileName: string;
    error: string;
}

export interface BatchParseResult {
    parsed: ParsedPdf[];
    errors: ParseError[];
    combinedText: string;
    totalWordCount: number;
    totalPageCount: number;
}

// ── Single File Parser ─────────────────────────────────────────────

/**
 * Extract text from a single PDF file in the browser.
 * Returns text content concatenated from all pages.
 */
export async function parsePdfInBrowser(file: File): Promise<ParsedPdf> {
    const pdfjsLib = await getPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item) => (item as TextItem).str)
            .join(" ");
        pages.push(pageText);
    }

    const text = pages.join("\n\n");

    if (!text || text.trim().length === 0) {
        throw new Error(
            "This PDF contains no extractable text. It may be a scanned document or image-based PDF."
        );
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    return {
        fileName: file.name,
        text,
        wordCount,
        pageCount: pdf.numPages,
    };
}

// ── Batch Parser ───────────────────────────────────────────────────

/**
 * Parse multiple PDFs in the browser.
 * Returns successfully parsed results + per-file errors.
 * Does NOT throw — caller should check errors array.
 */
export async function parsePdfsInBrowser(
    files: File[],
    onProgress?: (parsed: number, total: number) => void
): Promise<BatchParseResult> {
    const parsed: ParsedPdf[] = [];
    const errors: ParseError[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
            const result = await parsePdfInBrowser(file);
            parsed.push(result);
        } catch (err) {
            errors.push({
                fileName: file.name,
                error: err instanceof Error ? err.message : "Failed to parse PDF",
            });
        }
        onProgress?.(i + 1, files.length);
    }

    // Combine text from all successfully parsed PDFs
    const combinedText = parsed
        .map((p, i) => `--- Document ${i + 1}: ${p.fileName} ---\n\n${p.text}`)
        .join("\n\n");

    const totalWordCount = parsed.reduce((sum, p) => sum + p.wordCount, 0);
    const totalPageCount = parsed.reduce((sum, p) => sum + p.pageCount, 0);

    return { parsed, errors, combinedText, totalWordCount, totalPageCount };
}

// ── Validation Helpers ─────────────────────────────────────────────

/**
 * Validate files before parsing.
 * Returns an array of error messages (empty = all valid).
 */
export function validateFiles(files: File[]): string[] {
    const errors: string[] = [];

    if (files.length > MAX_FILE_COUNT) {
        errors.push(`Maximum ${MAX_FILE_COUNT} PDFs allowed at once. You selected ${files.length}.`);
    }

    for (const file of files) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            errors.push(`"${file.name}" is ${sizeMB}MB — max 16MB per file.`);
        }

        if (file.type !== "application/pdf") {
            errors.push(`"${file.name}" is not a PDF file.`);
        }
    }

    return errors;
}

/**
 * Check if combined parse result exceeds Gemini context limits.
 * Returns error message or null if within limits.
 */
export function checkContextLimit(result: BatchParseResult): string | null {
    if (result.totalWordCount > MAX_COMBINED_WORDS) {
        return `Combined PDFs contain ${result.totalWordCount.toLocaleString()} words — max ${MAX_COMBINED_WORDS.toLocaleString()} words for free tier. Try with fewer or smaller PDFs.`;
    }

    if (result.combinedText.length > MAX_COMBINED_CHARS) {
        return `Combined PDF text is too large for the free tier (${(result.combinedText.length / 1000).toFixed(0)}k characters). Try with fewer or smaller PDFs.`;
    }

    return null;
}

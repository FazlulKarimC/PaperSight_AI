"use server"

import { generateContentUsingGemini } from "@/lib/gemini"
import parse from "@/lib/parse"
import { prisma } from "@/lib/prisma"
import { type SummaryStyle } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import { getOrCreateGuestId } from "@/lib/guest-session"

// Types
interface PDFSummary {
    userId?: string
    fileUrl?: string
    summary: string | null
    title?: string
    fileName?: string
    summaryStyle?: SummaryStyle
    originalWordCount?: number
}

interface ApiResponse<T> {
    success: boolean
    message: string
    data: T | null
}

/**
 * Summarizes a PDF file using Gemini AI
 */
export const summarizePDF = async (
    fileUrl: string | undefined,
    style: SummaryStyle = "viral"
): Promise<ApiResponse<{ summary: string; originalWordCount: number }>> => {
    if (!fileUrl) {
        return { success: false, message: "File URL is undefined", data: null }
    }

    try {
        const pdfText = await parse(fileUrl)
        if (!pdfText) {
            return { success: false, message: "Failed to parse PDF file", data: null }
        }

        const originalWordCount = pdfText.split(/\s+/).filter(Boolean).length

        const content = await generateContentUsingGemini(pdfText, style)
        if (!content) {
            return { success: false, message: "Failed to generate content", data: null }
        }

        return {
            success: true,
            message: "Content generated successfully",
            data: { summary: content, originalWordCount },
        }
    } catch (error) {
        console.error("Error in summarizePDF:", error)

        // Classify error for better UX
        const errorMessage = classifyError(error)
        return { success: false, message: errorMessage, data: null }
    }
}

/**
 * Classifies errors into user-friendly messages
 */
function classifyError(error: unknown): string {
    const msg = error instanceof Error ? error.message : String(error)

    if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota"))
        return "AI rate limit reached. Please wait a moment and try again."
    if (msg.includes("timeout") || msg.includes("timed out"))
        return "The request took too long. Please try a smaller PDF."
    if (msg.includes("no extractable text") || msg.includes("scanned"))
        return "This PDF appears to be scanned/image-based. Only text-based PDFs are supported."
    if (msg.includes("SAFETY") || msg.includes("blocked"))
        return "The content was flagged by safety filters. Please try a different document."
    if (msg.includes("NetworkError") || msg.includes("fetch failed"))
        return "Network error. Please check your connection and try again."
    if (msg.includes("413") || msg.includes("too large"))
        return "The file is too large. Please upload a smaller PDF (max 4MB)."

    return msg || "An unexpected error occurred"
}

/**
 * Saves a PDF summary to the database using Prisma
 */
const savePDFSummaryToDatabase = async ({
    userId,
    fileUrl,
    summary,
    title,
    fileName,
    summaryStyle,
    originalWordCount,
}: PDFSummary): Promise<ApiResponse<any>> => {
    try {
        if (!userId) {
            return { success: false, message: "User not authenticated", data: null }
        }
        if (!summary) {
            return { success: false, message: "Summary is empty", data: null }
        }

        const result = await prisma.pdfSummary.create({
            data: {
                userId,
                originalFileUrl: fileUrl ?? "",
                summaryText: summary,
                status: "completed",
                title: title ?? null,
                fileName: fileName ?? null,
                summaryStyle: summaryStyle ?? "viral",
                originalWordCount: originalWordCount ?? null,
            },
        });

        return { success: true, message: "Summary saved successfully", data: [result] }
    } catch (error) {
        console.error("Error in savePDFSummaryToDatabase:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred while saving the summary",
            data: null,
        }
    }
}

/**
 * Server action to save a PDF summary
 */
export const savePDFSummary = async ({
    fileUrl,
    summary,
    title,
    fileName,
    summaryStyle,
    originalWordCount,
}: PDFSummary): Promise<ApiResponse<any>> => {
    try {
        const { userId } = await auth()
        const effectiveUserId = userId || await getOrCreateGuestId()

        if (!userId) {
            console.error("User not authenticated")
        }

        if (!summary) {
            return { success: false, message: "Summary is undefined", data: null }
        }

        const savedSummary = await savePDFSummaryToDatabase({
            userId: effectiveUserId,
            fileUrl,
            summary,
            title,
            fileName,
            summaryStyle,
            originalWordCount,
        })

        if (!savedSummary.success) return savedSummary

        return { success: true, message: "Summary saved successfully", data: savedSummary.data }
    } catch (error) {
        console.error("Error in savePDFSummary:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred while saving the summary",
            data: null,
        }
    }
}

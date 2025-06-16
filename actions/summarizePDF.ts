"use server"

import { getDbConnection } from "@/lib/db"
import { generateContentUsingGemini } from "@/lib/gemini"
import parse from "@/lib/parse"
import { getGuestUserId } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"


// Types
interface PDFSummary {
    userId?: string
    fileUrl?: string
    summary: string | null
    title?: string
    fileName?: string
}

interface ApiResponse<T> {
    success: boolean
    message: string
    data: T | null
}

/**
 * Summarizes a PDF file using Gemini AI
 * @param fileUrl - URL of the PDF file to summarize
 * @returns Promise<ApiResponse> with the summary data
 */
export const summarizePDF = async (fileUrl: string | undefined): Promise<ApiResponse<string>> => {
    if (!fileUrl) {
        return {
            success: false,
            message: "File URL is undefined",
            data: null,
        }
    }

    try {
        // Parse the PDF file using PDFLoader
        const pdfText = await parse(fileUrl)
        if (!pdfText) {
            return {
                success: false,
                message: "Failed to parse PDF file",
                data: null,
            }
        }

        // Generate content using Gemini AI
        const content = await generateContentUsingGemini(pdfText)
        if (!content) {
            return {
                success: false,
                message: "Failed to generate content",
                data: null,
            }
        }

        return {
            success: true,
            message: "Content generated successfully",
            data: content,
        }
    } catch (error) {
        console.error("Error in summarizePDF:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            data: null,
        }
    }
}

/**
 * Saves a PDF summary to the database
 * @param params - PDFSummary object containing the summary data
 * @returns Promise<ApiResponse> with the saved summary data
 */
const savePDFSummaryToDatabase = async ({
    userId,
    fileUrl,
    summary,
    title,
    fileName,
}: PDFSummary): Promise<ApiResponse<any>> => {
    try {
        const sql = await getDbConnection()

        if (!userId) {
            return {
                success: false,
                message: "User not authenticated",
                data: null,
            }
        }

        const result = await sql`
            INSERT INTO pdf_summaries (
                user_id,
                original_file_url,
                summary_text,
                status,
                title,
                file_name
            ) VALUES (
                ${userId},
                ${fileUrl},
                ${summary},
                'completed',
                ${title},
                ${fileName}
            )
            RETURNING *
        `

        return {
            success: true,
            message: "Summary saved successfully",
            data: result,
        }
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
 * Handles authentication and data validation before saving
 */
export const savePDFSummary = async ({
    fileUrl,
    summary,
    title,
    fileName,
}: PDFSummary): Promise<ApiResponse<any>> => {
    try {
        const { userId } = await auth()
        const effectiveUserId = userId || getGuestUserId()

        if (!userId) {
            console.error("User not authenticated")
        }

        if (!summary) {
            return {
                success: false,
                message: "Summary is undefined",
                data: null,
            }
        }

        const savedSummary = await savePDFSummaryToDatabase({
            userId :  effectiveUserId,
            fileUrl,
            summary,
            title,
            fileName,
        })

        if (!savedSummary.success) {
            return savedSummary
        }

        return {
            success: true,
            message: "Summary saved successfully",
            data: savedSummary.data,
        }
    } catch (error) {
        console.error("Error in savePDFSummary:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred while saving the summary",
            data: null,
        }
    }
}

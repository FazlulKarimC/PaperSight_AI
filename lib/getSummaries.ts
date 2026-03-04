"use server"
import { cache } from 'react';
import { prisma } from "./prisma";

export interface Summary {
    id: string
    user_id: string
    original_file_url: string
    summary_text: string
    status: string
    title: string
    file_name: string
    created_at: string
    updated_at: string
    word_count: number
    summary_style: string | null
    original_word_count: number | null
}

export async function getSummaries(userId: string) {
    try {
        const summaries = await prisma.pdfSummary.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        // Map Prisma result to the legacy Summary interface for compatibility
        return summaries.map((s) => ({
            id: s.id,
            user_id: s.userId,
            original_file_url: s.originalFileUrl,
            summary_text: s.summaryText,
            status: s.status,
            title: s.title ?? "",
            file_name: s.fileName ?? "",
            created_at: s.createdAt.toISOString(),
            updated_at: s.updatedAt.toISOString(),
            word_count: s.summaryText.split(/\s+/).length,
            summary_style: s.summaryStyle,
            original_word_count: s.originalWordCount,
        })) as Summary[];
    } catch (error) {
        console.error("Error fetching summaries:", error);
        return null;
    }
}

export const getSummaryById = cache(async (id: string, userId?: string): Promise<Summary | null> => {
    try {
        const where: { id: string; userId?: string } = { id };
        if (userId) {
            where.userId = userId;
        }

        const summary = await prisma.pdfSummary.findFirst({
            where,
        });

        if (!summary) return null;

        const wordCount = summary.summaryText.split(/\s+/).length;

        return {
            id: summary.id,
            user_id: summary.userId,
            original_file_url: summary.originalFileUrl,
            summary_text: summary.summaryText,
            status: summary.status,
            title: summary.title ?? "",
            file_name: summary.fileName ?? "",
            created_at: summary.createdAt.toISOString(),
            updated_at: summary.updatedAt.toISOString(),
            word_count: wordCount,
            summary_style: summary.summaryStyle,
            original_word_count: summary.originalWordCount,
        } as Summary;
    } catch (error) {
        console.error("Error fetching summary:", error);
        return null;
    }
});
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";

interface SaveSummaryRequest {
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
    summaryStyle?: string;
    originalWordCount?: number;
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User not authenticated", data: null },
                { status: 401 }
            );
        }

        const body: SaveSummaryRequest = await req.json();
        const { fileUrl, summary, title, fileName, summaryStyle, originalWordCount } = body;

        if (!summary) {
            return NextResponse.json(
                { success: false, message: "Summary is required", data: null },
                { status: 400 }
            );
        }

        const result = await prisma.pdfSummary.create({
            data: {
                userId,
                originalFileUrl: fileUrl,
                summaryText: summary,
                status: "completed",
                title,
                fileName,
                summaryStyle: summaryStyle ?? "viral",
                originalWordCount: originalWordCount ?? null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Summary saved successfully",
            data: [result],
        });

    } catch (error) {
        console.error("Error saving summary:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "An error occurred while saving the summary",
                data: null
            },
            { status: 500 }
        );
    }
}

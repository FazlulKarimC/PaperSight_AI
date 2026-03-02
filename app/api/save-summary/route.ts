import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Use Edge Runtime to bypass serverless 1MB body limit
export const runtime = "edge";

interface SaveSummaryRequest {
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
}

export async function POST(req: NextRequest) {
    try {
        // Authenticate user
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User not authenticated", data: null },
                { status: 401 }
            );
        }

        // Parse request body
        const body: SaveSummaryRequest = await req.json();
        const { fileUrl, summary, title, fileName } = body;

        if (!summary) {
            return NextResponse.json(
                { success: false, message: "Summary is required", data: null },
                { status: 400 }
            );
        }

        // Save to database using Prisma
        const result = await prisma.pdfSummary.create({
            data: {
                userId,
                originalFileUrl: fileUrl,
                summaryText: summary,
                status: "completed",
                title,
                fileName,
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

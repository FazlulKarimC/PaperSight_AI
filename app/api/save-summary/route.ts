import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuestId, buildGuestIdCookieHeader } from "@/lib/guest-session";

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
        // Resolve userId: Clerk auth for signed-in users, cookie for guests
        const { userId: clerkUserId } = getAuth(req);
        let userId = clerkUserId;
        let guestId: string | null = null;

        if (!userId) {
            guestId = await getOrCreateGuestId();
            userId = guestId;
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

        const response = NextResponse.json({
            success: true,
            message: "Summary saved successfully",
            data: [result],
        });

        // Set guestId cookie so the guest can access their summary later
        if (guestId) {
            response.headers.append("Set-Cookie", buildGuestIdCookieHeader(guestId));
        }

        return response;

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

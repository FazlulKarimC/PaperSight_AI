import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuestId, buildGuestIdCookieHeader } from "@/lib/guest-session";
import { z } from "zod";

export const runtime = "nodejs";


const saveSummarySchema = z.object({
    fileUrl: z.string().default(""),
    summary: z.string().min(1, "Summary is required"),
    title: z.string().default(""),
    fileName: z.string().default(""),
    summaryStyle: z.enum(["viral", "concise", "detailed", "bullet-points", "academic"]).default("viral"),
    originalWordCount: z.number().int().nonnegative().nullable().optional(),
});

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

        const rawBody = await req.json();
        const parseResult = saveSummarySchema.safeParse(rawBody);

        if (!parseResult.success) {
            return NextResponse.json(
                { success: false, message: parseResult.error.errors[0]?.message || "Invalid request body", data: null },
                { status: 400 }
            );
        }

        const { fileUrl, summary, title, fileName, summaryStyle, originalWordCount } = parseResult.data;

        const result = await prisma.pdfSummary.create({
            data: {
                userId,
                originalFileUrl: fileUrl,
                summaryText: summary,
                status: "completed",
                title,
                fileName,
                summaryStyle,
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

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateGuestId } from "@/lib/guest-session";

export async function deleteSummaryAction(summaryId: string) {
    try {
        const { userId: clerkUserId } = await auth();
        const userId = clerkUserId || await getOrCreateGuestId();

        if (!userId) {
            return { success: false, message: "Not authenticated" };
        }

        // Use deleteMany with userId filter to prevent IDOR
        const deleted = await prisma.pdfSummary.deleteMany({
            where: { id: summaryId, userId },
        });

        if (deleted.count === 0) {
            return { success: false, message: "Summary not found or not owned by you" };
        }

        revalidatePath("/dashboard");
        return { success: true, message: "Summary deleted successfully" };
    } catch (error) {
        console.error("Error deleting summary:", error);
        return { success: false, message: "Failed to delete summary" };
    }
}
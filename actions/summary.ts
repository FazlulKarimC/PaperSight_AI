"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction(summaryId: string) {
    try {
        await prisma.pdfSummary.delete({
            where: { id: summaryId },
        });

        revalidatePath("/dashboard");
        return { success: true, message: "Summary deleted successfully" };
    } catch (error) {
        console.error("Error deleting summary:", error);
        return { success: false, message: "Failed to delete summary" };
    }
}
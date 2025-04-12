"use server";

import { getDbConnection } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction(summaryId: string) {
    // Ensure the user is authenticated
    try {
        const sql = await getDbConnection();
        await sql`DELETE FROM pdf_summaries WHERE id = ${summaryId}`;
        revalidatePath("/dashboard");
        return { success: true, message: "Summary deleted successfully" };
    } catch (error) {
        console.error("Error deleting summary:", error);
        return { success: false, message: "Failed to delete summary" };
    }
    // Handle any errors that occur during the deletion process
}
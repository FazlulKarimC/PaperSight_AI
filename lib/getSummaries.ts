"use server"
import { getDbConnection } from "./db";

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
}

export async function getSummaries(userId: string) {
    try {
        const sql = await getDbConnection();
        const summaries = await sql`SELECT * FROM pdf_summaries WHERE user_id = ${userId} ORDER BY created_at DESC`;
        return summaries as Summary[];
    } catch (error) {
        console.error("Error fetching summaries:", error);
        return null;
    }
}

export async function getSummaryById(id: string): Promise<Summary[] | null> {
    try {
        const sql = await getDbConnection();
        const summary = await sql`SELECT 
        id, 
        user_id, 
        original_file_url, 
        summary_text, 
        status, 
        title, 
        file_name, 
        created_at, 
        updated_at,
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 AS word_count  
        FROM pdf_summaries WHERE id = ${id}`;

        return summary as Summary[];
    } catch (error) {
        console.error("Error fetching summary:", error);
        return null;
    }
}
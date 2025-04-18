// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;

export async function getDbConnection() {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is not defined");
    }

    try {
        // Reuse existing connection if available
        if (!sql) {
            sql = neon(databaseUrl);
        }
        return sql;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
}

export async function closeDbConnection() {
    try {
        if (sql) {
            sql = null;
        }
    } catch (error) {
        console.error("Error cleaning up database connection:", error);
    }
}
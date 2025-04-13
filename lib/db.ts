// app/actions.ts
"use server";
import { neon, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

let sql: ReturnType<typeof neon> | null = null;

// Only use WebSocket in Node.js environment
if (typeof process !== 'undefined') {
    neonConfig.webSocketConstructor = ws;
}

export async function getDbConnection() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }

    try {
        // Reuse existing connection if available
        if (!sql) {
            sql = neon(process.env.DATABASE_URL);
        }
        return sql;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
}

// Cleanup function to be called during shutdown
export async function closeDbConnection() {
    try {
        if (sql) {
            // In serverless environments, we don't need to explicitly close connections
            // as they are automatically managed. Just clear the reference.
            sql = null;
        }
    } catch (error) {
        console.error("Error cleaning up database connection:", error);
    }
}
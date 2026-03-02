import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma";

/**
 * Singleton Prisma Client using the Neon serverless adapter.
 * Works in both Node.js serverless functions and Edge Runtime.
 *
 * In development, the client is cached on `globalThis` to survive
 * Next.js hot-reloading without opening too many connections.
 */

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
    const adapter = new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
    });
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

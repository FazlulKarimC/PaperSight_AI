import type { NextConfig } from "next";
import { closeDbConnection } from "./lib/db";

// Handle cleanup on process termination
['SIGTERM', 'SIGINT', 'SIGQUIT'].forEach(signal => {
  process.on(signal, async () => {
    console.log(`Received ${signal}, cleaning up...`);
    await closeDbConnection();
    process.exit(0);
  });
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  await closeDbConnection();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await closeDbConnection();
  process.exit(1);
});

const nextConfig: NextConfig = {
  images: {
    domains: ['uploadthing.com'],
  },
};

export default nextConfig;

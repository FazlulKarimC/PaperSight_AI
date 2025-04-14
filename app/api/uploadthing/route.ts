import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
      // Fallback logic: localhost in dev, Vercel domain in prod
      callbackUrl: process.env.VERCEL_ENV
        ? `https://${process.env.VERCEL_URL}/api/uploadthing`
        : "http://localhost:3000/api/uploadthing",
  
      ingestUrl: process.env.VERCEL_ENV
        ? `https://${process.env.VERCEL_URL}/api/uploadthing`
        : "http://localhost:3000/api/uploadthing",
    },
});

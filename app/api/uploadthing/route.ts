import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    callbackUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/uploadthing` : `http://localhost:3000/api/uploadthing`,
    logLevel: "Error",
  },
});

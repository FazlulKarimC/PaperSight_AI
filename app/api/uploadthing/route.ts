import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
    // Ensure the callback URL is properly set for both production and development
    callbackUrl: process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/uploadthing` 
      : process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api/uploadthing` 
      : "http://localhost:3000/api/uploadthing",
    logLevel: "Error", // Change to "Debug", // Change to debug to get more detailed logs
  },
});

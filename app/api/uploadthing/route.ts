import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  config: {
    callbackUrl: process.env.UPLOADTHING_CALLBACK_URL
      ? `${process.env.UPLOADTHING_CALLBACK_URL}`
      : "http://localhost:3000",
  },
});

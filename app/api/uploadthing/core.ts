import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from "@clerk/nextjs/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({
    pdf: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      console.log("middleware", req);
      const { userId } = getAuth(req); // ✅ safe for UploadThing
      console.log("userId", userId);
      // if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
    
        return {
          uploadedBy: metadata.userId,
          fileurl: file.ufsUrl,
        };
      } catch (err) {
        console.error("onUploadComplete error:", err);
        throw new UploadThingError("Upload handler failed.");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

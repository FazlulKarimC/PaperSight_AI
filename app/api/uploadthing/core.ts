import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from "@clerk/nextjs/server";
import { getGuestUserId } from "@/lib/utils";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      try {

        const { userId } = getAuth(req);
        if (!userId){
          console.warn("No userId found, using guest user ID");
          return { userId: getGuestUserId() };
        };
        return { userId };

      } catch (err) {
        console.error("Middleware error:", err);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        if (!metadata?.userId) {
          console.error("No userId in metadata");
          throw new Error("No userId provided");
        }

        console.log("Upload complete for userId:", metadata.userId);

        return {
          uploadedBy: metadata.userId,
          fileurl: file.ufsUrl,
        };
      } catch (err) {
        console.error("onUploadComplete error:", err);
        return {
          uploadedBy: metadata?.userId,
          fileurl: file.ufsUrl,
          error: "Upload completed with warnings"
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

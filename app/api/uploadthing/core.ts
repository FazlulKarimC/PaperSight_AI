import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from "@clerk/nextjs/server";
import { getGuestUserId } from "@/lib/utils";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      try {
        const { userId } = getAuth(req);
        if (!userId) {
          // Guest user - use temporary ID for uploads
          return { userId: getGuestUserId() };
        };
        return { userId };

      } catch {
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        if (!metadata?.userId) {
          throw new Error("No userId provided");
        }

        return {
          uploadedBy: metadata.userId,
          fileurl: file.ufsUrl,
        };
      } catch {
        return {
          uploadedBy: metadata?.userId,
          fileurl: file.ufsUrl,
          error: "Upload completed with warnings"
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

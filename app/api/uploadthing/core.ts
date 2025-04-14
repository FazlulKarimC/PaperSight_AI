import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from "@clerk/nextjs/server";

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
        console.log(process.env.UPLOADTHING_TOKEN);
        const { userId } = getAuth(req);
        console.log("userId", userId);
        if (!userId) throw new UploadThingError("Unauthorized");
        return { userId };
      } catch (err) {
        console.error("Middleware error:", err);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Starting onUploadComplete...");
      try {
        if (!metadata?.userId) {
          console.error("No userId in metadata");
          throw new Error("No userId provided");
        }

        console.log("Upload complete for userId:", metadata.userId);
        console.log("File details:", {
          url: file.url,
          name: file.name,
          size: file.size,
          key: file.key,
          ufsUrl: file.ufsUrl
        });

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

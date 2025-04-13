import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser } from "@clerk/nextjs/server";

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
    .middleware(async () => {
      console.log("Middleware ran");
      // This code runs on your server before upload
      const user = await currentUser();

      console.log(user);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
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

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { requireDatabase } from "@/db";
import { mediaAssets } from "@/db/schema";
import { auth } from "@/lib/auth";

const upload = createUploadthing();

export const uploadRouter = {
  cmsImage: upload({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 20,
      minFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      if (!auth) throw new UploadThingError("CMS belum dikonfigurasi.");
      const session = await auth.api.getSession({ headers: req.headers });

      if (!session || session.user.role !== "admin") {
        throw new UploadThingError("Anda harus masuk sebagai admin.");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const database = requireDatabase();
      const [asset] = await database
        .insert(mediaAssets)
        .values({
          fileKey: file.key,
          url: file.ufsUrl,
          originalName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          uploadedBy: metadata.userId,
        })
        .onConflictDoUpdate({
          target: mediaAssets.fileKey,
          set: {
            url: file.ufsUrl,
            originalName: file.name,
            mimeType: file.type,
            sizeBytes: file.size,
            updatedAt: new Date(),
          },
        })
        .returning({ id: mediaAssets.id, url: mediaAssets.url });

      return asset;
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

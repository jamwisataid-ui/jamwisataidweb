import { createHash } from "node:crypto";
import { desc, eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { pilgrimDocuments } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError } from "@/lib/mobile/api";
import { isPilgrimDocumentKind } from "@/lib/management/pilgrim-documents";
import { deletePrivateObject, privateObjectKey, putPrivateObject, validatePrivateFile } from "@/lib/management/storage";

export async function GET(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const rows = await requireDatabase().select({ id: pilgrimDocuments.id, kind: pilgrimDocuments.kind, originalName: pilgrimDocuments.originalName, mimeType: pilgrimDocuments.mimeType, sizeBytes: pilgrimDocuments.sizeBytes, reviewStatus: pilgrimDocuments.reviewStatus, reviewNote: pilgrimDocuments.reviewNote, createdAt: pilgrimDocuments.createdAt })
      .from(pilgrimDocuments).where(eq(pilgrimDocuments.pilgrimId, pilgrim.id)).orderBy(desc(pilgrimDocuments.createdAt));
    return mobileData(rows);
  } catch (error) {
    return mobileError(error, "documents-list");
  }
}

export async function POST(request: Request) {
  let objectKey: string | null = null;
  try {
    const { pilgrim } = await requireMobileSession(request);
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) throw new MobileApiError(415, "INVALID_CONTENT_TYPE", "Gunakan form data untuk mengunggah dokumen.");
    const form = await request.formData();
    const file = form.get("file");
    const kind = String(form.get("kind") ?? "");
    if (!(file instanceof File) || !isPilgrimDocumentKind(kind)) throw new MobileApiError(400, "VALIDATION_ERROR", "Pilih jenis dan file dokumen yang valid.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    validatePrivateFile(bytes, file.type, file.size);
    const extension = file.name.split(".").pop() || "bin";
    objectKey = privateObjectKey("pilgrims", pilgrim.id, extension);
    await putPrivateObject(objectKey, bytes, file.type);
    const [document] = await requireDatabase().insert(pilgrimDocuments).values({ pilgrimId: pilgrim.id, kind, originalName: file.name, objectKey, mimeType: file.type, sizeBytes: file.size, checksum: createHash("sha256").update(bytes).digest("hex") }).returning();
    return mobileData({ id: document.id, kind: document.kind, originalName: document.originalName, reviewStatus: document.reviewStatus }, { status: 201 });
  } catch (error) {
    if (objectKey) await deletePrivateObject(objectKey).catch(() => undefined);
    return mobileError(error, "documents-upload");
  }
}

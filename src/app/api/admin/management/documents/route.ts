import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { createHash } from "node:crypto";

import { requireDatabase } from "@/db";
import { auditLogs, pilgrimDocuments, pilgrims } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { deletePrivateObject, privateObjectKey, putPrivateObject, validatePrivateFile } from "@/lib/management/storage";

const kinds = new Set(["ktp", "kk", "akta_lahir", "buku_nikah", "ijazah", "paspor", "other"]);

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) return NextResponse.json({ error: "Format upload tidak valid." }, { status: 415 });
    const formData = await request.formData();
    const pilgrimId = String(formData.get("pilgrimId") ?? "");
    const kind = String(formData.get("kind") ?? "");
    const file = formData.get("file");
    if (!pilgrimId || !kinds.has(kind)) return NextResponse.json({ error: "Data jamaah atau jenis dokumen tidak valid." }, { status: 400 });
    if (!(file instanceof File) || !file.size) return NextResponse.json({ error: "Pilih file yang ingin diunggah." }, { status: 400 });

    const db = requireDatabase();
    const pilgrim = await db.query.pilgrims.findFirst({ where: eq(pilgrims.id, pilgrimId) });
    if (!pilgrim) return NextResponse.json({ error: "Jamaah tidak ditemukan." }, { status: 404 });

    const bytes = new Uint8Array(await file.arrayBuffer());
    validatePrivateFile(bytes, file.type, file.size);
    const extension = file.name.split(".").pop() ?? "bin";
    const objectKey = privateObjectKey("pilgrims", pilgrim.id, extension);
    await putPrivateObject(objectKey, bytes, file.type);
    let document: typeof pilgrimDocuments.$inferSelect;
    try {
      [document] = await db.insert(pilgrimDocuments).values({ pilgrimId: pilgrim.id, kind: kind as typeof pilgrimDocuments.$inferInsert.kind, originalName: file.name, objectKey, mimeType: file.type, sizeBytes: file.size, checksum: createHash("sha256").update(bytes).digest("hex"), uploadedBy: session.user.id }).returning();
    } catch (error) {
      await deletePrivateObject(objectKey).catch(() => undefined);
      throw error;
    }
    await db.insert(auditLogs).values({ actorId: session.user.id, action: "upload", entityType: "pilgrim_document", entityId: document.id, summary: `${kind} ${pilgrim.fullName} diunggah` });
    return NextResponse.json({ ok: true, documentId: document.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload gagal." }, { status: 500 });
  }
}

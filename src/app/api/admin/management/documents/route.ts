import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { auditLogs, pilgrimDocuments, pilgrims } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { createPrivateUploadUrl, privateObjectKey, verifyPrivateObject } from "@/lib/management/storage";

const kinds = new Set(["ktp", "kk", "akta_lahir", "buku_nikah", "ijazah", "paspor", "other"]);

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json() as { action?: string; pilgrimId?: string; kind?: string; fileName?: string; mimeType?: string; sizeBytes?: number; objectKey?: string };
    if (!body.pilgrimId || !body.kind || !kinds.has(body.kind)) return NextResponse.json({ error: "Data jamaah atau jenis dokumen tidak valid." }, { status: 400 });
    const db = requireDatabase();
    const pilgrim = await db.query.pilgrims.findFirst({ where: eq(pilgrims.id, body.pilgrimId) });
    if (!pilgrim) return NextResponse.json({ error: "Jamaah tidak ditemukan." }, { status: 404 });
    const sizeBytes = Number(body.sizeBytes);
    const mimeType = String(body.mimeType ?? "");
    if (body.action === "sign") {
      const extension = String(body.fileName ?? "file.bin").split(".").pop() ?? "bin";
      const objectKey = privateObjectKey("pilgrims", pilgrim.id, extension);
      const uploadUrl = await createPrivateUploadUrl(objectKey, mimeType, sizeBytes);
      return NextResponse.json({ uploadUrl, objectKey });
    }
    if (body.action === "complete" && body.objectKey && body.fileName) {
      const expectedPrefix = `private/pilgrims/${pilgrim.id}/`;
      if (!body.objectKey.startsWith(expectedPrefix)) return NextResponse.json({ error: "Lokasi dokumen tidak valid." }, { status: 400 });
      await verifyPrivateObject(body.objectKey, sizeBytes);
      const [document] = await db.insert(pilgrimDocuments).values({ pilgrimId: pilgrim.id, kind: body.kind as typeof pilgrimDocuments.$inferInsert.kind, originalName: body.fileName, objectKey: body.objectKey, mimeType, sizeBytes, uploadedBy: session.user.id }).returning();
      await db.insert(auditLogs).values({ actorId: session.user.id, action: "upload", entityType: "pilgrim_document", entityId: document.id, summary: `${body.kind} ${pilgrim.fullName} diunggah` });
      return NextResponse.json({ ok: true, documentId: document.id });
    }
    return NextResponse.json({ error: "Aksi upload tidak valid." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload gagal." }, { status: 500 });
  }
}

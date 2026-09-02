import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { auditLogs, pilgrimDocuments } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { createPrivateDownloadUrl } from "@/lib/management/storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  const { id } = await params;
  const document = await requireDatabase().query.pilgrimDocuments.findFirst({ where: eq(pilgrimDocuments.id, id) });
  if (!document) return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
  const preview = new URL(request.url).searchParams.get("mode") === "preview";
  await requireDatabase().insert(auditLogs).values({ actorId: session.user.id, action: preview ? "preview" : "download", entityType: "pilgrim_document", entityId: document.id, summary: `${preview ? "Preview" : "Download"} ${document.kind}: ${document.originalName}` });
  return NextResponse.redirect(await createPrivateDownloadUrl(document.objectKey, preview ? undefined : document.originalName));
}

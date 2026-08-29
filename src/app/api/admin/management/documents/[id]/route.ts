import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import { pilgrimDocuments } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { createPrivateDownloadUrl } from "@/lib/management/storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const document = await requireDatabase().query.pilgrimDocuments.findFirst({ where: eq(pilgrimDocuments.id, id) });
  if (!document) return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
  const preview = new URL(request.url).searchParams.get("mode") === "preview";
  return NextResponse.redirect(await createPrivateDownloadUrl(document.objectKey, preview ? undefined : document.originalName));
}

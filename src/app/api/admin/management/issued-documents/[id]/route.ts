import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireDatabase } from "@/db";
import { issuedDocuments } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { createPrivateDownloadUrl } from "@/lib/management/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const document = await requireDatabase().query.issuedDocuments.findFirst({ where: eq(issuedDocuments.id, id) });
  if (!document) return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
  return NextResponse.redirect(await createPrivateDownloadUrl(document.objectKey, `${document.kind}-${document.number.replaceAll("/", "-")}.pdf`));
}

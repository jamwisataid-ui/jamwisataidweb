import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireDatabase } from "@/db";
import { auditLogs, issuedDocuments } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { renderTransactionPng, type TransactionPdfSnapshot } from "@/lib/management/document-renderer";
import { createPrivateDownloadUrl } from "@/lib/management/storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  const { id } = await params;
  const document = await requireDatabase().query.issuedDocuments.findFirst({ where: eq(issuedDocuments.id, id) });
  if (!document) return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
  const png = new URL(request.url).searchParams.get("format") === "png";
  await requireDatabase().insert(auditLogs).values({ actorId: session.user.id, action: png ? "download_png" : "view_pdf", entityType: "issued_document", entityId: document.id, summary: `${document.kind === "invoice" ? "Invoice" : "Kwitansi"} ${document.number}` });
  if (png) {
    const image = await renderTransactionPng(document.snapshot as unknown as TransactionPdfSnapshot);
    return new Response(new Uint8Array(image), { headers: { "content-type": "image/png", "content-disposition": `attachment; filename="${document.kind}-${document.number.replaceAll("/", "-")}.png"`, "cache-control": "private, no-store" } });
  }
  return NextResponse.redirect(await createPrivateDownloadUrl(document.objectKey));
}

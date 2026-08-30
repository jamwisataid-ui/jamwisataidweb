import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireDatabase } from "@/db";
import { issuedDocuments } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { renderTransactionPdf, renderTransactionPng, type TransactionPdfSnapshot } from "@/lib/management/document-renderer";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const document = await requireDatabase().query.issuedDocuments.findFirst({ where: eq(issuedDocuments.id, id) });
  if (!document) return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
  if (new URL(request.url).searchParams.get("format") === "png") {
    const image = await renderTransactionPng(document.snapshot as unknown as TransactionPdfSnapshot);
    return new Response(new Uint8Array(image), { headers: { "content-type": "image/png", "content-disposition": `attachment; filename="${document.kind}-${document.number.replaceAll("/", "-")}.png"`, "cache-control": "private, no-store" } });
  }
  const pdf = await renderTransactionPdf(document.snapshot as unknown as TransactionPdfSnapshot);
  return new Response(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "content-disposition": `inline; filename="${document.kind}-${document.number.replaceAll("/", "-")}.pdf"`, "cache-control": "private, no-store" } });
}

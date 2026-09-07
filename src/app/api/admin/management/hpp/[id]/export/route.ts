import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-session";
import { getHppExportData } from "@/lib/management/hpp-data";
import { createHppExcel, createHppPdf } from "@/lib/management/hpp-export";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const data = await getHppExportData(id);
  if (!data) return NextResponse.json({ error: "Perhitungan HPP tidak ditemukan." }, { status: 404 });
  const format = new URL(request.url).searchParams.get("format") === "pdf" ? "pdf" : "xlsx";
  const safeName = data.costing.title.replace(/[^a-zA-Z0-9\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase() || "hpp-umrah";
  const body = format === "pdf" ? await createHppPdf(data) : await createHppExcel(data);
  const source = body as unknown as Uint8Array;
  const bytes = new Uint8Array(source.byteLength);
  bytes.set(source);
  return new NextResponse(bytes.buffer, { headers: { "Content-Type": format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": `attachment; filename="${safeName}.${format}"`, "Cache-Control": "private, no-store" } });
}

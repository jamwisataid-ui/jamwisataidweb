import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-session";
import { issueTransactionDocument } from "@/lib/management/issue-document";

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    const body = await request.json() as { kind?: string; bookingId?: string; paymentId?: string };
    const kind = body.kind === "receipt" ? "receipt" : body.kind === "invoice" ? "invoice" : null;
    if (!kind || !body.bookingId) return NextResponse.json({ error: "Jenis dokumen atau booking tidak valid." }, { status: 400 });
    return NextResponse.json(await issueTransactionDocument({ kind, bookingId: body.bookingId, paymentId: body.paymentId, actorId: session.user.id }));
  } catch (error) {
    console.error("Document issue failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "PDF gagal diterbitkan." }, { status: 500 });
  }
}

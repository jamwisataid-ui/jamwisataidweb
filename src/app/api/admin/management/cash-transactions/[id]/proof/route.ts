import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireDatabase } from "@/db";
import { cashTransactions } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import { createPrivateDownloadUrl } from "@/lib/management/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const database = requireDatabase();
  const [transaction] = await database.select({
    objectKey: cashTransactions.transferProofObjectKey,
    originalName: cashTransactions.transferProofOriginalName,
  }).from(cashTransactions).where(eq(cashTransactions.id, id)).limit(1);

  if (!transaction?.objectKey) return NextResponse.json({ error: "Bukti transfer tidak ditemukan." }, { status: 404 });
  return NextResponse.redirect(await createPrivateDownloadUrl(transaction.objectKey, transaction.originalName || "bukti-transfer"));
}

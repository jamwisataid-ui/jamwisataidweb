import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireDatabase } from "@/db";
import { pilgrimDocuments } from "@/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError } from "@/lib/mobile/api";
import { createPrivateDownloadUrl } from "@/lib/management/storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    const { id } = await params;
    const document = await requireDatabase().query.pilgrimDocuments.findFirst({ where: and(eq(pilgrimDocuments.id, id), eq(pilgrimDocuments.pilgrimId, pilgrim.id)) });
    if (!document) throw new MobileApiError(404, "DOCUMENT_NOT_FOUND", "Dokumen tidak ditemukan.");
    const preview = new URL(request.url).searchParams.get("mode") === "preview";
    const url = await createPrivateDownloadUrl(document.objectKey, preview ? undefined : document.originalName);
    if (new URL(request.url).searchParams.get("format") === "json") return mobileData({ url });
    return NextResponse.redirect(url);
  } catch (error) {
    return mobileError(error, "document-file");
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { mobileNotifications } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";

const allowedActions = new Set(["/(tabs)/account", "/(tabs)/notifications", "/documents", "/journey", "/payments", "/live-muthowif", "/download-app"]);
const notificationAction = z.string().trim().max(300).refine((value) => allowedActions.has(value) || /^\/payment\/[0-9a-f-]{36}(?:\?.*)?$/i.test(value), "Action notifikasi tidak valid.");
const schema = z.object({ pilgrimId: z.uuid(), title: z.string().trim().min(3).max(100), body: z.string().trim().min(3).max(500), deepLink: notificationAction.optional() });

export async function POST(request: Request) {
  const session = await requireAdminSession();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Judul dan isi notifikasi wajib diisi." }, { status: 400 });
  const [notification] = await requireDatabase().insert(mobileNotifications).values({ ...parsed.data, kind: "admin", createdBy: session.user.id }).returning({ id: mobileNotifications.id, createdAt: mobileNotifications.createdAt });
  return NextResponse.json({ ok: true, notification });
}

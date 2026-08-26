import { NextResponse } from "next/server";
import { z } from "zod";

import { recordTrafficEvent } from "@/lib/analytics";

export const runtime = "nodejs";

const trafficEventSchema = z.object({
  type: z.enum(["pageview", "heartbeat"]),
  sessionId: z.uuid(),
  visitorId: z.uuid(),
  path: z.string().startsWith("/").max(300).refine((path) => !path.startsWith("/admin")),
  referrer: z.string().max(160).optional(),
});

export async function POST(request: Request) {
  const parsed = trafficEventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  await recordTrafficEvent(parsed.data, request.headers.get("user-agent") ?? "");
  return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}

import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireDatabase } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireDatabase().execute(sql`select 1`);

    return NextResponse.json(
      { status: "ok", service: "jamwisata-web" },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("[health] readiness check failed", error);

    return NextResponse.json(
      { status: "unavailable", service: "jamwisata-web" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}

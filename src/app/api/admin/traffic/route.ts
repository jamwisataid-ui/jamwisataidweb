import { NextResponse } from "next/server";

import { readAdminSession } from "@/lib/admin-auth";
import { getTrafficSnapshot } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await readAdminSession())) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 401 });
  }

  return NextResponse.json(await getTrafficSnapshot(), {
    headers: { "cache-control": "no-store, max-age=0" },
  });
}

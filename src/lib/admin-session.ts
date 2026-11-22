import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { readAdminSession } from "@/lib/admin-auth";

export async function getAdminSession() {
  return readAdminSession();
}
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** True when `error` is the redirect Next.js throws from `requireAdminSession()`. */
export function isRedirectSignal(error: unknown) {
  const digest = (error as { digest?: unknown } | null)?.digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

/** API routes must answer JSON; a swallowed login redirect otherwise surfaces as a 500 "NEXT_REDIRECT". */
export function adminSessionExpiredResponse(error: unknown) {
  return isRedirectSignal(error)
    ? NextResponse.json({ error: "Sesi login admin sudah berakhir. Silakan muat ulang halaman lalu login kembali." }, { status: 401 })
    : null;
}

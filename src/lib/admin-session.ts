import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function getAdminSession() {
  if (!auth) return null;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") return null;

  return session;
}
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

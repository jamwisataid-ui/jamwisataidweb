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

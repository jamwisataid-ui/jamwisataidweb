import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Masuk CMS" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <AdminAuthShell eyebrow="PENGELOLA WEBSITE" title="Selamat datang kembali." description="Masuk untuk mengelola program perjalanan dan informasi jamaah."><LoginForm /></AdminAuthShell>;
}

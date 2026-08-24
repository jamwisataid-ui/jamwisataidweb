import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export const metadata = { title: "Buat kata sandi baru" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return <AdminAuthShell eyebrow="KEAMANAN AKUN" title="Buat kata sandi baru" description="Masukkan kata sandi baru yang mudah Anda ingat tetapi sulit ditebak."><ResetPasswordForm token={token} /></AdminAuthShell>;
}

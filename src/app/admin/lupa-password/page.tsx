import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";

export const metadata = { title: "Lupa kata sandi" };

export default function ForgotPasswordPage() {
  return <AdminAuthShell eyebrow="PEMULIHAN AKUN" title="Lupa kata sandi?" description="Masukkan email admin. Kami akan mengirim tautan untuk membuat kata sandi baru."><ForgotPasswordForm /></AdminAuthShell>;
}

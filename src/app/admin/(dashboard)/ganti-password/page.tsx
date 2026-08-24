import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata = { title: "Ganti kata sandi" };

export default function ChangePasswordPage() {
  return <><AdminPageHeader eyebrow="AKUN ADMIN" title="Ganti kata sandi" description="Masukkan kata sandi saat ini, lalu buat kata sandi baru." backHref="/admin" /><ChangePasswordForm /></>;
}

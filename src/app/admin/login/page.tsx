import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Masuk CMS" };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <main className="admin-login-page"><div className="admin-login-panel"><div className="admin-login-brand"><span>JW</span><p>JARIS AMMAR MADANI</p><h1>JAM WISATA</h1><small>Setiap Waktu Bernilai Ibadah</small></div><div className="admin-login-card"><p className="admin-eyebrow">CONTENT MANAGEMENT</p><h2>Selamat datang kembali</h2><p>Kelola perjalanan, informasi, dan cerita jamaah dalam satu tempat.</p><LoginForm configured={Boolean(process.env.DATABASE_URL)} /></div></div></main>;
}

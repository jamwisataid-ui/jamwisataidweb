import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Masuk CMS" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <main className="admin-login-page">
    <div className="admin-login-panel">
      <section className="admin-login-brand" aria-label="Jam Wisata">
        <Image src="/images/admin-logo.webp" alt="Jaris Ammar Madani — Jam Wisata" width={640} height={278} priority />
        <div><span>AMANAH</span><i /><span>PELAYANAN</span><i /><span>ILMU</span></div>
        <blockquote>“Kami mendampingi setiap langkah agar perjalanan menjadi pengalaman ibadah yang bermakna.”</blockquote>
      </section>
      <section className="admin-login-card">
        <div className="admin-login-heading"><span className="admin-login-heading-logo"><Image src="/images/admin-logo.webp" alt="Jam Wisata" width={640} height={278} /></span><div><p className="admin-eyebrow">CONTENT MANAGEMENT</p><span>Portal internal Jam Wisata</span></div></div>
        <h1>Selamat datang kembali.</h1>
        <p>Masuk untuk mengelola program perjalanan dan informasi jamaah.</p>
        <LoginForm />
        <footer><span>Portal aman untuk pengelola resmi</span><span>•</span><span>jamwisata.id</span></footer>
      </section>
    </div>
  </main>;
}

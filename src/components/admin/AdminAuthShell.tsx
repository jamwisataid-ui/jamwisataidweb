import Image from "next/image";

export function AdminAuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <main className="admin-login-page">
    <div className="admin-login-panel">
      <section className="admin-login-brand" aria-label="Jam Wisata">
        <Image src="/images/admin-logo.webp" alt="Jaris Ammar Madani — Jam Wisata" width={640} height={278} priority />
        <div><span>AMANAH</span><i /><span>PELAYANAN</span><i /><span>ILMU</span></div>
        <blockquote>“Kami mendampingi setiap langkah agar perjalanan menjadi pengalaman ibadah yang bermakna.”</blockquote>
      </section>
      <section className="admin-login-card">
        <div className="admin-login-heading">
          <span className="admin-login-heading-logo"><Image src="/images/admin-logo.webp" alt="Jam Wisata" width={640} height={278} priority /></span>
          <p>{eyebrow}</p>
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
        <footer><span>Portal aman untuk pengelola resmi</span><span>•</span><span>jamwisata.id</span></footer>
      </section>
    </div>
  </main>;
}

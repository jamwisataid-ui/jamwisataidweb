"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpenText,
  Boxes,
  CircleGauge,
  Compass,
  FileQuestion,
  GalleryHorizontal,
  Globe2,
  LogOut,
  Menu,
  MessageSquareQuote,
  PackageOpen,
  Settings2,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";

const nav = [
  { label: "Utama", items: [["/admin", "Ringkasan", CircleGauge], ["/admin/paket", "Paket & jadwal", PackageOpen], ["/admin/artikel", "Artikel", BookOpenText]] },
  { label: "Konten", items: [["/admin/konten/testimonial", "Testimonial", MessageSquareQuote], ["/admin/konten/gallery", "Galeri", GalleryHorizontal], ["/admin/konten/destination", "Destinasi", Compass], ["/admin/konten/faq", "FAQ", FileQuestion], ["/admin/konten/service", "Layanan", Boxes]] },
  { label: "Pengaturan", items: [["/admin/konten/homepage", "Homepage", Globe2], ["/admin/konten/site-settings", "Informasi situs", Settings2]] },
] as const;

export function AdminSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      <header className="admin-mobile-bar">
        <Link href="/admin" aria-label="Dashboard Jam Wisata"><Image src="/images/logo-emblem.png" alt="" width={38} height={38} /><span><strong>JAM WISATA</strong><small>Content Management</small></span></Link>
        <button type="button" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
      </header>
      {open ? <button className="admin-sidebar-backdrop" aria-label="Tutup menu" onClick={() => setOpen(false)} /> : null}
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <button className="admin-sidebar-close" type="button" aria-label="Tutup menu" onClick={() => setOpen(false)}><X /></button>
      <div className="admin-brand">
        <Image src="/images/logo-white.png" alt="Jam Wisata" width={220} height={81} priority />
        <span>CONTENT MANAGEMENT</span>
      </div>
      <nav aria-label="Navigasi CMS" className="admin-nav">
        {nav.map((group) => <section key={group.label}><p>{group.label}</p>{group.items.map(([href, label, Icon]) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link onClick={() => setOpen(false)} key={href} href={href} className={active ? "active" : ""}><Icon aria-hidden /><span>{label}</span>{active ? <i /> : null}</Link>;
        })}</section>)}
      </nav>
      <a className="admin-view-site" href="/" target="_blank" rel="noreferrer"><SquareArrowOutUpRight aria-hidden /><span>Lihat website</span></a>
      <div className="admin-profile">
        <span>{name.slice(0, 1).toUpperCase()}</span>
        <div><strong>{name}</strong><small>{email}</small></div>
        <button type="button" onClick={logout} aria-label="Keluar dari CMS"><LogOut className="size-4" /></button>
      </div>
      </aside>
    </>
  );
}

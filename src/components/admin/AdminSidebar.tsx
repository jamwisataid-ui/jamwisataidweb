"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpenText,
  House,
  FileQuestion,
  GalleryHorizontal,
  LogOut,
  Menu,
  MessageSquareQuote,
  PackageOpen,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";

const nav = [
  { label: "Menu utama", items: [["/admin", "Beranda", House], ["/admin/paket", "Paket Umrah", PackageOpen], ["/admin/artikel", "Artikel", BookOpenText]] },
  { label: "Konten homepage", items: [["/admin/konten/gallery", "Galeri foto", GalleryHorizontal], ["/admin/konten/testimonial", "Video jamaah", MessageSquareQuote], ["/admin/konten/faq", "Tanya jawab", FileQuestion]] },
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
      <header className={`admin-mobile-bar ${open ? "menu-open" : ""}`}>
        <Link href="/admin" aria-label="Dashboard Jam Wisata"><Image src="/images/admin-logo.webp" alt="Jam Wisata" width={640} height={278} priority /></Link>
        <button type="button" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
      </header>
      {open ? <button className="admin-sidebar-backdrop" aria-label="Tutup menu" onClick={() => setOpen(false)} /> : null}
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <button className="admin-sidebar-close" type="button" aria-label="Tutup menu" onClick={() => setOpen(false)}><X /></button>
      <div className="admin-brand">
        <Image src="/images/admin-logo.webp" alt="Jam Wisata" width={640} height={278} priority />
        <span>PENGELOLA WEBSITE</span>
      </div>
      <nav aria-label="Navigasi CMS" className="admin-nav">
        {nav.map((group) => <section key={group.label}><p>{group.label}</p>{group.items.map(([href, label, Icon]) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link onClick={() => setOpen(false)} key={href} href={href} className={active ? "active" : ""}><Icon aria-hidden /><span>{label}</span>{active ? <i /> : null}</Link>;
        })}</section>)}
      </nav>
      <a className="admin-view-site" href="/" target="_blank" rel="noreferrer"><SquareArrowOutUpRight aria-hidden /><span>Buka website</span></a>
      <div className="admin-profile">
        <span>{name.slice(0, 1).toUpperCase()}</span>
        <div><strong>{name}</strong><small>{email}</small></div>
        <button type="button" onClick={logout} aria-label="Keluar dari dashboard" title="Keluar"><LogOut className="size-4" /></button>
      </div>
      </aside>
    </>
  );
}

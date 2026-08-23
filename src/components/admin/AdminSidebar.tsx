"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenText,
  Boxes,
  CircleGauge,
  Compass,
  FileQuestion,
  GalleryHorizontal,
  Globe2,
  LogOut,
  MessageSquareQuote,
  PackageOpen,
  Settings2,
} from "lucide-react";

const nav = [
  ["/admin", "Ringkasan", CircleGauge],
  ["/admin/paket", "Paket & Jadwal", PackageOpen],
  ["/admin/artikel", "Artikel", BookOpenText],
  ["/admin/konten/testimonial", "Testimonial", MessageSquareQuote],
  ["/admin/konten/gallery", "Galeri", GalleryHorizontal],
  ["/admin/konten/destination", "Destinasi", Compass],
  ["/admin/konten/faq", "FAQ", FileQuestion],
  ["/admin/konten/service", "Layanan", Boxes],
  ["/admin/konten/homepage", "Homepage", Globe2],
  ["/admin/konten/site-settings", "Pengaturan", Settings2],
] as const;

export function AdminSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="admin-brand-mark">JW</span>
        <div><strong>JAM WISATA</strong><small>Content Management</small></div>
      </div>
      <nav aria-label="Navigasi CMS" className="admin-nav">
        {nav.map(([href, label, Icon]) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} className={active ? "active" : ""}><Icon aria-hidden className="size-4" /><span>{label}</span></Link>;
        })}
      </nav>
      <div className="admin-profile">
        <span>{name.slice(0, 1).toUpperCase()}</span>
        <div><strong>{name}</strong><small>{email}</small></div>
        <button type="button" onClick={logout} aria-label="Keluar dari CMS"><LogOut className="size-4" /></button>
      </div>
    </aside>
  );
}

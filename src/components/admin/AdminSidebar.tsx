"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BadgeDollarSign,
  BookOpenText,
  Boxes,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  ContactRound,
  FileCheck2,
  House,
  FileQuestion,
  GalleryHorizontal,
  Globe2,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  PackageOpen,
  PlaneTakeoff,
  ReceiptText,
  SquareArrowOutUpRight,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

const cmsNav = [
  { label: "Menu utama", items: [["/admin", "Beranda", House], ["/admin/paket", "Paket Umrah", PackageOpen], ["/admin/artikel", "Artikel", BookOpenText]] },
  { label: "Konten homepage", items: [["/admin/konten/gallery", "Galeri foto", GalleryHorizontal], ["/admin/konten/testimonial", "Video jamaah", MessageSquareQuote], ["/admin/konten/faq", "Tanya jawab", FileQuestion]] },
] as const;

const managementNav = [
  { label: "Ringkasan", items: [["/admin/manajemen", "Ringkasan", LayoutDashboard]] },
  { label: "Operasional", items: [["/admin/manajemen/jamaah", "Data Jamaah", UsersRound], ["/admin/manajemen/dokumen", "Dokumen Jamaah", FileCheck2], ["/admin/manajemen/keberangkatan", "Keberangkatan", PlaneTakeoff], ["/admin/manajemen/manifest-rooming", "Manifest & Rooming", ClipboardCheck]] },
  { label: "Keuangan", items: [["/admin/manajemen/pembayaran", "Pembayaran", WalletCards], ["/admin/manajemen/invoice-kwitansi", "Invoice & Kwitansi", ReceiptText], ["/admin/manajemen/keuangan", "Kas & Keuangan", BadgeDollarSign], ["/admin/manajemen/laporan", "Pusat Laporan", ChartNoAxesCombined]] },
  { label: "Pemasaran & logistik", items: [["/admin/manajemen/agen-referral", "Agen & Referral", ContactRound], ["/admin/manajemen/stok", "Stok Perlengkapan", Boxes]] },
] as const;

export function AdminSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const managementMode = pathname.startsWith("/admin/manajemen");
  const nav = managementMode ? managementNav : cmsNav;
  const dashboardHref = managementMode ? "/admin/manajemen" : "/admin";

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      <header className={`admin-mobile-bar ${open ? "menu-open" : ""}`}>
        <Link className="admin-mobile-logo" href={dashboardHref} aria-label="Dashboard Jam Wisata"><Image src="/images/admin-logo.webp" alt="Jam Wisata" width={640} height={278} priority /></Link>
        <button type="button" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
      </header>
      {open ? <button className="admin-sidebar-backdrop" aria-label="Tutup menu" onClick={() => setOpen(false)} /> : null}
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <button className="admin-sidebar-close" type="button" aria-label="Tutup menu" onClick={() => setOpen(false)}><X /></button>
      <div className="admin-brand">
        <Image src="/images/admin-logo.webp" alt="Jam Wisata" width={640} height={278} priority />
        <span>{managementMode ? "MANAJEMEN INTERNAL" : "PENGELOLA WEBSITE"}</span>
      </div>
      <section className="admin-mode-switch" aria-label="Pilih mode dashboard">
        <p>Mode dashboard</p>
        <div>
          <Link onClick={() => setOpen(false)} href="/admin" className={managementMode ? "" : "active"} aria-current={managementMode ? undefined : "page"}><Globe2 aria-hidden /><span>CMS</span></Link>
          <Link onClick={() => setOpen(false)} href="/admin/manajemen" className={managementMode ? "active" : ""} aria-current={managementMode ? "page" : undefined}><Building2 aria-hidden /><span>Internal</span></Link>
        </div>
      </section>
      <nav aria-label={managementMode ? "Navigasi manajemen internal" : "Navigasi CMS"} className="admin-nav">
        {nav.map((group) => <section key={group.label}><p>{group.label}</p>{group.items.map(([href, label, Icon]) => {
          const active = href === dashboardHref ? pathname === href : pathname.startsWith(href);
          return <Link onClick={() => setOpen(false)} key={href} href={href} className={active ? "active" : ""}><Icon aria-hidden /><span>{label}</span>{active ? <i /> : null}</Link>;
        })}</section>)}
      </nav>
      <div className="admin-sidebar-utility">
        <Link className="admin-account-link" onClick={() => setOpen(false)} href="/admin/ganti-password"><KeyRound aria-hidden /><span>Ganti kata sandi</span></Link>
        <a className="admin-view-site" href="/" target="_blank" rel="noreferrer"><SquareArrowOutUpRight aria-hidden /><span>Buka website</span></a>
      </div>
      <div className="admin-profile">
        <span>{name.slice(0, 1).toUpperCase()}</span>
        <div><strong>{name}</strong><small>{email}</small></div>
        <button type="button" onClick={logout} aria-label="Keluar dari dashboard" title="Keluar"><LogOut className="size-4" /></button>
      </div>
      </aside>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3 } from "lucide-react";

export function AdminDetailFloatingBar({
  packageId,
  category = "umrah",
}: {
  packageId: string;
  category?: string;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-2.5 rounded-full border border-[#D5A12B]/50 bg-[#061A2F]/95 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105">
      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-slate-300">Mode Admin</span>
      <span className="text-white/30">|</span>
      <Link
        href={`/admin/paket/${packageId}?category=${category}`}
        className="flex items-center gap-1.5 font-bold text-[#F5D97A] hover:underline"
      >
        <Edit3 className="size-3.5" />
        <span>Edit Paket Ini di CMS</span>
      </Link>
    </div>
  );
}

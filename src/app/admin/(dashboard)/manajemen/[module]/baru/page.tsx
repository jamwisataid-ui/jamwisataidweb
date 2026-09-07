import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ManagementCreatePage } from "@/components/admin/ManagementCrudPage";
import { HppCreatePage } from "@/components/admin/HppPages";
import { getManagementContext } from "@/lib/management/data";
import { getHppContext } from "@/lib/management/hpp-data";
import { getManagementModule } from "@/lib/management/modules";

export const metadata: Metadata = { title: "Tambah Data Manajemen" };

export default async function ManagementCreateRoute({ params, searchParams }: { params: Promise<{ module: string }>; searchParams: Promise<{ jenis?: string; booking?: string }> }) {
  const [{ module }, query] = await Promise.all([params, searchParams]);
  if (module === "dokumen") redirect("/admin/manajemen/jamaah");
  if (!getManagementModule(module) || ["laporan", "pengaturan"].includes(module)) notFound();
  if (module === "hpp-umroh") return <HppCreatePage data={await getHppContext()} />;
  return <ManagementCreatePage module={module} kind={query.jenis} initialBookingId={query.booking} data={await getManagementContext()} />;
}

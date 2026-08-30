import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ManagementCreatePage } from "@/components/admin/ManagementCrudPage";
import { getManagementContext } from "@/lib/management/data";
import { getManagementModule } from "@/lib/management/modules";

export const metadata: Metadata = { title: "Tambah Data Manajemen" };

export default async function ManagementCreateRoute({ params, searchParams }: { params: Promise<{ module: string }>; searchParams: Promise<{ jenis?: string; booking?: string }> }) {
  const [{ module }, query] = await Promise.all([params, searchParams]);
  if (module === "dokumen") redirect("/admin/manajemen/jamaah");
  if (!getManagementModule(module) || ["laporan", "pengaturan"].includes(module)) notFound();
  return <ManagementCreatePage module={module} kind={query.jenis} initialBookingId={query.booking} data={await getManagementContext()} />;
}

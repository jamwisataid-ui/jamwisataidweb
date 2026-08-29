import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ManagementCreatePage } from "@/components/admin/ManagementCrudPage";
import { getManagementContext } from "@/lib/management/data";
import { getManagementModule } from "@/lib/management/modules";

export const metadata: Metadata = { title: "Tambah Data Manajemen" };

export default async function ManagementCreateRoute({ params, searchParams }: { params: Promise<{ module: string }>; searchParams: Promise<{ jenis?: string }> }) {
  const [{ module }, query] = await Promise.all([params, searchParams]);
  if (!getManagementModule(module) || ["laporan", "pengaturan"].includes(module)) notFound();
  return <ManagementCreatePage module={module} kind={query.jenis} data={await getManagementContext()} />;
}

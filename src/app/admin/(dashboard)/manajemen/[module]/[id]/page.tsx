import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ManagementDetailPage } from "@/components/admin/ManagementCrudPage";
import { getManagementContext } from "@/lib/management/data";
import { getManagementModule } from "@/lib/management/modules";

export const metadata: Metadata = { title: "Detail Data Manajemen" };

export default async function ManagementDetailRoute({ params }: { params: Promise<{ module: string; id: string }> }) {
  const { module, id } = await params;
  if (module === "dokumen") redirect(`/admin/manajemen/jamaah/${id}`);
  if (!getManagementModule(module) || ["laporan", "pengaturan"].includes(module)) notFound();
  const data = await getManagementContext();
  const page = <ManagementDetailPage module={module} id={id} data={data} />;
  const exists = module === "jamaah" ? data.pilgrims.some((row) => row.id === id)
    : module === "keberangkatan" ? data.bookings.some((row) => row.id === id)
    : module === "pembayaran" ? data.payments.some((row) => row.id === id)
    : module === "keuangan" ? data.accounts.some((row) => row.id === id) || data.cashTransactions.some((row) => row.id === id)
    : module === "agen-referral" ? data.agents.some((row) => row.id === id)
    : module === "stok" ? data.inventory.some((row) => row.id === id)
    : module === "manifest-room-list" ? data.registrations.some((row) => row.id === id)
    : module === "invoice-kwitansi" ? data.documents.some((row) => row.id === id)
    : false;
  if (!exists) notFound();
  return page;
}

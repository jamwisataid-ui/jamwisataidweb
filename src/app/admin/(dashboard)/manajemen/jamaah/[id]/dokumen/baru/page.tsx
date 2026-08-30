import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ManagementPilgrimDocumentCreatePage } from "@/components/admin/ManagementCrudPage";
import { getManagementContext } from "@/lib/management/data";

export const metadata: Metadata = { title: "Upload Dokumen Jamaah" };

export default async function UploadPilgrimDocumentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ jenis?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const data = await getManagementContext();
  if (!data.pilgrims.some((item) => item.id === id)) notFound();
  return <ManagementPilgrimDocumentCreatePage id={id} data={data} initialKind={query.jenis} />;
}

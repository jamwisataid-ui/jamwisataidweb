import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ManagementPilgrimDocumentCreatePage } from "@/components/admin/ManagementCrudPage";
import { getManagementContext } from "@/lib/management/data";

export const metadata: Metadata = { title: "Upload Dokumen Jamaah" };

export default async function UploadPilgrimDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getManagementContext();
  if (!data.pilgrims.some((item) => item.id === id)) notFound();
  return <ManagementPilgrimDocumentCreatePage id={id} data={data} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ManagementPilgrimEditPage } from "@/components/admin/ManagementCrudPage";
import { getManagementContext } from "@/lib/management/data";

export const metadata: Metadata = { title: "Edit Data Jamaah" };

export default async function EditPilgrimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getManagementContext();
  if (!data.pilgrims.some((item) => item.id === id)) notFound();
  return <ManagementPilgrimEditPage id={id} data={data} />;
}

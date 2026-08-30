import { notFound } from "next/navigation";

import { ManagementAccountEditPage } from "@/components/admin/ManagementCrudPage";
import { getManagementContext } from "@/lib/management/data";

export const dynamic = "force-dynamic";

export default async function EditManagementAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getManagementContext();
  if (!data.accounts.some((account) => account.id === id)) notFound();
  return <ManagementAccountEditPage id={id} data={data} />;
}

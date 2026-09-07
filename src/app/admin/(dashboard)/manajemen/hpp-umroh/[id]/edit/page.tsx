import { notFound } from "next/navigation";
import { HppEditPage } from "@/components/admin/HppPages";
import { getHppCosting } from "@/lib/management/hpp-data";

export const metadata = { title: "Edit HPP Umrah" };

export default async function EditHppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getHppCosting(id);
  if (!data.costing || !["draft", "final"].includes(data.costing.status)) notFound();
  return <HppEditPage data={data} costing={data.costing} />;
}

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ManagementWorkspace } from "@/components/admin/ManagementWorkspace";
import { HppListPage } from "@/components/admin/HppPages";
import { getManagementContext } from "@/lib/management/data";
import { getHppContext } from "@/lib/management/hpp-data";
import { getManagementModule, managementModules } from "@/lib/management/modules";

export function generateStaticParams() {
  return managementModules.map(({ slug }) => ({ module: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module: slug } = await params;
  if (slug === "dokumen") redirect("/admin/manajemen/jamaah");
  const selectedModule = getManagementModule(slug);
  return selectedModule ? { title: selectedModule.title } : {};
}

export default async function ManagementModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  if (slug === "dokumen") redirect("/admin/manajemen/jamaah");
  const selectedModule = getManagementModule(slug);
  if (!selectedModule) notFound();
  if (slug === "hpp-umroh") return <HppListPage data={await getHppContext()} />;

  return <ManagementWorkspace module={slug} data={await getManagementContext()} />;
}

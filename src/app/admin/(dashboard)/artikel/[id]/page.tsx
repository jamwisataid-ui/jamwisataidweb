import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getArticleAdmin } from "@/lib/cms/admin";
export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const values = await getArticleAdmin(id); if (!values) notFound(); return <><AdminPageHeader eyebrow="Edit artikel" title={String(values.title)} description="Perubahan draft tidak langsung mengubah artikel publik." backHref="/admin/artikel" /><ArticleForm values={values} /></>; }

import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getArticleAdmin } from "@/lib/cms/admin";
export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const values = await getArticleAdmin(id); if (!values) notFound(); return <><header className="admin-page-header"><div><p className="admin-eyebrow">EDIT ARTIKEL</p><h1>{String(values.title)}</h1><p>Perubahan draft tidak langsung mengubah artikel publik.</p></div></header><ArticleForm values={values} /></>; }

import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ArticleForm } from "@/components/admin/ArticleForm";
export default function NewArticlePage() { return <><AdminPageHeader eyebrow="Artikel baru" title="Tulis panduan untuk jamaah" description="Sampaikan informasi dengan jelas dan simpan sebagai draft sampai siap diterbitkan." backHref="/admin/artikel" /><ArticleForm /></>; }

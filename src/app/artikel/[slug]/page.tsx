import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/site/ArticleContent";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { getPublishedArticleBySlug, getPublishedArticles } from "@/lib/cms/public";

type Props = { params: Promise<{ slug: string }> };

function formatArticleDate(value: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateStaticParams() {
  return (await getPublishedArticles()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getPublishedArticleBySlug((await params).slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical: `/artikel/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getPublishedArticleBySlug((await params).slug);
  if (!article) notFound();
  const publishedDate = formatArticleDate(article.publishedAt);
  const whatsappText = encodeURIComponent(`Assalamu'alaikum Jam Wisata, saya membaca artikel "${article.title}" dan ingin konsultasi.`);

  return (
    <main className="jam-page min-h-screen article-detail-page">
      <PremiumHeader />
      <article>
        <section className="article-detail-hero">
          <div className="article-detail-hero-copy">
            <Link href="/artikel" className="article-back-link">Kembali ke artikel</Link>
            <p>ARTIKEL JAM WISATA</p>
            <h1>{article.title}</h1>
            <span>{article.excerpt}</span>
            <div className="article-detail-meta">
              {publishedDate ? <time dateTime={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}>{publishedDate}</time> : null}
              <a href={`https://wa.me/6281222500200?text=${whatsappText}`} target="_blank" rel="noopener noreferrer">Konsultasi via WhatsApp</a>
            </div>
          </div>
          {article.coverUrl ? (
            <div className="article-detail-cover">
              <Image src={article.coverUrl} alt={article.title} fill priority sizes="(min-width: 1024px) 46vw, 100vw" />
            </div>
          ) : null}
        </section>

        <section className="article-reading-wrap">
          <aside className="article-reading-note">
            <span>Panduan ringkas</span>
            <p>Disusun untuk membantu jamaah memahami persiapan perjalanan dengan bahasa yang lebih tenang dan mudah dibaca.</p>
          </aside>
          <ArticleContent document={article.content} />
        </section>
      </article>
      <ModernProofFooter />
    </main>
  );
}

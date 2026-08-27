import type { Metadata } from "next";
import Image from "next/image";
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

  return (
    <main className="jam-page min-h-screen">
      <PremiumHeader />
      <article className="article-detail">
        <header>
          <p>ARTIKEL & INFORMASI</p>
          <h1>{article.title}</h1>
          {publishedDate ? <span>{publishedDate}</span> : null}
        </header>
        {article.coverUrl ? (
          <div className="article-cover">
            <Image src={article.coverUrl} alt={article.title} fill priority sizes="(min-width: 900px) 1000px, 100vw" />
          </div>
        ) : null}
        <ArticleContent document={article.content} />
      </article>
      <ModernProofFooter />
    </main>
  );
}

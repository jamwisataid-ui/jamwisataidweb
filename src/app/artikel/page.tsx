import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { getPublishedArticles } from "@/lib/cms/public";

export const metadata: Metadata = { title: "Artikel & Panduan Umrah", description: "Panduan persiapan, manasik, dan informasi perjalanan ibadah dari Jam Wisata.", alternates: { canonical: "/artikel" } };
export default async function ArticlesPage() { const articles = await getPublishedArticles(); return <main className="jam-page min-h-screen"><PremiumHeader /><section className="article-hero"><p>ARTIKEL & INFORMASI</p><h1>Bekal Ilmu untuk<br />Perjalanan yang Bermakna.</h1><span>Persiapan yang baik membantu jamaah menjalani ibadah dengan lebih tenang dan terarah.</span></section><section className="article-grid">{articles.length ? articles.map((article) => <Link href={`/artikel/${article.slug}`} key={article.id} className="article-card">{article.coverUrl ? <div><Image src={article.coverUrl} alt={article.title} fill sizes="(min-width: 900px) 33vw, 100vw" /></div> : null}<small>PANDUAN UMRAH</small><h2>{article.title}</h2><p>{article.excerpt}</p><span>Baca selengkapnya →</span></Link>) : <p>Artikel sedang dipersiapkan.</p>}</section><ModernProofFooter /></main>; }

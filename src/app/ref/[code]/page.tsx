import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, MessageCircleMore, ShieldCheck } from "lucide-react";

import { ReferralLeadForm } from "@/components/site/ReferralLeadForm";
import { getReferralPage } from "@/lib/management/data";

export default async function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getReferralPage(code);
  if (!data) notFound();
  return <main className="referral-page"><section className="referral-intro"><Image src="/images/admin-logo.webp" alt="Jam Wisata" width={640} height={278} priority /><p className="referral-eyebrow">KONSULTASI UMROH TERPERCAYA</p><h1>Rencanakan perjalanan ibadah dengan tenang.</h1><p>Isi data singkat berikut. Tim Jam Wisata akan membantu memilih paket dan menjawab pertanyaan Anda melalui WhatsApp.</p><div className="referral-agent"><span><BadgeCheck /></span><div><small>Direferensikan oleh</small><strong>{data.agent.name}</strong></div></div><ul><li><ShieldCheck />Data digunakan hanya untuk konsultasi</li><li><MessageCircleMore />Langsung terhubung ke tim Jam Wisata</li></ul></section><section className="referral-form-card"><p>LANGKAH PERTAMA</p><h2>Mulai konsultasi</h2><ReferralLeadForm code={data.agent.referralCode} packages={data.packages} /></section></main>;
}

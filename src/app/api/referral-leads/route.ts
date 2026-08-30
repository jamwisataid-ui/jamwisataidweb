import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireDatabase } from "@/db";
import { agents, packages, referralLeads } from "@/db/schema";

const schema = z.object({
  referralCode: z.string().min(3),
  name: z.string().trim().min(2),
  whatsapp: z.string().trim().min(8),
  email: z.union([z.literal(""), z.string().email()]).optional(),
  packageId: z.union([z.literal(""), z.string()]).optional(),
  sourcePath: z.string().startsWith("/").max(300).optional(),
  utmSource: z.string().max(160).optional(),
  utmCampaign: z.string().max(160).optional(),
  utmContent: z.string().max(160).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Mohon periksa nama dan nomor WhatsApp." }, { status: 400 });
    const db = requireDatabase();
    const agent = await db.query.agents.findFirst({ where: eq(agents.referralCode, parsed.data.referralCode.toLowerCase()) });
    if (!agent || agent.status !== "active") return NextResponse.json({ error: "Link agen tidak aktif." }, { status: 404 });
    const pkg = parsed.data.packageId ? await db.query.packages.findFirst({ where: eq(packages.id, parsed.data.packageId) }) : null;
    const [lead] = await db.insert(referralLeads).values({ agentId: agent.id, packageId: pkg?.id ?? null, name: parsed.data.name, whatsapp: parsed.data.whatsapp, email: parsed.data.email || null, sourcePath: parsed.data.sourcePath || `/ref/${agent.referralCode}`, utmSource: parsed.data.utmSource || null, utmCampaign: parsed.data.utmCampaign || null, utmContent: parsed.data.utmContent || null }).returning({ id: referralLeads.id });
    const campaign = [parsed.data.utmSource, parsed.data.utmCampaign, parsed.data.utmContent].filter(Boolean).join(" · ");
    const message = `Assalamu'alaikum Jam Wisata, saya ${parsed.data.name} ingin konsultasi${pkg ? ` paket ${pkg.name}` : " umroh"}.\n\nSaya melihat informasi ini di website Jam Wisata.\nKode referral: ${agent.referralCode}${campaign ? `\nCampaign: ${campaign}` : ""}\nID lead: ${lead.id.slice(0, 8)}`;
    return NextResponse.json({ redirectUrl: `https://wa.me/6281809627499?text=${encodeURIComponent(message)}` });
  } catch (error) {
    console.error("Referral lead failed:", error);
    return NextResponse.json({ error: "Data belum tersimpan. Silakan coba lagi." }, { status: 500 });
  }
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { CAMPAIGN_STORAGE_KEY, WEBSITE_WHATSAPP_NOTE, campaignFromSearch, hasCampaign, readStoredCampaign } from "@/lib/marketing-attribution";

const VISITOR_KEY = "jamwisata_visitor_id";
const SESSION_KEY = "jamwisata_visit_session";

function getOrCreateId(storage: Storage, key: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  storage.setItem(key, id);
  return id;
}

function referrerSource() {
  if (!document.referrer) return "direct";
  try {
    const url = new URL(document.referrer);
    return url.hostname === window.location.hostname ? "internal" : url.hostname.slice(0, 160);
  } catch {
    return "direct";
  }
}

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const trackingAllowed = navigator.doNotTrack !== "1";
    const visitorId = trackingAllowed ? getOrCreateId(localStorage, VISITOR_KEY) : "";
    const sessionId = trackingAllowed ? getOrCreateId(sessionStorage, SESSION_KEY) : "";
    const incomingCampaign = campaignFromSearch(window.location.search);
    if (hasCampaign(incomingCampaign)) sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(incomingCampaign));
    const campaign = hasCampaign(incomingCampaign) ? incomingCampaign : readStoredCampaign(sessionStorage);
    const payload = { sessionId, visitorId, path: pathname.slice(0, 300), referrer: referrerSource(), ...campaign };

    const enrichWhatsAppLink = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href*="wa.me/"]') : null;
      if (!target) return;
      try {
        const url = new URL(target.href);
        let message = url.searchParams.get("text") || "Assalamu’alaikum, saya ingin berkonsultasi dengan Jam Wisata.";
        if (!message.includes(WEBSITE_WHATSAPP_NOTE)) message += `\n\n${WEBSITE_WHATSAPP_NOTE}`;
        if (!message.includes("Halaman asal:")) message += `\nHalaman asal: ${window.location.pathname}`;
        if (campaign.utmSource && !message.includes("\nSumber:")) message += `\nSumber: ${campaign.utmSource}`;
        if (campaign.utmCampaign && !message.includes("\nCampaign:")) message += `\nCampaign: ${campaign.utmCampaign}`;
        if (campaign.utmContent && !message.includes("\nKonten:")) message += `\nKonten: ${campaign.utmContent}`;
        url.searchParams.set("text", message);
        target.href = url.toString();
      } catch {
        // Link WhatsApp yang tidak valid dibiarkan apa adanya.
      }
    };

    const send = (type: "pageview" | "heartbeat") => {
      if (!trackingAllowed || document.visibilityState !== "visible") return;
      void fetch("/api/traffic", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, type }),
        cache: "no-store",
        keepalive: true,
      });
    };

    send("pageview");
    document.addEventListener("click", enrichWhatsAppLink, true);
    const interval = trackingAllowed ? window.setInterval(() => send("heartbeat"), 30_000) : null;
    return () => {
      if (interval) window.clearInterval(interval);
      document.removeEventListener("click", enrichWhatsAppLink, true);
    };
  }, [pathname]);

  return null;
}

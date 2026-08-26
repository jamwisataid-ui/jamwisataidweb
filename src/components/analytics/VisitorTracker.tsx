"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
    if (pathname.startsWith("/admin") || navigator.doNotTrack === "1") return;

    const visitorId = getOrCreateId(localStorage, VISITOR_KEY);
    const sessionId = getOrCreateId(sessionStorage, SESSION_KEY);
    const payload = { sessionId, visitorId, path: pathname.slice(0, 300), referrer: referrerSource() };

    const send = (type: "pageview" | "heartbeat") => {
      if (document.visibilityState !== "visible") return;
      void fetch("/api/traffic", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, type }),
        cache: "no-store",
        keepalive: true,
      });
    };

    send("pageview");
    const interval = window.setInterval(() => send("heartbeat"), 30_000);
    return () => window.clearInterval(interval);
  }, [pathname]);

  return null;
}

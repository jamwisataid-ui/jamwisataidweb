"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AdminProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextUrl = `${pathname}?${searchParams.toString()}`;
  const [lastUrl, setLastUrl] = useState(nextUrl);
  const [loading, setLoading] = useState(false);

  if (lastUrl !== nextUrl) {
    setLastUrl(nextUrl);
    setLoading(false);
  }

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;
      if (!target) return;
      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Cek apakah internal link
      if (href && href.startsWith("/") && targetAttr !== "_blank") {
        const currentUrl = window.location.pathname + window.location.search;
        if (href !== currentUrl) {
          setLoading(true);
        }
      }
    };

    const attachListeners = () => {
      const anchors = document.querySelectorAll("a[href^='/admin']");
      anchors.forEach((a) => {
        a.addEventListener("click", handleAnchorClick as EventListener);
      });
    };

    attachListeners();
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const anchors = document.querySelectorAll("a[href^='/admin']");
      anchors.forEach((a) => {
        a.removeEventListener("click", handleAnchorClick as EventListener);
      });
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="admin-top-progress" role="progressbar" aria-label="Memuat halaman">
      <div className="admin-top-progress-bar" />
    </div>
  );
}

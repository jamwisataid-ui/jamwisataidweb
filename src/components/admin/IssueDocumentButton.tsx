"use client";

import { useState } from "react";
import { FileDown, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function IssueDocumentButton({ kind, bookingId, paymentId }: { kind: "invoice" | "receipt"; bookingId: string; paymentId?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function issue() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/management/issued-documents", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, bookingId, paymentId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "PDF gagal dibuat.");
      router.refresh();
      window.open(`/api/admin/management/issued-documents/${data.id}`, "_blank", "noopener,noreferrer");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "PDF gagal dibuat."); } finally { setBusy(false); }
  }
  return <span className="management-issue-action"><button type="button" disabled={busy} onClick={issue}>{busy ? <LoaderCircle /> : <FileDown />}{busy ? "Membuat…" : kind === "invoice" ? "Buat invoice" : "Buat kwitansi"}</button>{error ? <small>{error}</small> : null}</span>;
}

"use client";

import { FilePlus2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SettlementInvoiceButton({ bookingId, parentInvoiceId }: { bookingId: string; parentInvoiceId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function createSettlementInvoice() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/management/issued-documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "invoice", bookingId, parentInvoiceId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Invoice pelunasan gagal dibuat.");
      router.push(`/admin/manajemen/invoice-kwitansi/${result.id}`);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Invoice pelunasan gagal dibuat.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="management-receipt-retry"><button className="management-create-link" type="button" onClick={createSettlementInvoice} disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <FilePlus2 />}{busy ? "Membuat invoice…" : "Buat Invoice Pelunasan"}</button>{error ? <small>{error}</small> : null}</div>;
}

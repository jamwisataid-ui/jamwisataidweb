"use client";

import { LoaderCircle, ReceiptText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EnsureReceiptButton({ bookingId, paymentId }: { bookingId: string; paymentId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function createReceipt() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/management/issued-documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "receipt", bookingId, paymentId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Kwitansi gagal dibuat.");
      router.replace(`/admin/manajemen/invoice-kwitansi/${result.id}`);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Kwitansi gagal dibuat.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="management-receipt-retry"><button type="button" onClick={createReceipt} disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <ReceiptText />}{busy ? "Membuat kwitansi…" : "Buat kwitansi sekarang"}</button>{error ? <small>{error}</small> : null}</div>;
}

"use client";

import { FileCheck2, FileText, LoaderCircle, ReceiptText, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RECEIPT_DESCRIPTION_MAX_LENGTH } from "@/lib/management/invoice";

type ReceiptInvoice = {
  id: string;
  bookingId: string;
  number: string;
  payerName: string;
  payments: Array<{ id: string; amountLabel: string; paidAtLabel: string; method: string }>;
};

export function ManualReceiptBuilder({ invoices, receiptNumber }: { invoices: ReceiptInvoice[]; receiptNumber: string }) {
  const router = useRouter();
  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id ?? "");
  const selectedInvoice = invoices.find((invoice) => invoice.id === invoiceId);
  const [selectedPaymentId, setSelectedPaymentId] = useState(invoices[0]?.payments[0]?.id ?? "");
  const paymentId = selectedInvoice?.payments.some((payment) => payment.id === selectedPaymentId) ? selectedPaymentId : selectedInvoice?.payments[0]?.id ?? "";
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewBusy, setPreviewBusy] = useState(false);
  const [issueBusy, setIssueBusy] = useState(false);
  const [issueError, setIssueError] = useState("");
  const [defaultDescription, setDefaultDescription] = useState("");
  const [descriptionOverride, setDescriptionOverride] = useState<string | null>(null);
  const descriptionValue = descriptionOverride ?? defaultDescription;
  const descriptionTooLong = (descriptionOverride ?? "").trim().length > RECEIPT_DESCRIPTION_MAX_LENGTH;

  useEffect(() => {
    if (!selectedInvoice || !paymentId || descriptionTooLong) return;
    const controller = new AbortController();
    let nextUrl = "";
    const timer = window.setTimeout(async () => {
      setPreviewBusy(true);
      setPreviewError("");
      try {
        const response = await fetch("/api/admin/management/issued-documents/preview", {
          method: "POST",
          headers: { "content-type": "application/json", accept: "image/png" },
          body: JSON.stringify({ kind: "receipt", bookingId: selectedInvoice.bookingId, paymentId, receiptDescription: descriptionOverride ?? undefined }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Preview kwitansi gagal dibuat.");
        }
        try { setDefaultDescription(decodeURIComponent(response.headers.get("x-receipt-description") ?? "")); } catch { setDefaultDescription(""); }
        nextUrl = URL.createObjectURL(await response.blob());
        setPreviewUrl((current) => { if (current) URL.revokeObjectURL(current); return nextUrl; });
      } catch (reason) {
        if (!controller.signal.aborted) setPreviewError(reason instanceof Error ? reason.message : "Preview kwitansi gagal dibuat.");
      } finally {
        if (!controller.signal.aborted) setPreviewBusy(false);
      }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); if (nextUrl) URL.revokeObjectURL(nextUrl); };
  }, [descriptionOverride, descriptionTooLong, paymentId, selectedInvoice]);

  async function issue() {
    if (!selectedInvoice || !paymentId || descriptionTooLong) return;
    setIssueBusy(true);
    setIssueError("");
    try {
      const response = await fetch("/api/admin/management/issued-documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "receipt", bookingId: selectedInvoice.bookingId, paymentId, receiptDescription: descriptionOverride ?? undefined }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Kwitansi gagal diterbitkan.");
      router.push(`/admin/manajemen/invoice-kwitansi/${result.id}`);
      router.refresh();
    } catch (reason) {
      setIssueError(reason instanceof Error ? reason.message : "Kwitansi gagal diterbitkan.");
    } finally {
      setIssueBusy(false);
    }
  }

  return <details className="management-manual-receipt">
    <summary><span><ReceiptText /><span><small>CADANGAN</small><strong>Buat kwitansi secara manual</strong><p>Gunakan hanya jika pembayaran sudah diterima tetapi kwitansi otomatis belum tersedia.</p></span></span><i>+</i></summary>
    <div className="management-manual-receipt-content">{!invoices.length ? <div className="management-manual-receipt-empty"><FileCheck2 /><span><strong>Tidak ada kwitansi yang perlu dibuat manual</strong><small>Semua pembayaran sudah memiliki kwitansi, atau belum ada pembayaran terkonfirmasi.</small></span></div> : <div className="management-document-builder">
      <div className="management-document-controls">
        <label className="management-document-select"><span>1. Pilih invoice</span><select value={invoiceId} onChange={(event) => { const nextInvoice = invoices.find((invoice) => invoice.id === event.target.value); setInvoiceId(event.target.value); setSelectedPaymentId(nextInvoice?.payments[0]?.id ?? ""); setDescriptionOverride(null); }}>{invoices.map((invoice) => <option value={invoice.id} key={invoice.id}>{invoice.number} · {invoice.payerName}</option>)}</select></label>
        <label className="management-document-select"><span>2. Pilih pembayaran terkonfirmasi</span><select value={paymentId} onChange={(event) => { setSelectedPaymentId(event.target.value); setDescriptionOverride(null); }}>{selectedInvoice?.payments.map((payment) => <option value={payment.id} key={payment.id}>{payment.paidAtLabel} · {payment.amountLabel} · {payment.method}</option>)}</select></label>
        <div className="management-document-summary"><span><small>Invoice terhubung</small><strong>{selectedInvoice?.number}</strong></span><span><small>Pembayar</small><strong>{selectedInvoice?.payerName}</strong></span></div>
        <div className="management-invoice-amount management-invoice-description">
          <span>3. Keterangan kwitansi</span>
          <label><textarea aria-label="Keterangan kwitansi" rows={2} maxLength={RECEIPT_DESCRIPTION_MAX_LENGTH} value={descriptionValue} onChange={(event) => { setDescriptionOverride(event.target.value); setIssueError(""); }} /></label>
          {descriptionOverride !== null && descriptionOverride !== defaultDescription ? <div><button type="button" onClick={() => setDescriptionOverride(null)}>Kembalikan keterangan otomatis</button></div> : null}
          <small>{descriptionTooLong ? `Keterangan maksimal ${RECEIPT_DESCRIPTION_MAX_LENGTH} karakter.` : "Tercetak di baris \"Untuk pembayaran\". Kosongkan untuk memakai keterangan otomatis."}</small>
        </div>
        <div className="management-document-number"><span>Nomor kwitansi yang akan dipakai</span><strong>{receiptNumber}</strong><small>Jika pembayaran sudah memiliki kwitansi, sistem membuka dokumen yang lama dan tidak membuat duplikat.</small></div>
        {issueError ? <p className="management-document-error">{issueError}</p> : null}
        <button className="management-document-issue" type="button" disabled={!paymentId || descriptionTooLong || issueBusy || previewBusy || Boolean(previewError)} onClick={issue}>{issueBusy ? <LoaderCircle className="spin" /> : <ReceiptText />}{issueBusy ? "Menerbitkan kwitansi…" : "Terbitkan kwitansi manual"}</button>
      </div>
      <div className="management-document-preview">
        <header><span><small>PREVIEW LIVE</small><strong>Kwitansi · {selectedInvoice?.payerName}</strong></span>{previewBusy ? <i><LoaderCircle className="spin" /> Memuat</i> : previewUrl ? <i className="ready"><FileCheck2 /> Siap diperiksa</i> : null}</header>
        <div className="landscape">{previewUrl ? <div role="img" aria-label={`Preview kwitansi ${selectedInvoice?.payerName ?? ""}`} className="management-template-preview-image" style={{ backgroundImage: `url(${previewUrl})` }} /> : previewError ? <div className="management-preview-state error"><RotateCw /><strong>Preview belum dapat ditampilkan</strong><p>{previewError}</p></div> : <div className="management-preview-state"><FileText /><strong>Menyiapkan preview kwitansi…</strong></div>}</div>
      </div>
    </div>}</div>
  </details>;
}

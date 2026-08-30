"use client";

import { FileCheck2, FileText, LoaderCircle, ReceiptText, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    if (!selectedInvoice || !paymentId) return;
    const controller = new AbortController();
    let nextUrl = "";
    const timer = window.setTimeout(async () => {
      setPreviewBusy(true);
      setPreviewError("");
      try {
        const response = await fetch("/api/admin/management/issued-documents/preview", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ kind: "receipt", bookingId: selectedInvoice.bookingId, paymentId }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Preview kwitansi gagal dibuat.");
        }
        nextUrl = URL.createObjectURL(await response.blob());
        setPreviewUrl((current) => { if (current) URL.revokeObjectURL(current); return nextUrl; });
      } catch (reason) {
        if (!controller.signal.aborted) setPreviewError(reason instanceof Error ? reason.message : "Preview kwitansi gagal dibuat.");
      } finally {
        if (!controller.signal.aborted) setPreviewBusy(false);
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); if (nextUrl) URL.revokeObjectURL(nextUrl); };
  }, [paymentId, selectedInvoice]);

  async function issue() {
    if (!selectedInvoice || !paymentId) return;
    setIssueBusy(true);
    setIssueError("");
    try {
      const response = await fetch("/api/admin/management/issued-documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "receipt", bookingId: selectedInvoice.bookingId, paymentId }),
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

  return <section className="management-manual-receipt">
    <header><span><small>OPSIONAL / FALLBACK</small><h2>Buat kwitansi manual</h2><p>Kwitansi manual tetap wajib berasal dari invoice dan pembayaran yang terkonfirmasi.</p></span><ReceiptText /></header>
    {!invoices.length ? <div className="management-manual-receipt-empty"><FileCheck2 /><span><strong>Tidak ada kwitansi yang perlu dibuat manual</strong><small>Belum ada pembayaran terkonfirmasi tanpa kwitansi, atau invoice belum diterbitkan.</small></span></div> : <div className="management-document-builder">
      <div className="management-document-controls">
        <label className="management-document-select"><span>1. Pilih invoice</span><select value={invoiceId} onChange={(event) => { const nextInvoice = invoices.find((invoice) => invoice.id === event.target.value); setInvoiceId(event.target.value); setSelectedPaymentId(nextInvoice?.payments[0]?.id ?? ""); }}>{invoices.map((invoice) => <option value={invoice.id} key={invoice.id}>{invoice.number} · {invoice.payerName}</option>)}</select></label>
        <label className="management-document-select"><span>2. Pilih pembayaran terkonfirmasi</span><select value={paymentId} onChange={(event) => setSelectedPaymentId(event.target.value)}>{selectedInvoice?.payments.map((payment) => <option value={payment.id} key={payment.id}>{payment.paidAtLabel} · {payment.amountLabel} · {payment.method}</option>)}</select></label>
        <div className="management-document-summary"><span><small>Invoice terhubung</small><strong>{selectedInvoice?.number}</strong></span><span><small>Pembayar</small><strong>{selectedInvoice?.payerName}</strong></span></div>
        <div className="management-document-number"><span>Nomor kwitansi yang akan dipakai</span><strong>{receiptNumber}</strong><small>Jika pembayaran sudah memiliki kwitansi, sistem membuka dokumen yang lama dan tidak membuat duplikat.</small></div>
        {issueError ? <p className="management-document-error">{issueError}</p> : null}
        <button className="management-document-issue" type="button" disabled={!paymentId || issueBusy || previewBusy || Boolean(previewError)} onClick={issue}>{issueBusy ? <LoaderCircle className="spin" /> : <ReceiptText />}{issueBusy ? "Menerbitkan kwitansi…" : "Terbitkan kwitansi manual"}</button>
      </div>
      <div className="management-document-preview">
        <header><span><small>PREVIEW LIVE</small><strong>Kwitansi · {selectedInvoice?.payerName}</strong></span>{previewBusy ? <i><LoaderCircle className="spin" /> Memuat</i> : previewUrl ? <i className="ready"><FileCheck2 /> Siap diperiksa</i> : null}</header>
        <div className="landscape">{previewUrl ? <iframe title="Preview kwitansi" src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`} /> : previewError ? <div className="management-preview-state error"><RotateCw /><strong>Preview belum dapat ditampilkan</strong><p>{previewError}</p></div> : <div className="management-preview-state"><FileText /><strong>Menyiapkan preview kwitansi…</strong></div>}</div>
      </div>
    </div>}
  </section>;
}

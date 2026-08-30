"use client";

import { useEffect, useMemo, useState } from "react";
import { FileCheck2, FileText, LoaderCircle, ReceiptText, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

type BuilderBooking = {
  id: string;
  bookingNumber: string;
  payerName: string;
  packageName: string;
  pilgrims: number;
};

type BuilderPayment = {
  id: string;
  bookingId: string;
  amountLabel: string;
  paidAtLabel: string;
  method: string;
};

export function TransactionDocumentBuilder({ bookings, payments, invoiceNumber, receiptNumber }: {
  bookings: BuilderBooking[];
  payments: BuilderPayment[];
  invoiceNumber: string;
  receiptNumber: string;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<"invoice" | "receipt">("invoice");
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? "");
  const availablePayments = useMemo(() => payments.filter((payment) => payment.bookingId === bookingId), [bookingId, payments]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(payments.find((payment) => payment.bookingId === bookings[0]?.id)?.id ?? "");
  const paymentId = availablePayments.some((payment) => payment.id === selectedPaymentId) ? selectedPaymentId : availablePayments[0]?.id ?? "";
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewBusy, setPreviewBusy] = useState(false);
  const [issueBusy, setIssueBusy] = useState(false);
  const [issueError, setIssueError] = useState("");
  const selectedBooking = bookings.find((booking) => booking.id === bookingId);
  const canPreview = Boolean(bookingId && (kind === "invoice" || paymentId));

  useEffect(() => {
    if (!canPreview) return;
    const controller = new AbortController();
    let nextUrl = "";
    const timer = window.setTimeout(async () => {
      setPreviewBusy(true);
      setPreviewError("");
      try {
        const response = await fetch("/api/admin/management/issued-documents/preview", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ kind, bookingId, paymentId: kind === "receipt" ? paymentId : undefined }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Preview PDF gagal dibuat.");
        }
        nextUrl = URL.createObjectURL(await response.blob());
        setPreviewUrl((current) => { if (current) URL.revokeObjectURL(current); return nextUrl; });
      } catch (reason) {
        if (!controller.signal.aborted) setPreviewError(reason instanceof Error ? reason.message : "Preview PDF gagal dibuat.");
      } finally {
        if (!controller.signal.aborted) setPreviewBusy(false);
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); if (nextUrl) URL.revokeObjectURL(nextUrl); };
  }, [bookingId, canPreview, kind, paymentId]);

  async function issue() {
    if (!canPreview) return;
    setIssueBusy(true);
    setIssueError("");
    try {
      const response = await fetch("/api/admin/management/issued-documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, bookingId, paymentId: kind === "receipt" ? paymentId : undefined }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "PDF gagal diterbitkan.");
      router.push(`/admin/manajemen/invoice-kwitansi/${result.id}`);
      router.refresh();
    } catch (reason) {
      setIssueError(reason instanceof Error ? reason.message : "PDF gagal diterbitkan.");
    } finally {
      setIssueBusy(false);
    }
  }

  if (!bookings.length) return <div className="management-document-builder-empty"><FileText /><strong>Belum ada transaksi</strong><p>Tambahkan pendaftaran jamaah terlebih dahulu sebelum membuat invoice atau kwitansi.</p></div>;

  return <section className="management-document-builder">
    <div className="management-document-controls">
      <header><small>BUAT DOKUMEN</small><h2>Invoice & kwitansi</h2><p>Pilih transaksi, periksa hasilnya, lalu terbitkan PDF.</p></header>
      <fieldset className="management-document-kind">
        <legend>1. Jenis dokumen</legend>
        <button type="button" className={kind === "invoice" ? "active" : ""} onClick={() => setKind("invoice")}><FileText /><span><strong>Invoice</strong><small>Untuk tagihan</small></span></button>
        <button type="button" className={kind === "receipt" ? "active" : ""} onClick={() => setKind("receipt")}><ReceiptText /><span><strong>Kwitansi</strong><small>Setelah pembayaran</small></span></button>
      </fieldset>
      <label className="management-document-select"><span>2. Pilih transaksi</span><select value={bookingId} onChange={(event) => { const nextBookingId = event.target.value; setBookingId(nextBookingId); setSelectedPaymentId(payments.find((payment) => payment.bookingId === nextBookingId)?.id ?? ""); }}>{bookings.map((booking) => <option value={booking.id} key={booking.id}>{booking.bookingNumber} · {booking.payerName}</option>)}</select></label>
      {selectedBooking ? <div className="management-document-summary"><span><small>Paket</small><strong>{selectedBooking.packageName}</strong></span><span><small>Jamaah</small><strong>{selectedBooking.pilgrims} orang</strong></span></div> : null}
      {kind === "receipt" ? <label className="management-document-select"><span>3. Pilih pembayaran</span><select value={paymentId} onChange={(event) => setSelectedPaymentId(event.target.value)} disabled={!availablePayments.length}>{availablePayments.length ? availablePayments.map((payment) => <option value={payment.id} key={payment.id}>{payment.paidAtLabel} · {payment.amountLabel} · {payment.method}</option>) : <option value="">Belum ada pembayaran terkonfirmasi</option>}</select><small>Kwitansi hanya dapat dibuat dari pembayaran yang sudah dikonfirmasi.</small></label> : null}
      <div className="management-document-number"><span>Nomor yang akan dipakai</span><strong>{kind === "invoice" ? invoiceNumber : receiptNumber}</strong><small>Nomor baru dipakai dan dinaikkan setelah dokumen diterbitkan.</small></div>
      {issueError ? <p className="management-document-error">{issueError}</p> : null}
      <button className="management-document-issue" type="button" disabled={!canPreview || issueBusy || previewBusy || Boolean(previewError)} onClick={issue}>{issueBusy ? <LoaderCircle className="spin" /> : <FileCheck2 />}{issueBusy ? "Menerbitkan PDF…" : `Terbitkan ${kind === "invoice" ? "invoice" : "kwitansi"}`}</button>
    </div>
    <div className="management-document-preview">
      <header><span><small>PREVIEW LIVE</small><strong>{kind === "invoice" ? "Invoice" : "Kwitansi"} · {selectedBooking?.payerName ?? "-"}</strong></span>{canPreview && previewBusy ? <i><LoaderCircle className="spin" /> Memuat</i> : canPreview && previewUrl ? <i className="ready"><FileCheck2 /> Siap diperiksa</i> : null}</header>
      <div className={kind === "receipt" ? "landscape" : "portrait"}>
        {canPreview && previewUrl ? <iframe title={`Preview ${kind === "invoice" ? "invoice" : "kwitansi"}`} src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`} /> : canPreview && previewError ? <div className="management-preview-state error"><RotateCw /><strong>Preview belum dapat ditampilkan</strong><p>{previewError}</p></div> : <div className="management-preview-state"><LoaderCircle className={canPreview && previewBusy ? "spin" : ""} /><strong>{canPreview ? "Menyiapkan preview PDF…" : "Pilih data pembayaran"}</strong><p>Preview yang tampil sama dengan file PDF yang akan diterbitkan.</p></div>}
      </div>
    </div>
  </section>;
}

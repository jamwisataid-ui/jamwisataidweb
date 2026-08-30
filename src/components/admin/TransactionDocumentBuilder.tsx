"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, FileCheck2, FileText, LoaderCircle, ReceiptText, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

type BuilderBooking = {
  id: string;
  bookingNumber: string;
  payerName: string;
  packageName: string;
  pilgrims: number;
};

export function TransactionDocumentBuilder({ bookings, invoiceNumber }: {
  bookings: BuilderBooking[];
  invoiceNumber: string;
}) {
  const router = useRouter();
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? "");
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewBusy, setPreviewBusy] = useState(false);
  const [issueBusy, setIssueBusy] = useState(false);
  const [issueError, setIssueError] = useState("");
  const selectedBooking = bookings.find((booking) => booking.id === bookingId);

  useEffect(() => {
    if (!bookingId) return;
    const controller = new AbortController();
    let nextUrl = "";
    const timer = window.setTimeout(async () => {
      setPreviewBusy(true);
      setPreviewError("");
      try {
        const response = await fetch("/api/admin/management/issued-documents/preview", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ kind: "invoice", bookingId }),
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
  }, [bookingId]);

  async function issue() {
    if (!bookingId) return;
    setIssueBusy(true);
    setIssueError("");
    try {
      const response = await fetch("/api/admin/management/issued-documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "invoice", bookingId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Invoice gagal diterbitkan.");
      router.push(`/admin/manajemen/invoice-kwitansi/${result.id}`);
      router.refresh();
    } catch (reason) {
      setIssueError(reason instanceof Error ? reason.message : "Invoice gagal diterbitkan.");
    } finally {
      setIssueBusy(false);
    }
  }

  if (!bookings.length) return <div className="management-document-builder-empty"><FileCheck2 /><strong>Semua transaksi sudah memiliki invoice</strong><p>Lanjutkan ke menu Pembayaran untuk mencatat pembayaran. Kwitansi akan dibuat otomatis setelah pembayaran tersimpan.</p></div>;

  return <>
    <ol className="management-document-flow" aria-label="Alur invoice dan pembayaran">
      <li className="active"><span><FileText /></span><div><small>LANGKAH 1</small><strong>Terbitkan invoice</strong></div></li>
      <li><span><CircleDollarSign /></span><div><small>LANGKAH 2</small><strong>Catat pembayaran</strong></div></li>
      <li><span><ReceiptText /></span><div><small>OTOMATIS</small><strong>Kwitansi dibuat</strong></div></li>
    </ol>
    <section className="management-document-builder">
      <div className="management-document-controls">
        <header><small>BUAT TAGIHAN</small><h2>Terbitkan invoice</h2><p>Pilih transaksi lalu periksa invoice sebelum diterbitkan.</p></header>
        <label className="management-document-select"><span>1. Pilih transaksi yang belum memiliki invoice</span><select value={bookingId} onChange={(event) => setBookingId(event.target.value)}>{bookings.map((booking) => <option value={booking.id} key={booking.id}>{booking.bookingNumber} · {booking.payerName}</option>)}</select></label>
        {selectedBooking ? <div className="management-document-summary"><span><small>Paket</small><strong>{selectedBooking.packageName}</strong></span><span><small>Jamaah</small><strong>{selectedBooking.pilgrims} orang</strong></span></div> : null}
        <div className="management-document-number"><span>Nomor invoice yang akan dipakai</span><strong>{invoiceNumber}</strong><small>Nomor baru dipakai dan dinaikkan setelah invoice diterbitkan.</small></div>
        <p className="management-form-note">Setelah invoice terbit, catat pembayarannya dari menu Pembayaran. Sistem langsung membuat kwitansi secara otomatis.</p>
        {issueError ? <p className="management-document-error">{issueError}</p> : null}
        <button className="management-document-issue" type="button" disabled={!bookingId || issueBusy || previewBusy || Boolean(previewError)} onClick={issue}>{issueBusy ? <LoaderCircle className="spin" /> : <FileCheck2 />}{issueBusy ? "Menerbitkan invoice…" : "Terbitkan invoice"}</button>
      </div>
      <div className="management-document-preview">
        <header><span><small>PREVIEW LIVE</small><strong>Invoice · {selectedBooking?.payerName ?? "-"}</strong></span>{previewBusy ? <i><LoaderCircle className="spin" /> Memuat</i> : previewUrl ? <i className="ready"><FileCheck2 /> Siap diperiksa</i> : null}</header>
        <div className="portrait">
          {previewUrl ? <iframe title="Preview invoice" src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`} /> : previewError ? <div className="management-preview-state error"><RotateCw /><strong>Preview belum dapat ditampilkan</strong><p>{previewError}</p></div> : <div className="management-preview-state"><LoaderCircle className={previewBusy ? "spin" : ""} /><strong>Menyiapkan preview PDF…</strong><p>Preview yang tampil sama dengan file invoice yang akan diterbitkan.</p></div>}
        </div>
      </div>
    </section>
  </>;
}

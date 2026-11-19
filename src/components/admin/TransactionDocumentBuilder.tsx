"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, FileCheck2, FileText, LoaderCircle, ReceiptText, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

type BuilderBooking = {
  optionId?: string;
  id: string;
  bookingNumber: string;
  payerName: string;
  packageName: string;
  pilgrims: number;
  totalPrice: number;
  totalDp: number;
  alreadyInvoiced: number;
  remainingPrice: number;
  mode?: "standard" | "settlement";
  parentInvoiceId?: string;
  sourceInvoiceNumber?: string;
};

const currency = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

function bookingOptionId(booking: BuilderBooking) {
  return booking.optionId ?? `${booking.mode ?? "standard"}:${booking.id}`;
}

function defaultInvoiceAmount(booking?: BuilderBooking) {
  if (!booking) return "";
  if (booking.mode === "settlement") return String(booking.remainingPrice);
  return String(booking.alreadyInvoiced > 0 ? booking.remainingPrice : Math.min(booking.totalDp || booking.remainingPrice, booking.remainingPrice));
}

export function TransactionDocumentBuilder({ bookings, invoiceNumber, initialParentInvoiceId }: {
  bookings: BuilderBooking[];
  invoiceNumber: string;
  initialParentInvoiceId?: string;
}) {
  const router = useRouter();
  const initialBooking = bookings.find((booking) => booking.parentInvoiceId === initialParentInvoiceId) ?? bookings[0];
  const [selectedOptionId, setSelectedOptionId] = useState(initialBooking ? bookingOptionId(initialBooking) : "");
  const [invoiceAmount, setInvoiceAmount] = useState(() => defaultInvoiceAmount(initialBooking));
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewBusy, setPreviewBusy] = useState(false);
  const [issueBusy, setIssueBusy] = useState(false);
  const [issueError, setIssueError] = useState("");
  const selectedBooking = bookings.find((booking) => bookingOptionId(booking) === selectedOptionId);
  const numericInvoiceAmount = Number(invoiceAmount);
  const amountValid = Boolean(selectedBooking && Number.isSafeInteger(numericInvoiceAmount) && numericInvoiceAmount > 0 && numericInvoiceAmount <= selectedBooking.remainingPrice);
  const amountError = numericInvoiceAmount > (selectedBooking?.remainingPrice ?? 0) ? "Nominal invoice melebihi sisa tagihan." : "Isi nominal invoice lebih dari Rp0.";

  const selectedBookingId = selectedBooking?.id;
  const selectedParentInvoiceId = selectedBooking?.parentInvoiceId;

  useEffect(() => {
    if (!selectedBookingId || !amountValid) return;
    const controller = new AbortController();
    let nextUrl = "";
    const timer = window.setTimeout(async () => {
      setPreviewBusy(true);
      setPreviewError("");
      try {
        const response = await fetch("/api/admin/management/issued-documents/preview", {
          method: "POST",
          headers: { "content-type": "application/json", accept: "image/png" },
          body: JSON.stringify({ kind: "invoice", bookingId: selectedBookingId, parentInvoiceId: selectedParentInvoiceId, invoiceAmount: numericInvoiceAmount }),
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
  }, [amountValid, numericInvoiceAmount, selectedBookingId, selectedParentInvoiceId]);

  async function issue() {
    if (!selectedBooking || !amountValid) return;
    setIssueBusy(true);
    setIssueError("");
    try {
      const response = await fetch("/api/admin/management/issued-documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "invoice", bookingId: selectedBooking.id, parentInvoiceId: selectedBooking.parentInvoiceId, invoiceAmount: numericInvoiceAmount }),
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

  if (!bookings.length) return <div className="management-document-builder-empty"><FileCheck2 /><strong>Belum ada tagihan yang dapat dibuatkan invoice</strong><p>Invoice baru atau termin berikutnya akan tersedia setelah transaksi memenuhi syarat.</p></div>;

  return <>
    <ol className="management-document-flow" aria-label="Alur invoice dan pembayaran">
      <li className="active"><span><FileText /></span><div><small>LANGKAH 1</small><strong>Terbitkan invoice</strong></div></li>
      <li><span><CircleDollarSign /></span><div><small>LANGKAH 2</small><strong>Catat pembayaran</strong></div></li>
      <li><span><ReceiptText /></span><div><small>OTOMATIS</small><strong>Kwitansi dibuat</strong></div></li>
    </ol>
    <section className="management-document-builder">
      <div className="management-document-controls">
        <header><small>BUAT TAGIHAN</small><h2>Terbitkan invoice</h2><p>Buat invoice awal atau invoice termin dengan nominal yang dapat ditentukan sendiri.</p></header>
        <label className="management-document-select"><span>1. Pilih tagihan</span><select value={selectedOptionId} onChange={(event) => { const next = bookings.find((booking) => bookingOptionId(booking) === event.target.value); setSelectedOptionId(event.target.value); setInvoiceAmount(defaultInvoiceAmount(next)); setIssueError(""); }}>{bookings.map((booking) => <option value={bookingOptionId(booking)} key={bookingOptionId(booking)}>{booking.mode === "settlement" ? `${booking.sourceInvoiceNumber} · Termin · sisa ${currency.format(booking.remainingPrice)}` : `${booking.bookingNumber} · ${booking.payerName}`}</option>)}</select></label>
        {selectedBooking ? <div className="management-document-summary"><span><small>Paket</small><strong>{selectedBooking.packageName}</strong></span><span><small>Jamaah</small><strong>{selectedBooking.pilgrims} orang</strong></span>{selectedBooking.mode === "settlement" ? <><span><small>Invoice awal</small><strong>{selectedBooking.sourceInvoiceNumber}</strong></span><span><small>Sudah dibayar</small><strong>{currency.format(selectedBooking.alreadyInvoiced)}</strong></span><span><small>Sisa tagihan</small><strong>{currency.format(selectedBooking.remainingPrice)}</strong></span></> : <><span><small>Total harga pendaftaran</small><strong>{currency.format(selectedBooking.totalPrice)}</strong></span><span><small>Sudah dibuatkan invoice</small><strong>{currency.format(selectedBooking.alreadyInvoiced)}</strong></span><span><small>Sisa belum ditagihkan</small><strong>{currency.format(selectedBooking.remainingPrice)}</strong></span></>}</div> : null}
        <div className="management-invoice-amount">
          <label><span>2. Tentukan nominal invoice *</span><input aria-label="Nominal invoice" inputMode="numeric" value={invoiceAmount} onChange={(event) => { setInvoiceAmount(event.target.value.replace(/\D/g, "")); setIssueError(""); }} /></label>
          <output>Invoice akan dibuat senilai <strong>{currency.format(numericInvoiceAmount || 0)}</strong></output>
          <div>{selectedBooking?.mode === "settlement" ? null : <button type="button" className={numericInvoiceAmount === Math.min(selectedBooking?.totalDp ?? 0, selectedBooking?.remainingPrice ?? 0) ? "active" : ""} onClick={() => setInvoiceAmount(String(Math.min(selectedBooking?.totalDp ?? 0, selectedBooking?.remainingPrice ?? 0)))}>Tagih DP {selectedBooking ? currency.format(Math.min(selectedBooking.totalDp, selectedBooking.remainingPrice)) : ""}</button>}<button type="button" className={numericInvoiceAmount === selectedBooking?.remainingPrice ? "active" : ""} onClick={() => setInvoiceAmount(String(selectedBooking?.remainingPrice ?? 0))}>{selectedBooking?.mode === "settlement" ? "Pelunasan seluruh sisa" : "Tagih seluruh sisa"}</button></div>
          <small>Nominal dapat diisi bebas sampai sebesar sisa tagihan. Harga paket jamaah tetap tersimpan dan tidak berubah.</small>
        </div>
        <div className="management-document-number"><span>Nomor invoice yang akan dipakai</span><strong>{invoiceNumber}</strong><small>Nomor baru dipakai dan dinaikkan setelah invoice diterbitkan.</small></div>
        <p className="management-form-note">Setelah invoice terbit, catat pembayarannya dari menu Pembayaran. Sistem langsung membuat kwitansi secara otomatis.</p>
        {issueError ? <p className="management-document-error">{issueError}</p> : null}
        <button className="management-document-issue" type="button" disabled={!selectedBooking || !amountValid || issueBusy || previewBusy || Boolean(previewError)} onClick={issue}>{issueBusy ? <LoaderCircle className="spin" /> : <FileCheck2 />}{issueBusy ? "Menerbitkan invoice…" : `Terbitkan invoice ${currency.format(numericInvoiceAmount || 0)}`}</button>
      </div>
      <div className="management-document-preview">
        <header><span><small>PREVIEW LIVE</small><strong>Invoice · {selectedBooking?.payerName ?? "-"}</strong></span>{amountValid && previewBusy ? <i><LoaderCircle className="spin" /> Memuat</i> : amountValid && previewUrl ? <i className="ready"><FileCheck2 /> Siap diperiksa</i> : null}</header>
        <div className="portrait">
          {amountValid && previewUrl ? <div role="img" aria-label={`Preview invoice ${selectedBooking?.payerName ?? ""}`} className="management-template-preview-image" style={{ backgroundImage: `url(${previewUrl})` }} /> : !amountValid || previewError ? <div className="management-preview-state error"><RotateCw /><strong>Preview belum dapat ditampilkan</strong><p>{amountValid ? previewError : amountError}</p></div> : <div className="management-preview-state"><LoaderCircle className={previewBusy ? "spin" : ""} /><strong>Menyiapkan preview template…</strong><p>Preview gambar ini menjadi sumber yang sama untuk PDF dan PNG.</p></div>}
        </div>
      </div>
    </section>
  </>;
}

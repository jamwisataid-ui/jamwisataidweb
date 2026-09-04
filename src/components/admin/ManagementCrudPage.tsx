import Link from "next/link";
import { AlertTriangle, CheckCircle2, CircleAlert, Download, FileText, Upload } from "lucide-react";

import type { getManagementContext } from "@/lib/management/data";
import { formatDocumentNumber, rupiah } from "@/lib/management/domain";
import { AdminPageHeader } from "./AdminUi";
import { TransactionDocumentBuilder } from "./TransactionDocumentBuilder";
import { EnsureReceiptButton } from "./EnsureReceiptButton";
import { IssuedDocumentPreview } from "./IssuedDocumentPreview";
import { ManualReceiptBuilder } from "./ManualReceiptBuilder";
import {
  AccountForm,
  AgentForm,
  BookingForm,
  BookingCancellationForm,
  CashForm,
  CommissionPayoutForm,
  InventoryItemForm,
  PaymentForm,
  PilgrimForm,
  RecordStatusForm,
  RefundForm,
  RoomListForm,
  SequenceForm,
  StockForm,
} from "./ManagementForms";
import { PilgrimDocumentUpload } from "./PilgrimDocumentUpload";
import { PrivateDocumentPreview } from "./PrivateDocumentPreview";
import { DeleteButton } from "./DeleteButton";

type Context = Awaited<ReturnType<typeof getManagementContext>>;

const labels: Record<string, string> = {
  jamaah: "Data Jamaah",
  keberangkatan: "Pendaftaran & Keberangkatan",
  pembayaran: "Pembayaran Jamaah",
  keuangan: "Kas & Keuangan",
  "agen-referral": "Agen & Referral",
  stok: "Stok Perlengkapan",
  "manifest-room-list": "Manifest & Room List",
  "invoice-kwitansi": "Invoice & Kwitansi",
};

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return <section className="management-panel management-crud-panel"><header><div><small>FORM DATA</small><h2>{title}</h2>{description ? <p>{description}</p> : null}</div></header>{children}</section>;
}

function DetailGrid({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return <dl className="management-detail-grid">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl>;
}

function DateText({ value }: { value: Date | string | null | undefined }) {
  return <>{value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date(value)) : "—"}</>;
}

function PilgrimValue({ children }: { children: React.ReactNode }) {
  return children ? <>{children}</> : <span className="management-missing-value">Belum diisi</span>;
}

function PilgrimDocumentChecklist({ pilgrimId, documents }: { pilgrimId: string; documents: Context["pilgrimDocuments"] }) {
  const requirements = [
    ["ktp", "KTP", "Wajib"],
    ["kk", "Kartu Keluarga", "Wajib"],
    ["akta_lahir", "Akta Lahir", "Minimal salah satu dokumen pendukung"],
    ["buku_nikah", "Buku Nikah", "Minimal salah satu dokumen pendukung"],
    ["ijazah", "Ijazah", "Minimal salah satu dokumen pendukung"],
    ["paspor", "Paspor", "Lengkapi saat sudah tersedia"],
  ] as const;
  const supportingComplete = documents.some((document) => ["akta_lahir", "buku_nikah", "ijazah"].includes(document.kind));
  const additional = documents.filter((document) => document.kind === "other");
  return <div className="management-document-checklist">
    <div className={`management-document-group-status ${supportingComplete ? "complete" : "missing"}`}>{supportingComplete ? <CheckCircle2 /> : <CircleAlert />}<span><strong>Dokumen pendukung</strong><small>{supportingComplete ? "Syarat minimal Akta Lahir, Buku Nikah, atau Ijazah sudah terpenuhi." : "Belum ada. Upload minimal salah satu: Akta Lahir, Buku Nikah, atau Ijazah."}</small></span></div>
    {requirements.map(([kind, label, note]) => {
      const matches = documents.filter((document) => document.kind === kind);
      const document = matches[0];
      return <div className={`management-document-check ${document ? "complete" : "missing"}`} key={kind}><span className="management-document-check-icon">{document ? <CheckCircle2 /> : <CircleAlert />}</span><span><strong>{label}</strong><small>{document ? `${document.originalName}${matches.length > 1 ? ` · ${matches.length} file` : ""}` : note}</small></span>{document ? <div className="management-document-check-actions"><PrivateDocumentPreview id={document.id} name={document.originalName} mimeType={document.mimeType} /><a href={`/api/admin/management/documents/${document.id}`}><Download /> Download</a><Link className="management-document-add-action" href={`/admin/manajemen/jamaah/${pilgrimId}/dokumen/baru?jenis=${kind}`}><Upload /> Tambah</Link></div> : <Link className="management-document-missing-action" href={`/admin/manajemen/jamaah/${pilgrimId}/dokumen/baru?jenis=${kind}`}><Upload /> Unggah {label}</Link>}</div>;
    })}
    {additional.map((document) => <div className="management-document-check complete" key={document.id}><span className="management-document-check-icon"><CheckCircle2 /></span><span><strong>Dokumen tambahan</strong><small>{document.originalName}</small></span><div className="management-document-check-actions"><PrivateDocumentPreview id={document.id} name={document.originalName} mimeType={document.mimeType} /><a href={`/api/admin/management/documents/${document.id}`}><Download /> Download</a></div></div>)}
  </div>;
}

export function ManagementCreatePage({ module, data, kind, initialBookingId }: { module: string; data: Context; kind?: string; initialBookingId?: string }) {
  const backHref = `/admin/manajemen/${module}`;
  const description = module === "invoice-kwitansi" ? "Terbitkan invoice terlebih dahulu. Kwitansi dibuat otomatis setelah pembayaran dicatat." : module === "pembayaran" ? "Pilih invoice, catat uang yang diterima, lalu sistem otomatis membuat kwitansi." : module === "keberangkatan" ? "Pilih paket, atur harga dan DP, isi pembayar, lalu pilih jamaah yang berangkat." : "Isi data pada form di bawah lalu periksa kembali sebelum menyimpan.";
  const header = <AdminPageHeader eyebrow={module === "invoice-kwitansi" ? "DOKUMEN TRANSAKSI" : "TAMBAH DATA"} title={module === "invoice-kwitansi" ? "Buat invoice" : `Tambah ${labels[module] ?? "data"}`} description={description} backHref={backHref} />;

  if (module === "jamaah") return <>{header}<Panel title="Data jamaah baru"><PilgrimForm /></Panel></>;
  if (module === "keberangkatan") return <>{header}<Panel title="Pendaftaran baru" description="Ikuti kotak nomor 1 sampai 4 dari atas ke bawah. Tanda hijau berarti bagian tersebut sudah lengkap."><BookingForm pilgrims={data.pilgrims.filter((item) => item.status === "active").map(({ id, fullName, whatsapp, email }) => ({ id, fullName, whatsapp, email }))} departures={data.departures.map((item) => ({ id: item.id, departureDate: item.departureDate, price: item.price, package: item.package ? { name: item.package.name } : undefined }))} agents={data.agents.filter((item) => item.status === "active").map(({ id, name, defaultCommission }) => ({ id, name, defaultCommission }))} defaultDpAmount={data.settings?.defaultDpAmount ?? 5_000_000} /></Panel></>;
  if (module === "pembayaran") {
    const active = data.documents.filter((document) => document.kind === "invoice" && document.status === "issued").flatMap((invoice) => {
      const booking = data.bookings.find((candidate) => candidate.id === invoice.bookingId);
      if (!booking || booking.status !== "active") return [];
      const linkedPayments = data.payments.filter((payment) => payment.invoiceId === invoice.id && payment.status === "confirmed");
      const linkedPaymentIds = new Set(linkedPayments.map((payment) => payment.id));
      const netPaid = linkedPayments.reduce((sum, payment) => sum + payment.amount, 0) - data.refunds.filter((refund) => linkedPaymentIds.has(refund.paymentId) && refund.status === "confirmed").reduce((sum, refund) => sum + refund.amount, 0);
      const invoiceAmount = Number(invoice.snapshot.total ?? 0);
      const invoiceRemaining = Math.max(0, invoiceAmount - netPaid);
      return invoiceRemaining > 0 ? [{ ...booking, invoiceId: invoice.id, invoiceNumber: invoice.number, invoiceAmount, invoiceRemaining }] : [];
    });
    return <>{header}{active.length ? <Panel title="Pembayaran invoice" description="Nominal pembayaran mengikuti invoice yang dipilih. Setiap kwitansi otomatis terhubung ke invoice tersebut."><PaymentForm initialBookingId={initialBookingId} bookings={active.map((booking) => ({ id: booking.id, invoiceId: booking.invoiceId, bookingNumber: booking.bookingNumber, invoiceNumber: booking.invoiceNumber, invoiceAmount: booking.invoiceAmount, invoiceRemaining: booking.invoiceRemaining, payerName: booking.payerName, registrations: booking.registrations.map((item) => ({ id: item.id, agreedPrice: item.agreedPrice, dpTarget: item.dpTarget, payment: item.payment, pilgrim: item.pilgrim ? { fullName: item.pilgrim.fullName } : undefined })) }))} accounts={data.accounts.filter((item) => item.status === "active").map(({ id, name }) => ({ id, name }))} /></Panel> : <div className="management-warning"><AlertTriangle /><span>Belum ada invoice aktif yang perlu dibayar. <Link href="/admin/manajemen/invoice-kwitansi/baru">Terbitkan invoice berikutnya.</Link></span></div>}</>;
  }
  if (module === "keuangan" && kind === "transaksi") return <>{header}<Panel title="Transaksi kas baru"><CashForm accounts={data.accounts.filter((item) => item.status === "active").map(({ id, name }) => ({ id, name }))} packages={data.packages.map(({ id, name }) => ({ id, name }))} categories={data.categories.map(({ id, name }) => ({ id, name }))} /></Panel></>;
  if (module === "keuangan") return <>{header}<Panel title="Rekening atau kas baru"><AccountForm /></Panel></>;
  if (module === "agen-referral") return <>{header}<Panel title="Agen baru"><AgentForm /></Panel></>;
  if (module === "stok" && kind === "pergerakan") return <>{header}<Panel title="Pergerakan stok"><StockForm items={data.inventory.filter((item) => item.status === "active").map(({ id, name, currentStock }) => ({ id, name, currentStock }))} /></Panel></>;
  if (module === "stok") return <>{header}<Panel title="Barang baru"><InventoryItemForm /></Panel></>;
  if (module === "manifest-room-list") return <>{header}<Panel title="Atur kamar jamaah"><RoomListForm registrations={data.registrations.map((item) => ({ id: item.id, pilgrimName: item.pilgrim?.fullName ?? "Jamaah", gender: item.pilgrim?.gender ?? null, packageName: item.package?.name ?? "Paket", roomType: item.roomType, makkahRoomNumber: item.makkahRoomNumber, madinahRoomNumber: item.madinahRoomNumber, roomNumber: item.roomNumber }))} /></Panel></>;
  if (module === "invoice-kwitansi") {
    const invoiceSequence = data.sequences.find((sequence) => sequence.kind === "invoice" && sequence.active);
    const receiptSequence = data.sequences.find((sequence) => sequence.kind === "receipt" && sequence.active);
    const now = new Date();
    const manualReceiptInvoices = data.documents.filter((document) => document.kind === "invoice" && document.status === "issued").filter((document, index, documents) => documents.findIndex((candidate) => candidate.bookingId === document.bookingId) === index).flatMap((invoice) => {
      const booking = data.bookings.find((candidate) => candidate.id === invoice.bookingId);
      const eligiblePayments = data.payments.filter((payment) => payment.invoiceId === invoice.id && payment.status === "confirmed" && !data.documents.some((document) => document.kind === "receipt" && document.paymentId === payment.id && document.status === "issued"));
      return booking && eligiblePayments.length ? [{ id: invoice.id, bookingId: invoice.bookingId, number: invoice.number, payerName: booking.payerName, payments: eligiblePayments.map((payment) => ({ id: payment.id, amountLabel: rupiah(payment.amount), paidAtLabel: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date(payment.paidAt)), method: payment.method })) }] : [];
    });
    return <>{header}<TransactionDocumentBuilder
      bookings={data.bookings.filter((booking) => booking.status === "active").flatMap((booking) => { const totalPrice = booking.registrations.reduce((sum, registration) => sum + registration.agreedPrice, 0); const alreadyInvoiced = data.documents.filter((document) => document.kind === "invoice" && document.bookingId === booking.id && document.status === "issued").reduce((sum, document) => sum + Number(document.snapshot.total ?? 0), 0); const remainingPrice = Math.max(0, totalPrice - alreadyInvoiced); return remainingPrice > 0 ? [{ id: booking.id, bookingNumber: booking.bookingNumber, payerName: booking.payerName, packageName: String(booking.packageSnapshot.name ?? "Paket umroh"), pilgrims: booking.registrations.length, totalPrice, totalDp: booking.registrations.reduce((sum, registration) => sum + Math.min(registration.dpTarget, registration.agreedPrice), 0), alreadyInvoiced, remainingPrice }] : []; })}
      invoiceNumber={invoiceSequence ? formatDocumentNumber(invoiceSequence, now).number : "Belum diatur"}
    /><ManualReceiptBuilder invoices={manualReceiptInvoices} receiptNumber={receiptSequence ? formatDocumentNumber(receiptSequence, now).number : "Belum diatur"} /><details className="management-disclosure management-numbering-settings"><summary><span><strong>Atur nomor dokumen</strong><small>Opsional — ubah nomor berikutnya jika memang diperlukan.</small></span><i>+</i></summary><div><div className="management-settings-grid"><Panel title="Nomor invoice"><SequenceForm kind="invoice" values={invoiceSequence} /></Panel><Panel title="Nomor kwitansi"><SequenceForm kind="receipt" values={receiptSequence} /></Panel></div></div></details></>;
  }
  return <>{header}<div className="management-warning"><AlertTriangle /><span>Modul ini tidak memiliki form tambah data.</span></div></>;
}

export function ManagementDetailPage({ module, id, data }: { module: string; id: string; data: Context }) {
  const backHref = `/admin/manajemen/${module}`;
  if (module === "jamaah") {
    const item = data.pilgrims.find((row) => row.id === id); if (!item) return null;
    const docs = data.pilgrimDocuments.filter((row) => row.pilgrimId === id && row.reviewStatus !== "rejected");
    const history = data.registrations.filter((row) => row.pilgrimId === id);
    const kinds = new Set(docs.map((doc) => doc.kind));
    const documentsComplete = kinds.has("ktp") && kinds.has("kk") && (kinds.has("akta_lahir") || kinds.has("buku_nikah") || kinds.has("ijazah"));
    const missingFields = [item.email, item.gender, item.birthDate, item.passportNumber, item.passportExpiry].filter((value) => !value).length;
    return <><AdminPageHeader eyebrow="DETAIL JAMAAH" title={item.fullName} description="Data pribadi, dokumen, paket, dan pembayaran jamaah tersimpan dalam satu halaman." backHref={backHref} actions={[{ href: `/admin/manajemen/jamaah/${item.id}/edit`, label: "Edit data", secondary: true, icon: "edit" }, { href: `/admin/manajemen/jamaah/${item.id}/dokumen/baru`, label: "Upload dokumen", icon: "upload" }]} /><Panel title="Data pribadi" description={missingFields ? `${missingFields} data masih belum diisi dan perlu dilengkapi.` : "Semua data utama jamaah sudah diisi."}><DetailGrid rows={[["Nama lengkap", <PilgrimValue key="name">{item.fullName}</PilgrimValue>], ["WhatsApp", <PilgrimValue key="whatsapp">{item.whatsapp}</PilgrimValue>], ["Email", <PilgrimValue key="email">{item.email}</PilgrimValue>], ["Jenis kelamin", <PilgrimValue key="gender">{item.gender}</PilgrimValue>], ["Tanggal lahir", item.birthDate ? <DateText key="birth" value={item.birthDate} /> : <PilgrimValue key="birth-missing">{null}</PilgrimValue>], ["Kewarganegaraan", <PilgrimValue key="nationality">{item.nationality}</PilgrimValue>], ["Nomor paspor", <PilgrimValue key="passport-number">{item.passportNumber}</PilgrimValue>], ["Masa berlaku paspor", item.passportExpiry ? <DateText key="passport" value={item.passportExpiry} /> : <PilgrimValue key="passport-missing">{null}</PilgrimValue>], ["Status data", item.status === "active" ? "Aktif" : "Diarsipkan"], ["Catatan", <PilgrimValue key="notes">{item.notes}</PilgrimValue>]]} /></Panel><Panel title={`Kelengkapan dokumen (${docs.length} file)`} description={documentsComplete ? "KTP, KK, dan dokumen pendukung minimal sudah lengkap." : "Dokumen kosong dapat langsung diunggah melalui tombol pada setiap baris."}><PilgrimDocumentChecklist pilgrimId={item.id} documents={docs} /></Panel><Panel title={`Riwayat paket & pembayaran (${history.length})`}>{history.length ? <div className="management-mini-list">{history.map((row) => <Link key={row.id} href={`/admin/manajemen/keberangkatan/${row.bookingId}`}><span><strong>{row.package?.name}</strong><small>{row.booking?.bookingNumber} · {row.payment.status} · terbayar {rupiah(row.payment.netPaid)}</small></span><strong>Sisa {rupiah(row.payment.outstanding)}</strong></Link>)}</div> : <p className="management-form-note">Jamaah ini belum terdaftar pada paket keberangkatan.</p>}</Panel><section className="management-danger-zone"><span><strong>Hapus data jamaah</strong><small>{history.length ? "Data ini memiliki riwayat pendaftaran sehingga tidak dapat dihapus. Gunakan arsip jika sudah tidak aktif." : "Hanya gunakan jika data salah atau duplikat. Seluruh dokumen jamaah ikut dihapus permanen."}</small></span><DeleteButton id={item.id} name={item.fullName} type="pilgrim" variant="form" /></section></>;
  }
  if (module === "keberangkatan") {
    const item = data.bookings.find((row) => row.id === id); if (!item) return null;
    const dueAt = item.registrations[0]?.dueAt;
    return <><AdminPageHeader eyebrow="DETAIL PENDAFTARAN" title={item.bookingNumber} description="Harga, DP, diskon, pembayaran, dan pembatalan tercatat tanpa mengubah histori dokumen lama." backHref={backHref} /><Panel title={item.payerName}><DetailGrid rows={[["Paket", String(item.packageSnapshot.name ?? "Paket")], ["Keberangkatan", <DateText key="date" value={item.departure?.departureDate} />], ["Batas pelunasan", <DateText key="due" value={dueAt} />], ["WhatsApp", item.payerWhatsapp], ["Agen", item.agent?.name ?? "Tanpa agen"], ["Status", item.status === "cancelled" ? "Dibatalkan" : item.status], ["Alasan pembatalan", item.cancellationReason]]} /></Panel><Panel title={`Jamaah (${item.registrations.length})`}><div className="management-mini-list">{item.registrations.map((row) => <Link href={`/admin/manajemen/jamaah/${row.pilgrimId}`} key={row.id}><span><strong>{row.pilgrim?.fullName}</strong><small>{row.payment.status} · DP {rupiah(row.dpTarget)} · diskon {rupiah(row.discountAmount)} · sisa {rupiah(row.payment.outstanding)}</small></span><strong>{rupiah(row.agreedPrice)}</strong></Link>)}</div></Panel>{item.status === "active" ? <Panel title="Pembatalan" description="Gunakan hanya jika seluruh pendaftaran ini dibatalkan."><BookingCancellationForm bookingId={item.id} /></Panel> : null}</>;
  }
  if (module === "pembayaran") {
    const item = data.payments.find((row) => row.id === id); if (!item) return null;
    const invoice = data.documents.find((document) => document.id === item.invoiceId && document.kind === "invoice" && document.status === "issued");
    const receipt = data.documents.find((document) => document.kind === "receipt" && document.paymentId === item.id && document.status === "issued");
    const refundPayments = [{ id: item.id, amount: item.amount, bookingNumber: item.booking?.bookingNumber ?? "Booking", allocations: item.allocations.map((allocation) => ({ ...allocation, pilgrimName: data.registrations.find((row) => row.id === allocation.registrationId)?.pilgrim?.fullName ?? "Jamaah" })) }];
    return <><AdminPageHeader eyebrow="DETAIL PEMBAYARAN" title={rupiah(item.amount)} description="Pembayaran terhubung ke invoice dan kwitansi secara otomatis." backHref={backHref} /><Panel title="Informasi pembayaran"><DetailGrid rows={[["Invoice", invoice?.number ?? "—"], ["Booking", item.booking?.bookingNumber], ["Pembayar", item.booking?.payerName], ["Tanggal", <DateText key="date" value={item.paidAt} />], ["Metode", item.method], ["Referensi", item.reference], ["Status", item.status], ["Kwitansi", receipt?.number ?? "Belum dibuat"]]} /><div className="management-payment-document-actions">{invoice ? <Link href={`/admin/manajemen/invoice-kwitansi/${invoice.id}`}><FileText /> Lihat invoice</Link> : null}{receipt ? <Link href={`/admin/manajemen/invoice-kwitansi/${receipt.id}`}><Download /> Lihat kwitansi</Link> : item.status === "confirmed" ? <EnsureReceiptButton bookingId={item.bookingId} paymentId={item.id} /> : null}</div></Panel>{item.status === "confirmed" ? <Panel title="Catat refund"><RefundForm payments={refundPayments} accounts={data.accounts.filter((row) => row.status === "active").map(({ id: accountId, name }) => ({ id: accountId, name }))} /></Panel> : null}<section className="management-danger-zone"><span><strong>Hapus data pembayaran</strong><small>Gunakan jika ada salah input angka pemasukan. Angka pemasukan kas, selisih kas, dan piutang otomatis dikalkulasi ulang.</small></span><DeleteButton id={item.id} name={`pembayaran ${rupiah(item.amount)}`} type="payment" variant="form" /></section></>;
  }
  if (module === "keuangan") {
    const account = data.accounts.find((row) => row.id === id);
    if (account) return <><AdminPageHeader eyebrow="DETAIL REKENING" title={account.name} description="Informasi rekening dan saldo tersimpan dalam satu halaman." backHref={backHref} action={{ href: `/admin/manajemen/keuangan/${account.id}/edit`, label: "Edit rekening", icon: "edit" }} /><Panel title="Informasi rekening atau kas"><DetailGrid rows={[["Jenis akun", account.type === "cash" ? "Kas tunai" : "Rekening bank"], ["Nama akun", account.name], ["Saldo saat ini", rupiah(account.balance)], ["Nama bank", account.type === "cash" ? "—" : account.bankName], ["Nomor rekening", account.type === "cash" ? "—" : account.accountNumber], ["Atas nama", account.type === "cash" ? "—" : account.accountHolder], ["Tampil di invoice", account.showOnInvoice ? "Ya" : "Tidak"], ["Status", account.status === "active" ? "Aktif" : "Diarsipkan"]]} /></Panel></>;
    const transaction = data.cashTransactions.find((row) => row.id === id); if (!transaction) return null;
    return <><AdminPageHeader eyebrow="DETAIL TRANSAKSI" title={transaction.description} description="Transaksi disimpan sebagai catatan audit dan tidak dapat diedit langsung." backHref={backHref} /><Panel title="Informasi transaksi"><DetailGrid rows={[["Tanggal", <DateText key="date" value={transaction.transactionAt} />], ["Jenis", transaction.direction], ["Nominal", rupiah(transaction.amount)], ["Paket", data.packages.find((row) => row.id === transaction.packageId)?.name], ["Status koreksi", transaction.isReversal ? "Transaksi pembalik" : "Transaksi aktif"]]} /></Panel></>;
  }
  if (module === "agen-referral") {
    const item = data.agents.find((row) => row.id === id); if (!item) return null;
    const commissions = data.commissions.filter((row) => row.agentId === id); const payable = commissions.filter((row) => row.status === "earned");
    return <><AdminPageHeader eyebrow="DETAIL AGEN" title={item.name} description={`Link referral: /ref/${item.referralCode}`} backHref={backHref} /><Panel title="Edit agen"><AgentForm values={item} /></Panel>{payable.length && data.accounts.length ? <Panel title="Bayar komisi sah"><CommissionPayoutForm commissions={payable.map((row) => ({ id: row.id, agentName: item.name, pilgrimName: row.pilgrim?.fullName ?? "Jamaah", amount: row.amount }))} accounts={data.accounts.filter((row) => row.status === "active").map(({ id: accountId, name }) => ({ id: accountId, name }))} /></Panel> : null}<Panel title={`Riwayat komisi (${commissions.length})`}><div className="management-mini-list">{commissions.map((row) => <div key={row.id}><span><strong>{row.pilgrim?.fullName}</strong><small>{row.status}</small></span><strong>{rupiah(row.amount)}</strong></div>)}</div></Panel><RecordStatusForm entity="agent" id={item.id} status={item.status} /></>;
  }
  if (module === "stok") {
    const item = data.inventory.find((row) => row.id === id); if (!item) return null;
    const movements = data.movements.filter((row) => row.itemId === id);
    return <><AdminPageHeader eyebrow="DETAIL BARANG" title={item.name} description={`Stok tersedia ${item.currentStock} ${item.unit}.`} backHref={backHref} /><Panel title="Edit data barang"><InventoryItemForm values={item} /></Panel><Panel title="Catat pergerakan"><StockForm items={[item]} /></Panel><Panel title={`Histori (${movements.length})`}><div className="management-mini-list">{movements.map((row) => <div key={row.id}><span><strong>{row.kind === "in" ? "Stok masuk" : row.kind === "out" ? "Stok keluar" : "Penyesuaian"}</strong><small><DateText value={row.movedAt} /> · saldo {row.balanceAfter}</small></span><strong>{row.quantity}</strong></div>)}</div></Panel><RecordStatusForm entity="inventory" id={item.id} status={item.status} /></>;
  }
  if (module === "manifest-room-list") {
    const item = data.registrations.find((row) => row.id === id); if (!item) return null;
    return <><AdminPageHeader eyebrow="ATUR ROOM LIST" title={item.pilgrim?.fullName ?? "Jamaah"} description={`${item.package?.name ?? "Paket"} · ${item.pilgrim?.gender ?? "Jenis kelamin belum diisi"}`} backHref={backHref} /><Panel title="Penempatan kamar"><RoomListForm defaultRegistrationId={item.id} defaultRoomType={item.roomType ?? "quad"} registrations={[{ id: item.id, pilgrimName: item.pilgrim?.fullName ?? "Jamaah", gender: item.pilgrim?.gender ?? null, packageName: item.package?.name ?? "Paket", roomType: item.roomType, makkahRoomNumber: item.makkahRoomNumber, madinahRoomNumber: item.madinahRoomNumber, roomNumber: item.roomNumber }]} /></Panel></>;
  }
  if (module === "invoice-kwitansi") {
    const item = data.documents.find((row) => row.id === id); if (!item) return null;
    const linkedPayments = item.kind === "invoice" ? data.payments.filter((payment) => payment.invoiceId === item.id && payment.status === "confirmed") : [];
    const linkedPaymentIds = new Set(linkedPayments.map((payment) => payment.id));
    const paid = linkedPayments.reduce((sum, payment) => sum + payment.amount, 0) - data.refunds.filter((refund) => linkedPaymentIds.has(refund.paymentId) && refund.status === "confirmed").reduce((sum, refund) => sum + refund.amount, 0);
    const outstanding = item.kind === "invoice" ? Math.max(0, Number(item.snapshot.total ?? 0) - paid) : 0;
    const paymentLabel = outstanding <= 0 ? "Lunas" : paid > 0 ? "Cicilan" : "Belum bayar";
    const rows: Array<[string, React.ReactNode]> = [["Nomor", item.number], ["Jenis", item.kind === "invoice" ? "Invoice" : "Kwitansi"], ["Tanggal terbit", <DateText key="date" value={item.issuedAt} />], ["Status dokumen", item.status]];
    if (item.kind === "invoice") rows.push(["Status pembayaran", paymentLabel], ["Sudah dibayar", rupiah(paid)], ["Sisa tagihan", rupiah(outstanding)]);
    return <><AdminPageHeader eyebrow="DETAIL DOKUMEN" title={item.number} description={item.kind === "invoice" ? `Status pembayaran: ${paymentLabel}. Kwitansi dibuat otomatis setiap pembayaran diterima.` : "Kwitansi ini dibuat dari pembayaran yang sudah diterima."} backHref={backHref} action={item.kind === "invoice" && outstanding > 0 ? { href: `/admin/manajemen/pembayaran/baru?booking=${item.bookingId}`, label: "Catat pembayaran" } : undefined} /><section className="management-issued-document-layout"><div className="management-issued-document-preview"><header><span><small>PREVIEW DOKUMEN</small><strong>{item.kind === "invoice" ? "Invoice" : "Kwitansi"} · {item.number}</strong></span><span className="management-status good">Dokumen terbit</span></header><div className={item.kind === "invoice" ? "portrait" : "landscape"}><IssuedDocumentPreview id={item.id} label={`Preview ${item.kind === "invoice" ? "invoice" : "kwitansi"} ${item.number}`} /></div></div><Panel title="Informasi & tindakan"><DetailGrid rows={rows} /><div className="management-document-downloads"><a className="management-create-link" href={`/api/admin/management/issued-documents/${item.id}`}><Download /> Download PDF / Print</a><a className="management-create-link secondary" href={`/api/admin/management/issued-documents/${item.id}?format=png`}><Download /> Download PNG</a><DeleteButton id={item.id} name={item.number} type="document" documentKind={item.kind} variant="form" /></div></Panel></section></>;
  }
  return null;
}

export function ManagementPilgrimEditPage({ id, data }: { id: string; data: Context }) {
  const item = data.pilgrims.find((row) => row.id === id);
  if (!item) return null;
  const detailHref = `/admin/manajemen/jamaah/${item.id}`;
  return <><AdminPageHeader eyebrow="EDIT JAMAAH" title={item.fullName} description="Perbarui data jamaah pada form ini. Dokumen dikelola dari halaman detail jamaah." backHref={detailHref} /><Panel title="Edit data jamaah"><PilgrimForm values={item} /></Panel><RecordStatusForm entity="pilgrim" id={item.id} status={item.status} /></>;
}

export function ManagementAccountEditPage({ id, data }: { id: string; data: Context }) {
  const account = data.accounts.find((row) => row.id === id);
  if (!account) return null;
  const detailHref = `/admin/manajemen/keuangan/${account.id}`;
  return <><AdminPageHeader eyebrow="EDIT REKENING" title={account.name} description="Perbarui informasi rekening atau kas pada form ini." backHref={detailHref} /><Panel title="Edit rekening atau kas"><AccountForm values={account} /></Panel><RecordStatusForm entity="account" id={account.id} status={account.status} /></>;
}

export function ManagementPilgrimDocumentCreatePage({ id, data, initialKind }: { id: string; data: Context; initialKind?: string }) {
  const item = data.pilgrims.find((row) => row.id === id);
  if (!item) return null;
  return <><AdminPageHeader eyebrow="UPLOAD DOKUMEN" title={item.fullName} description="Jenis dokumen sudah dipilih dari checklist. Pilih file lalu unggah untuk kembali ke detail jamaah." backHref={`/admin/manajemen/jamaah/${item.id}`} /><Panel title="Dokumen baru"><PilgrimDocumentUpload pilgrims={[{ id: item.id, fullName: item.fullName }]} initialKind={initialKind} /></Panel></>;
}

import Link from "next/link";
import { AlertTriangle, Download, ExternalLink } from "lucide-react";

import type { getManagementContext } from "@/lib/management/data";
import { rupiah } from "@/lib/management/domain";
import { AdminPageHeader } from "./AdminUi";
import { IssueDocumentButton } from "./IssueDocumentButton";
import {
  AccountForm,
  AgentForm,
  BookingForm,
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

type Context = Awaited<ReturnType<typeof getManagementContext>>;

const labels: Record<string, string> = {
  jamaah: "Data Jamaah",
  keberangkatan: "Pendaftaran & Keberangkatan",
  pembayaran: "Pembayaran Jamaah",
  keuangan: "Kas & Keuangan",
  "agen-referral": "Agen & Referral",
  stok: "Stok Perlengkapan",
  "manifest-room-list": "Manifest & Room List",
  dokumen: "Dokumen Jamaah",
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

export function ManagementCreatePage({ module, data, kind }: { module: string; data: Context; kind?: string }) {
  const backHref = `/admin/manajemen/${module}`;
  const header = <AdminPageHeader eyebrow="TAMBAH DATA" title={`Tambah ${labels[module] ?? "data"}`} description="Isi data pada form di bawah lalu periksa kembali sebelum menyimpan." backHref={backHref} />;

  if (module === "jamaah") return <>{header}<Panel title="Data jamaah baru"><PilgrimForm /></Panel></>;
  if (module === "keberangkatan") return <>{header}<Panel title="Pendaftaran baru" description="Satu pembayar dapat mendaftarkan beberapa jamaah."><BookingForm pilgrims={data.pilgrims.filter((item) => item.status === "active").map(({ id, fullName, whatsapp }) => ({ id, fullName, whatsapp }))} departures={data.departures.map((item) => ({ id: item.id, departureDate: item.departureDate, price: item.price, package: item.package ? { name: item.package.name } : undefined }))} agents={data.agents.filter((item) => item.status === "active").map(({ id, name, defaultCommission }) => ({ id, name, defaultCommission }))} /></Panel></>;
  if (module === "pembayaran") {
    const active = data.bookings.filter((item) => item.registrations.some((registration) => registration.payment.outstanding > 0));
    return <>{header}<Panel title="Pembayaran baru"><PaymentForm bookings={active.map((booking) => ({ id: booking.id, bookingNumber: booking.bookingNumber, payerName: booking.payerName, registrations: booking.registrations.map((item) => ({ id: item.id, agreedPrice: item.agreedPrice, payment: item.payment, pilgrim: item.pilgrim ? { fullName: item.pilgrim.fullName } : undefined })) }))} accounts={data.accounts.filter((item) => item.status === "active").map(({ id, name }) => ({ id, name }))} /></Panel></>;
  }
  if (module === "keuangan" && kind === "transaksi") return <>{header}<Panel title="Transaksi kas baru"><CashForm accounts={data.accounts.filter((item) => item.status === "active").map(({ id, name }) => ({ id, name }))} packages={data.packages.map(({ id, name }) => ({ id, name }))} categories={data.categories.map(({ id, name }) => ({ id, name }))} /></Panel></>;
  if (module === "keuangan") return <>{header}<Panel title="Rekening atau kas baru"><AccountForm /></Panel></>;
  if (module === "agen-referral") return <>{header}<Panel title="Agen baru"><AgentForm /></Panel></>;
  if (module === "stok" && kind === "pergerakan") return <>{header}<Panel title="Pergerakan stok"><StockForm items={data.inventory.filter((item) => item.status === "active").map(({ id, name, currentStock }) => ({ id, name, currentStock }))} /></Panel></>;
  if (module === "stok") return <>{header}<Panel title="Barang baru"><InventoryItemForm /></Panel></>;
  if (module === "manifest-room-list") return <>{header}<Panel title="Atur kamar jamaah"><RoomListForm registrations={data.registrations.map((item) => ({ id: item.id, pilgrimName: item.pilgrim?.fullName ?? "Jamaah", gender: item.pilgrim?.gender ?? null, packageName: item.package?.name ?? "Paket" }))} /></Panel></>;
  if (module === "dokumen") return <>{header}<Panel title="Upload dokumen"><PilgrimDocumentUpload pilgrims={data.pilgrims.filter((item) => item.status === "active").map(({ id, fullName }) => ({ id, fullName }))} /></Panel></>;
  if (module === "invoice-kwitansi") return <>{header}<div className="management-settings-grid"><Panel title="Format nomor invoice"><SequenceForm kind="invoice" /></Panel><Panel title="Format nomor kwitansi"><SequenceForm kind="receipt" /></Panel></div><Panel title="Pilih transaksi"><div className="management-document-actions">{data.bookings.map((booking) => <article key={booking.id}><span><strong>{booking.bookingNumber} · {booking.payerName}</strong><small>{String(booking.packageSnapshot.name ?? "Paket")} · {booking.registrations.length} jamaah</small></span><div><IssueDocumentButton kind="invoice" bookingId={booking.id} />{data.payments.filter((payment) => payment.bookingId === booking.id && payment.status === "confirmed").map((payment) => <IssueDocumentButton key={payment.id} kind="receipt" bookingId={booking.id} paymentId={payment.id} />)}</div></article>)}</div></Panel></>;
  return <>{header}<div className="management-warning"><AlertTriangle /><span>Modul ini tidak memiliki form tambah data.</span></div></>;
}

export function ManagementDetailPage({ module, id, data }: { module: string; id: string; data: Context }) {
  const backHref = `/admin/manajemen/${module}`;
  if (module === "jamaah") {
    const item = data.pilgrims.find((row) => row.id === id); if (!item) return null;
    const docs = data.pilgrimDocuments.filter((row) => row.pilgrimId === id);
    const history = data.registrations.filter((row) => row.pilgrimId === id);
    return <><AdminPageHeader eyebrow="DETAIL JAMAAH" title={item.fullName} description="Edit profil, lihat dokumen, paket, dan riwayat pembayaran jamaah." backHref={backHref} /><Panel title="Edit data jamaah"><PilgrimForm values={item} /></Panel><div className="management-detail-columns"><Panel title={`Dokumen (${docs.length})`}><div className="management-mini-list">{docs.map((doc) => <a key={doc.id} href={`/api/admin/management/documents/${doc.id}`}><span><strong>{doc.kind.replaceAll("_", " ")}</strong><small>{doc.originalName}</small></span><ExternalLink /></a>)}</div><Link className="management-secondary-link" href={`/admin/manajemen/dokumen/${item.id}`}>Kelola dokumen</Link></Panel><Panel title={`Riwayat paket (${history.length})`}><div className="management-mini-list">{history.map((row) => <Link key={row.id} href={`/admin/manajemen/keberangkatan/${row.bookingId}`}><span><strong>{row.package?.name}</strong><small>{row.booking?.bookingNumber} · {row.payment.status}</small></span><strong>{rupiah(row.payment.outstanding)}</strong></Link>)}</div></Panel></div><RecordStatusForm entity="pilgrim" id={item.id} status={item.status} /></>;
  }
  if (module === "keberangkatan") {
    const item = data.bookings.find((row) => row.id === id); if (!item) return null;
    return <><AdminPageHeader eyebrow="DETAIL PENDAFTARAN" title={item.bookingNumber} description="Riwayat pendaftaran bersifat tetap agar invoice dan transaksi lama tetap akurat." backHref={backHref} /><Panel title={item.payerName}><DetailGrid rows={[["Paket", String(item.packageSnapshot.name ?? "Paket")], ["Keberangkatan", <DateText key="date" value={item.departure?.departureDate} />], ["WhatsApp", item.payerWhatsapp], ["Agen", item.agent?.name ?? "Tanpa agen"], ["Status", item.status]]} /></Panel><Panel title={`Jamaah (${item.registrations.length})`}><div className="management-mini-list">{item.registrations.map((row) => <Link href={`/admin/manajemen/jamaah/${row.pilgrimId}`} key={row.id}><span><strong>{row.pilgrim?.fullName}</strong><small>{row.payment.status} · sisa {rupiah(row.payment.outstanding)}</small></span><strong>{rupiah(row.agreedPrice)}</strong></Link>)}</div></Panel></>;
  }
  if (module === "pembayaran") {
    const item = data.payments.find((row) => row.id === id); if (!item) return null;
    const refundPayments = [{ id: item.id, amount: item.amount, bookingNumber: item.booking?.bookingNumber ?? "Booking", allocations: item.allocations.map((allocation) => ({ ...allocation, pilgrimName: data.registrations.find((row) => row.id === allocation.registrationId)?.pilgrim?.fullName ?? "Jamaah" })) }];
    return <><AdminPageHeader eyebrow="DETAIL PEMBAYARAN" title={rupiah(item.amount)} description="Pembayaran lama tidak diedit atau dihapus. Jika salah, catat refund sebagai histori koreksi." backHref={backHref} /><Panel title="Informasi pembayaran"><DetailGrid rows={[["Booking", item.booking?.bookingNumber], ["Pembayar", item.booking?.payerName], ["Tanggal", <DateText key="date" value={item.paidAt} />], ["Metode", item.method], ["Referensi", item.reference], ["Status", item.status]]} /></Panel>{item.status === "confirmed" ? <Panel title="Catat refund"><RefundForm payments={refundPayments} accounts={data.accounts.filter((row) => row.status === "active").map(({ id: accountId, name }) => ({ id: accountId, name }))} /></Panel> : null}</>;
  }
  if (module === "keuangan") {
    const account = data.accounts.find((row) => row.id === id);
    if (account) return <><AdminPageHeader eyebrow="DETAIL REKENING" title={account.name} description={`Saldo saat ini ${rupiah(account.balance)}.`} backHref={backHref} /><Panel title="Edit rekening atau kas"><AccountForm values={account} /></Panel><RecordStatusForm entity="account" id={account.id} status={account.status} /></>;
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
    return <><AdminPageHeader eyebrow="ATUR ROOM LIST" title={item.pilgrim?.fullName ?? "Jamaah"} description={`${item.package?.name ?? "Paket"} · ${item.pilgrim?.gender ?? "Jenis kelamin belum diisi"}`} backHref={backHref} /><Panel title="Penempatan kamar"><RoomListForm registrations={[{ id: item.id, pilgrimName: item.pilgrim?.fullName ?? "Jamaah", gender: item.pilgrim?.gender ?? null, packageName: item.package?.name ?? "Paket" }]} /></Panel></>;
  }
  if (module === "dokumen") {
    const pilgrim = data.pilgrims.find((row) => row.id === id); if (!pilgrim) return null; const docs = data.pilgrimDocuments.filter((row) => row.pilgrimId === id);
    return <><AdminPageHeader eyebrow="DOKUMEN JAMAAH" title={pilgrim.fullName} description="Dokumen tersimpan privat dan link download akan kedaluwarsa otomatis." backHref={backHref} /><Panel title="Upload dokumen baru"><PilgrimDocumentUpload pilgrims={[{ id: pilgrim.id, fullName: pilgrim.fullName }]} /></Panel><Panel title={`File tersimpan (${docs.length})`}><div className="management-report-links">{docs.map((doc) => <div key={doc.id}><span><strong>{doc.kind.replaceAll("_", " ")}</strong><small>{doc.originalName} · {doc.reviewStatus}</small></span><a href={`/api/admin/management/documents/${doc.id}`}><Download /> Download</a></div>)}</div></Panel></>;
  }
  if (module === "invoice-kwitansi") {
    const item = data.documents.find((row) => row.id === id); if (!item) return null;
    return <><AdminPageHeader eyebrow="DETAIL DOKUMEN" title={item.number} description="PDF ini memakai snapshot transaksi saat diterbitkan sehingga tidak berubah." backHref={backHref} /><Panel title={item.kind === "invoice" ? "Invoice" : "Kwitansi"}><DetailGrid rows={[["Nomor", item.number], ["Jenis", item.kind === "invoice" ? "Invoice" : "Kwitansi"], ["Tanggal terbit", <DateText key="date" value={item.issuedAt} />], ["Status", item.status]]} /><a className="management-create-link" href={`/api/admin/management/issued-documents/${item.id}`}><Download /> Download PDF</a></Panel></>;
  }
  return null;
}

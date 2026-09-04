import Link from "next/link";
import { AlertTriangle, ArrowRight, Banknote, Boxes, CakeSlice, CheckCircle2, Clock3, FileText, FileWarning, Landmark, MessageCircle, PackageCheck, ReceiptText, UsersRound, Wallet, WalletCards } from "lucide-react";

import type { getManagementContext } from "@/lib/management/data";
import { DEFAULT_BIRTHDAY_MESSAGE, rupiah } from "@/lib/management/domain";
import { InitializeManagementButton, ManagementSettingsForm, ReportInclusionToggleForm } from "./ManagementForms";
import { AdminPageHeader } from "./AdminUi";
import { CsvImportForm } from "./CsvImportForm";
import { DeleteButton } from "./DeleteButton";
import { ReportDownloadFilters } from "./ReportDownloadFilters";
import { RoomListWorkspace } from "./RoomListWorkspace";

type Context = Awaited<ReturnType<typeof getManagementContext>>;

function Empty({ children }: { children: React.ReactNode }) { return <div className="management-empty"><CheckCircle2 /><p>{children}</p></div>; }
function Status({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "good" | "warn" | "bad" | "neutral" }) { return <span className={`management-status ${tone}`}>{children}</span>; }
function DateText({ value }: { value: Date | string | null | undefined }) { return <>{value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date(value)) : "—"}</>; }

function whatsappNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

function Overview({ data }: { data: Context }) {
  const cards = [
    ["Jamaah aktif", data.dashboard.activePilgrims, UsersRound, "jamaah"],
    ["Pendaftaran", data.dashboard.registrations, PackageCheck, "keberangkatan"],
    ["Saldo kas & bank", rupiah(data.dashboard.netCash), Banknote, "keuangan"],
    ["Piutang jamaah", rupiah(data.dashboard.receivables), WalletCards, "pembayaran"],
  ] as const;
  return <>
    <AdminPageHeader eyebrow="MANAJEMEN INTERNAL" title="Ringkasan hari ini" description="Yang perlu diperhatikan tampil lebih dulu. Pilih satu pekerjaan untuk mulai." />
    {!data.settings ? <section className="management-setup"><div><strong>Siapkan data awal</strong><p>Buat kategori biaya dan daftar perlengkapan standar sekali saja.</p></div><InitializeManagementButton /></section> : null}
    <section className="management-kpis">{cards.map(([label, value, Icon, href]) => <Link key={label} href={`/admin/manajemen/${href}`}><span><Icon /></span><small>{label}</small><strong>{value}</strong><ArrowRight /></Link>)}</section>
    <div className="management-dashboard-columns">
      <section className="management-panel"><header><div><small>PERLU DITINDAK</small><h2>Pekerjaan penting</h2></div></header><div className="management-action-list">
        <Link href="/admin/manajemen/pembayaran"><Clock3 /><span><strong>{data.dashboard.dueSoon} pelunasan mendekati batas</strong><small>Periksa jamaah yang belum lunas menjelang H-30.</small></span><ArrowRight /></Link>
        <Link href="/admin/manajemen/jamaah"><FileWarning /><span><strong>{data.dashboard.incompleteDocuments} dokumen belum lengkap</strong><small>Buka detail jamaah untuk melengkapi KTP, KK, atau dokumen pendukung.</small></span><ArrowRight /></Link>
        <Link href="/admin/manajemen/stok"><Boxes /><span><strong>{data.dashboard.lowStock} barang menipis</strong><small>Stok sudah menyentuh batas minimum.</small></span><ArrowRight /></Link>
        <Link href="/admin/manajemen/agen-referral"><Banknote /><span><strong>{rupiah(data.dashboard.earnedCommission)} komisi siap dibayar</strong><small>Komisi jamaah lunas yang belum dibayarkan.</small></span><ArrowRight /></Link>
      </div></section>
      <section className="management-panel"><header><div><small>TERBARU</small><h2>Pendaftaran terakhir</h2></div><Link href="/admin/manajemen/keberangkatan">Lihat semua</Link></header>{data.bookings.length ? <div className="management-mini-list">{data.bookings.slice(0, 5).map((booking) => <div key={booking.id}><span><strong>{booking.payerName}</strong><small>{booking.bookingNumber} · {booking.registrations.length} jamaah</small></span><Status>{booking.status === "active" ? "Aktif" : booking.status}</Status></div>)}</div> : <Empty>Belum ada pendaftaran.</Empty>}</section>
    </div>
    <section className="management-panel management-birthday-panel"><header><div><small>PERHATIAN PERSONAL</small><h2>Ulang tahun jamaah</h2><p>Hari ini dan 14 hari ke depan. Ucapan tetap dikirim manual melalui WhatsApp.</p></div><Status tone={data.upcomingBirthdays.some((item) => item.daysUntil === 0) ? "warn" : "neutral"}>{data.upcomingBirthdays.length} jamaah</Status></header>{data.upcomingBirthdays.length ? <div className="management-birthday-list">{data.upcomingBirthdays.map((birthday) => { const template = data.settings?.birthdayMessageTemplate || DEFAULT_BIRTHDAY_MESSAGE; const message = template.replaceAll("[NAMA]", birthday.fullName).replaceAll("[UMUR]", String(birthday.age)); return <article key={birthday.id}><span><CakeSlice /></span><div><strong>{birthday.fullName}</strong><small><DateText value={`${birthday.birthDate}T00:00:00+07:00`} /> · usia {birthday.age} tahun</small></div><Status tone={birthday.daysUntil === 0 ? "warn" : "neutral"}>{birthday.daysUntil === 0 ? "Hari ini" : `${birthday.daysUntil} hari lagi`}</Status><a href={`https://wa.me/${whatsappNumber(birthday.whatsapp)}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle /> Kirim ucapan</a></article>; })}</div> : <Empty>Tidak ada jamaah yang berulang tahun dalam 14 hari ke depan.</Empty>}</section>
  </>;
}

function Pilgrims({ data }: { data: Context }) {
  return <><AdminPageHeader eyebrow="OPERASIONAL JAMAAH" title="Data Jamaah" description="Cari data jamaah dan tambahkan jamaah baru tanpa melewati form yang rumit." action={{ href: "/admin/manajemen/jamaah/baru", label: "Tambah jamaah" }} />
    <section className="management-panel"><header><div><small>{data.pilgrims.length} DATA</small><h2>Daftar jamaah</h2></div></header>{data.pilgrims.length ? <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Jamaah</th><th>Kontak</th><th>Dokumen</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{data.pilgrims.map((pilgrim) => { const docs = data.pilgrimDocuments.filter((doc) => doc.pilgrimId === pilgrim.id && doc.reviewStatus !== "rejected"); const kinds = new Set(docs.map((doc) => doc.kind)); const documentsComplete = kinds.has("ktp") && kinds.has("kk") && (kinds.has("akta_lahir") || kinds.has("buku_nikah") || kinds.has("ijazah")); return <tr className="management-clickable-row" key={pilgrim.id}><td><Link className="management-row-main" href={`/admin/manajemen/jamaah/${pilgrim.id}`}><strong>{pilgrim.fullName}</strong><small>{pilgrim.passportNumber ? `Paspor ${pilgrim.passportNumber}` : "Paspor belum diisi"}</small></Link></td><td>{pilgrim.whatsapp}<small>{pilgrim.email || "Email opsional"}</small></td><td><Status tone={documentsComplete ? "good" : "warn"}>{documentsComplete ? "Lengkap" : `${docs.length} file`}</Status></td><td><Status tone={pilgrim.status === "active" ? "good" : "neutral"}>{pilgrim.status === "active" ? "Aktif" : "Diarsipkan"}</Status></td><td><span className="management-row-link">Lihat detail</span></td></tr>; })}</tbody></table></div> : <Empty>Belum ada data jamaah.</Empty>}</section>
  </>;
}

function Departures({ data }: { data: Context }) {
  return <><AdminPageHeader eyebrow="OPERASIONAL PERJALANAN" title="Pendaftaran & keberangkatan" description="Pilih jamaah, paket, harga kesepakatan, dan agen dalam satu langkah." action={{ href: "/admin/manajemen/keberangkatan/baru", label: "Buat pendaftaran" }} />
    <section className="management-panel"><header><div><small>{data.bookings.length} BOOKING</small><h2>Pendaftaran jamaah</h2></div></header>{data.bookings.length ? <div className="management-card-list">{data.bookings.map((booking) => <Link className="management-record-card" href={`/admin/manajemen/keberangkatan/${booking.id}`} key={booking.id}><article><div><Status tone="good">{booking.bookingNumber}</Status><h3>{booking.payerName}</h3><p>{String(booking.packageSnapshot.name ?? "Paket")} · <DateText value={booking.departure?.departureDate} /></p></div><dl><div><dt>Jamaah</dt><dd>{booking.registrations.length}</dd></div><div><dt>Total tagihan</dt><dd>{rupiah(booking.registrations.reduce((sum, item) => sum + item.agreedPrice, 0))}</dd></div><div><dt>Agen</dt><dd>{booking.agent?.name ?? "—"}</dd></div></dl></article></Link>)}</div> : <Empty>Belum ada pendaftaran.</Empty>}</section>
  </>;
}

function Payments({ data }: { data: Context }) {
  const payableInvoices = data.documents.filter((document) => document.kind === "invoice" && document.status === "issued").filter((invoice) => { const linkedPayments = data.payments.filter((payment) => payment.invoiceId === invoice.id && payment.status === "confirmed"); const ids = new Set(linkedPayments.map((payment) => payment.id)); const paid = linkedPayments.reduce((sum, payment) => sum + payment.amount, 0) - data.refunds.filter((refund) => ids.has(refund.paymentId) && refund.status === "confirmed").reduce((sum, refund) => sum + refund.amount, 0); return paid < Number(invoice.snapshot.total ?? 0); });
  return <><AdminPageHeader eyebrow="TRANSAKSI JAMAAH" title="Pembayaran jamaah" description="Pembayaran dicatat dari invoice. Setelah tersimpan, kwitansi otomatis dibuat." action={data.accounts.length && payableInvoices.length ? { href: "/admin/manajemen/pembayaran/baru", label: "Bayar invoice" } : undefined} />
    {!data.accounts.length ? <div className="management-warning"><AlertTriangle /><span>Tambahkan rekening atau kas di menu Kas & Keuangan sebelum mencatat pembayaran.</span></div> : null}
    {data.accounts.length && !payableInvoices.length ? <div className="management-warning"><AlertTriangle /><span>Belum ada invoice aktif yang perlu dibayar. <Link href="/admin/manajemen/invoice-kwitansi/baru">Terbitkan invoice terlebih dahulu.</Link></span></div> : null}
    <section className="management-panel"><header><div><small>{data.payments.length} TRANSAKSI</small><h2>Histori pembayaran</h2></div></header>{data.payments.length ? <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Tanggal</th><th>Booking</th><th>Metode</th><th>Nominal</th><th>Status</th><th>Laporan</th><th>Aksi</th></tr></thead><tbody>{data.payments.map((item) => <tr key={item.id}><td><DateText value={item.paidAt} /></td><td><strong>{item.booking?.bookingNumber ?? "—"}</strong><small>{item.booking?.payerName}</small></td><td>{item.method}</td><td>{rupiah(item.amount)}</td><td><Status tone={item.status === "confirmed" ? "good" : "bad"}>{item.status === "confirmed" ? "Diterima" : "Dibatalkan"}</Status></td><td><Status tone={item.isIncludedInReports !== false ? "good" : "neutral"}>{item.isIncludedInReports !== false ? "Masuk Laporan" : "Non-Laporan"}</Status></td><td><Link className="management-row-link" href={`/admin/manajemen/pembayaran/${item.id}`}>Lihat detail</Link></td></tr>)}</tbody></table></div> : <Empty>Belum ada pembayaran.</Empty>}</section>
    <section className="management-panel"><header><div><small>STATUS OTOMATIS</small><h2>Tagihan per jamaah</h2></div></header>{data.registrations.length ? <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Jamaah</th><th>Paket</th><th>Terbayar</th><th>Sisa</th><th>Status</th><th>Jatuh tempo</th></tr></thead><tbody>{data.registrations.map((item) => <tr key={item.id}><td><strong>{item.pilgrim?.fullName ?? "—"}</strong><small>{item.booking?.bookingNumber}</small></td><td>{item.package?.name ?? "—"}</td><td>{rupiah(item.payment.netPaid)}</td><td>{rupiah(item.payment.outstanding)}</td><td><Status tone={item.payment.status === "Lunas" ? "good" : item.payment.partialRefund ? "bad" : "warn"}>{item.payment.partialRefund ? `${item.payment.status} · Refund sebagian` : item.payment.status}</Status></td><td><DateText value={item.dueAt} /></td></tr>)}</tbody></table></div> : <Empty>Belum ada tagihan jamaah.</Empty>}</section>
  </>;
}

function Finance({ data }: { data: Context }) {
  const activeAccounts = data.accounts.filter((account) => account.status === "active");
  const totalBalance = activeAccounts.reduce((total, account) => total + account.balance, 0);
  return <><AdminPageHeader eyebrow="KEUANGAN INTERNAL" title="Kas & keuangan" description="Saldo dipisah per rekening. Kas aktual dan piutang tidak dicampur." actions={[{ href: "/admin/manajemen/keuangan/baru?jenis=rekening", label: "Tambah rekening", secondary: data.accounts.length > 0 }, ...(data.accounts.length ? [{ href: "/admin/manajemen/keuangan/baru?jenis=transaksi", label: "Catat transaksi" }] : [])]} />
    <section className="management-panel management-accounts-panel"><header><div><small>{activeAccounts.length} AKUN AKTIF</small><h2>Rekening & kas</h2><p>Pilih rekening untuk melihat informasi lengkap atau mengubah datanya.</p></div><div className="management-accounts-total"><span>Total saldo aktif</span><strong>{rupiah(totalBalance)}</strong></div></header>{data.accounts.length ? <div className="management-account-grid">{data.accounts.map((account) => { const AccountIcon = account.type === "cash" ? Wallet : Landmark; return <Link className="management-record-card" href={`/admin/manajemen/keuangan/${account.id}`} key={account.id}><article className={account.status !== "active" ? "archived" : undefined}><header><span className="management-account-icon"><AccountIcon /></span><div><small>{account.type === "cash" ? "KAS TUNAI" : "REKENING BANK"}</small><h3>{account.name}</h3></div><Status tone={account.status === "active" ? "good" : "neutral"}>{account.status === "active" ? "Aktif" : "Arsip"}</Status></header><div className="management-account-balance"><span>Saldo saat ini</span><strong>{rupiah(account.balance)}</strong></div><dl><div><dt>Bank / nomor rekening</dt><dd>{account.type === "cash" ? "Kas tunai" : [account.bankName, account.accountNumber].filter(Boolean).join(" · ") || "Belum diisi"}</dd></div><div><dt>Atas nama</dt><dd>{account.accountHolder || "Belum diisi"}</dd></div></dl><footer><span>{account.showOnInvoice ? "Tampil di invoice" : "Tidak tampil di invoice"}</span><strong>Lihat detail <ArrowRight /></strong></footer></article></Link>; })}</div> : <Empty>Belum ada rekening atau kas. Tambahkan akun pertama untuk mulai mencatat transaksi.</Empty>}</section>
    <section className="management-panel"><header><div><small>TRANSAKSI TERBARU</small><h2>Arus kas</h2></div></header>{data.cashTransactions.length ? <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Jenis</th><th>Nominal</th><th>Laporan</th><th>Aksi</th></tr></thead><tbody>{data.cashTransactions.slice(0, 50).map((item) => <tr key={item.id}><td><DateText value={item.transactionAt} /></td><td><strong>{item.description}</strong></td><td><Status tone={item.direction === "in" ? "good" : item.direction === "out" ? "bad" : "neutral"}>{item.direction === "in" ? "Masuk" : item.direction === "out" ? "Keluar" : "Transfer"}</Status></td><td>{rupiah(item.amount)}</td><td><Status tone={item.isIncludedInReports !== false ? "good" : "neutral"}>{item.isIncludedInReports !== false ? "Masuk" : "Non-Laporan"}</Status></td><td><Link className="management-row-link" href={`/admin/manajemen/keuangan/${item.id}`}>Lihat detail</Link></td></tr>)}</tbody></table></div> : <Empty>Belum ada transaksi kas.</Empty>}</section>
  </>;
}

function Agents({ data }: { data: Context }) { return <><AdminPageHeader eyebrow="PEMASARAN AGEN" title="Agen & referral" description="Setiap agen mendapat link unik. Komisi baru sah setelah jamaah lunas." action={{ href: "/admin/manajemen/agen-referral/baru", label: "Tambah agen" }} /><section className="management-panel"><header><div><small>{data.agents.length} AGEN</small><h2>Daftar agen</h2></div></header>{data.agents.length ? <div className="management-card-list compact">{data.agents.map((agent) => { const earned = data.commissions.filter((item) => item.agentId === agent.id && item.status === "earned").reduce((sum, item) => sum + item.amount, 0); return <Link className="management-record-card" href={`/admin/manajemen/agen-referral/${agent.id}`} key={agent.id}><article><div><Status tone={agent.status === "active" ? "good" : "neutral"}>{agent.status === "active" ? "Aktif" : "Arsip"}</Status><h3>{agent.name}</h3><p>{agent.whatsapp}</p><span>/ref/{agent.referralCode}</span></div><dl><div><dt>Komisi default</dt><dd>{rupiah(agent.defaultCommission)}</dd></div><div><dt>Siap dibayar</dt><dd>{rupiah(earned)}</dd></div></dl></article></Link>; })}</div> : <Empty>Belum ada agen.</Empty>}</section><section className="management-panel"><header><div><small>{data.leads.length} LEAD VALID</small><h2>Form konsultasi agen</h2></div></header>{data.leads.length ? <div className="management-mini-list">{data.leads.map((lead) => <div key={lead.id}><span><strong>{lead.name}</strong><small>{lead.agent?.name} · {lead.package?.name ?? "Belum pilih paket"} · {lead.whatsapp}</small><small>Masuk <DateText value={lead.createdAt} /> · {[lead.utmSource, lead.utmCampaign].filter(Boolean).join(" / ") || lead.sourcePath || "Referral langsung"}</small></span><Status tone={lead.status === "converted" ? "good" : "warn"}>{lead.status === "new" ? "Baru" : lead.status}</Status></div>)}</div> : <Empty>Belum ada data dari form konsultasi agen.</Empty>}</section></>; }

function Stock({ data }: { data: Context }) { return <><AdminPageHeader eyebrow="LOGISTIK UMRAH" title="Stok perlengkapan" description="Stok keluar tidak bisa melebihi barang yang tersedia." actions={[{ href: "/admin/manajemen/stok/baru?jenis=barang", label: "Tambah barang", secondary: data.inventory.length > 0 }, ...(data.inventory.length ? [{ href: "/admin/manajemen/stok/baru?jenis=pergerakan", label: "Catat stok" }] : [])]} /><section className="management-inventory-grid">{data.inventory.map((item) => <Link className="management-record-card" href={`/admin/manajemen/stok/${item.id}`} key={item.id}><article className={item.currentStock <= item.minimumStock ? "low" : ""}><span><Boxes /></span><div><small>{item.unit}</small><h3>{item.name}</h3><strong>{item.currentStock}</strong><p>Minimum {item.minimumStock}</p></div>{item.currentStock <= item.minimumStock ? <Status tone="warn">Menipis</Status> : <Status tone="good">Aman</Status>}</article></Link>)}</section></>; }

function Manifest({ data }: { data: Context }) { const genders = ["Laki-laki", "Perempuan"] as const; return <><AdminPageHeader eyebrow="KELOMPOK KEBERANGKATAN" title="Manifest & Room List" description="Susun kamar Quad, Triple, atau Double. Jamaah laki-laki dan perempuan selalu dipisahkan." action={data.registrations.length ? { href: "/admin/manajemen/manifest-room-list/baru", label: "Atur Room List" } : undefined} />{genders.map((gender) => { const rows = data.registrations.filter((item) => item.pilgrim?.gender === gender); return <section className="management-panel" key={gender}><header><div><small>ROOM LIST {gender.toUpperCase()}</small><h2>Jamaah {gender}</h2></div><Status>{rows.length} orang</Status></header>{rows.length ? <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Jamaah</th><th>Paket</th><th>Paspor</th><th>Tipe kamar</th><th>Nomor kamar</th><th>Aksi</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id}><td><strong>{item.pilgrim?.fullName}</strong></td><td>{item.package?.name}</td><td>{item.pilgrim?.passportNumber || "Belum diisi"}</td><td>{item.roomType ? item.roomType.charAt(0).toUpperCase() + item.roomType.slice(1) : "Belum diatur"}</td><td>{item.roomNumber || "—"}</td><td><Link className="management-row-link" href={`/admin/manajemen/manifest-room-list/${item.id}`}>Atur kamar</Link></td></tr>)}</tbody></table></div> : <Empty>Belum ada jamaah {gender.toLowerCase()}.</Empty>}</section>; })}{data.registrations.some((item) => !item.pilgrim?.gender) ? <div className="management-warning"><AlertTriangle /><span>{data.registrations.filter((item) => !item.pilgrim?.gender).length} jamaah belum memiliki jenis kelamin dan belum bisa dimasukkan ke Room List.</span></div> : null}</>; }

function Invoices({ data }: { data: Context }) { const invoices = data.documents.filter((item) => item.kind === "invoice").length; const receipts = data.documents.filter((item) => item.kind === "receipt").length; return <><AdminPageHeader eyebrow="DOKUMEN TRANSAKSI" title="Invoice & kwitansi" description="Invoice untuk menagih pembayaran. Kwitansi dibuat otomatis setelah pembayaran diterima." action={{ href: "/admin/manajemen/invoice-kwitansi/baru", label: "Buat invoice" }} /><section className="management-document-history"><header><div><small>HISTORI DOKUMEN</small><h2>Dokumen yang sudah diterbitkan</h2><p>Klik satu dokumen untuk melihat preview, download, atau mencetak ulang.</p></div><dl><div><dt>Invoice</dt><dd>{invoices}</dd></div><div><dt>Kwitansi</dt><dd>{receipts}</dd></div></dl></header>{data.documents.length ? <div className="management-table-wrap"><table className="management-table management-document-table"><thead><tr><th>Dokumen</th><th>Customer / transaksi</th><th>Tanggal terbit</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{data.documents.map((item) => { const booking = data.bookings.find((row) => row.id === item.bookingId); const Icon = item.kind === "invoice" ? FileText : ReceiptText; return <tr key={item.id}><td><Link className="management-document-identity" href={`/admin/manajemen/invoice-kwitansi/${item.id}`}><span><Icon /></span><span><strong>{item.number}</strong><small>{item.kind === "invoice" ? "Invoice" : "Kwitansi"}</small></span></Link></td><td data-label="Customer"><span><strong>{booking?.payerName ?? "Pembayar tidak ditemukan"}</strong><small>{booking?.bookingNumber ?? "Transaksi lama"}</small></span></td><td data-label="Tanggal terbit"><DateText value={item.issuedAt} /></td><td data-label="Status"><Status tone={item.status === "issued" ? "good" : "bad"}>{item.status === "issued" ? "Terbit" : "Dibatalkan"}</Status></td><td data-label="Tindakan"><div className="admin-table-actions"><Link className="management-row-link" href={`/admin/manajemen/invoice-kwitansi/${item.id}`}>Buka dokumen</Link><DeleteButton id={item.id} name={item.number} type="document" documentKind={item.kind} /></div></td></tr>; })}</tbody></table></div> : <Empty>Belum ada dokumen. Buat invoice pertama untuk memulai.</Empty>}</section></>; }

function Reports({ data }: { data: Context }) {
  const realizedIncome = data.cashTransactions.filter((item) => item.isIncludedInReports !== false && item.direction === "in" && !item.isReversal).reduce((sum, item) => sum + item.amount, 0);
  const realizedExpense = data.cashTransactions.filter((item) => item.isIncludedInReports !== false && item.direction === "out" && !item.isReversal).reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      <AdminPageHeader
        eyebrow="REKAP BISNIS & OPERASIONAL"
        title="Pusat Laporan & Rekap"
        description="Pantau rekap data per jadwal keberangkatan, kas masuk/keluar aktual, piutang jamaah, dan laba paket."
      />
      <section className="management-kpis reports">
        <article>
          <small>Pemasukan aktual</small>
          <strong>{rupiah(realizedIncome)}</strong>
        </article>
        <article>
          <small>Pengeluaran aktual</small>
          <strong>{rupiah(realizedExpense)}</strong>
        </article>
        <article>
          <small>Selisih kas</small>
          <strong>{rupiah(realizedIncome - realizedExpense)}</strong>
        </article>
        <article>
          <small>Total Piutang Jamaah</small>
          <strong>{rupiah(data.dashboard.receivables)}</strong>
        </article>
      </section>

      {/* REKAP PER JADWAL KEBERANGKATAN */}
      <section className="management-panel">
        <header>
          <div>
            <small>OPERASIONAL KEBERANGKATAN</small>
            <h2>Rekap Data per Jadwal Keberangkatan</h2>
            <p>Rincian jamaah, penerimaan biaya, sisa piutang, dan estimasi laba per jadwal keberangkatan.</p>
          </div>
        </header>
        <div className="management-table-wrap">
          <table className="management-table">
            <thead>
              <tr>
                <th>Jadwal & Paket</th>
                <th>Maskapai</th>
                <th>Jamaah</th>
                <th>Total Biaya Paket</th>
                <th>Sudah Dibayar</th>
                <th>Sisa Piutang</th>
                <th>Laba Realisasi</th>
                <th>Unduh Rekap</th>
              </tr>
            </thead>
            <tbody>
              {data.departureReports.map((item) => (
                <tr key={item.departureId}>
                  <td>
                    <strong>{item.dateLabel}</strong>
                    <small style={{ display: "block", color: "#65758a" }}>{item.packageName}</small>
                  </td>
                  <td>{item.airline}</td>
                  <td>
                    <Status tone={item.totalPilgrims > 0 ? "good" : "neutral"}>
                      {item.totalPilgrims} Jamaah
                    </Status>
                  </td>
                  <td>{rupiah(item.totalAgreedPrice)}</td>
                  <td style={{ color: "#166534", fontWeight: "700" }}>{rupiah(item.totalPaid)}</td>
                  <td style={{ color: item.totalReceivables > 0 ? "#991b1b" : "#6b7280", fontWeight: "700" }}>
                    {rupiah(item.totalReceivables)}
                  </td>
                  <td>
                    <strong>{rupiah(item.realizedProfit)}</strong>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <a
                        href={`/api/admin/management/reports/keberangkatan?format=xlsx&departureId=${item.departureId}`}
                        style={{ padding: "4px 8px", fontSize: "11px", fontWeight: "700", border: "1px solid #c8b482", borderRadius: "6px", color: "#8b660c", textDecoration: "none" }}
                      >
                        Excel
                      </a>
                      <a
                        href={`/api/admin/management/reports/keberangkatan?format=pdf&departureId=${item.departureId}`}
                        style={{ padding: "4px 8px", fontSize: "11px", fontWeight: "700", border: "1px solid #c8b482", borderRadius: "6px", color: "#8b660c", textDecoration: "none" }}
                      >
                        PDF
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* LABA PER PAKET */}
      <section className="management-panel">
        <header>
          <div>
            <small>LABA REALISASI</small>
            <h2>Laba per paket</h2>
          </div>
        </header>
        <div className="management-table-wrap">
          <table className="management-table">
            <thead>
              <tr>
                <th>Paket</th>
                <th>Pemasukan</th>
                <th>Refund</th>
                <th>Biaya</th>
                <th>Komisi dibayar</th>
                <th>Laba</th>
                <th>Piutang</th>
              </tr>
            </thead>
            <tbody>
              {data.packageFinancials.map((item) => (
                <tr key={item.packageId}>
                  <td><strong>{item.packageName}</strong></td>
                  <td>{rupiah(item.income)}</td>
                  <td>{rupiah(item.refunded)}</td>
                  <td>{rupiah(item.expenses)}</td>
                  <td>{rupiah(item.commissions)}</td>
                  <td><strong>{rupiah(item.realizedProfit)}</strong></td>
                  <td>{rupiah(item.receivables)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* KELOLA PENGECUALIAN DATA LAPORAN (DATA TESTING) */}
      <section className="management-panel">
        <header>
          <div>
            <small>DATA TESTING & FILTER LAPORAN</small>
            <h2>Kelola Transaksi Laporan (Kecualikan Data Testing)</h2>
            <p>
              Kecualikan transaksi percobaan/testing langsung dari Pusat Laporan tanpa perlu menghapus riwayatnya. Data yang dikecualikan tidak akan mempengaruhi saldo kas, penerimaan, dan piutang.
            </p>
          </div>
        </header>

        <div style={{ display: "grid", gap: "20px" }}>
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
              Transaksi Pembayaran Jamaah ({data.payments.length})
            </h3>
            {data.payments.length ? (
              <div className="management-table-wrap">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Booking & Pembayar</th>
                      <th>Nominal</th>
                      <th>Status Laporan</th>
                      <th>Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payments.slice(0, 50).map((item) => {
                      const isIncluded = item.isIncludedInReports !== false;
                      return (
                        <tr key={item.id}>
                          <td><DateText value={item.paidAt} /></td>
                          <td>
                            <strong>{item.booking?.bookingNumber ?? "—"}</strong>
                            <small>{item.booking?.payerName} · {item.method}</small>
                          </td>
                          <td><strong>{rupiah(item.amount)}</strong></td>
                          <td>
                            <Status tone={isIncluded ? "good" : "neutral"}>
                              {isIncluded ? "Masuk Laporan" : "Dikecualikan (Testing)"}
                            </Status>
                          </td>
                          <td>
                            <ReportInclusionToggleForm entity="payment" id={item.id} isIncluded={isIncluded} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty>Belum ada data pembayaran.</Empty>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
              Transaksi Kas Masuk / Keluar Mandiri ({data.cashTransactions.filter((c) => !c.paymentId).length})
            </h3>
            {data.cashTransactions.filter((c) => !c.paymentId).length ? (
              <div className="management-table-wrap">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Keterangan</th>
                      <th>Jenis & Nominal</th>
                      <th>Status Laporan</th>
                      <th>Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cashTransactions
                      .filter((c) => !c.paymentId)
                      .slice(0, 50)
                      .map((item) => {
                        const isIncluded = (item as any).isIncludedInReports !== false;
                        return (
                          <tr key={item.id}>
                            <td><DateText value={item.transactionAt} /></td>
                            <td><strong>{item.description}</strong></td>
                            <td>
                              <span style={{ fontWeight: 600, color: item.direction === "in" ? "#166534" : "#991b1b" }}>
                                {item.direction === "in" ? "+ " : "- "}{rupiah(item.amount)}
                              </span>
                            </td>
                            <td>
                              <Status tone={isIncluded ? "good" : "neutral"}>
                                {isIncluded ? "Masuk Laporan" : "Dikecualikan (Testing)"}
                              </Status>
                            </td>
                            <td>
                              <ReportInclusionToggleForm entity="cash_transaction" id={item.id} isIncluded={isIncluded} />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty>Belum ada data transaksi kas non-pembayaran.</Empty>
            )}
          </div>
        </div>
      </section>

      {/* UNDUH LAPORAN */}
      <section className="management-panel">
        <header>
          <div>
            <small>DOWNLOAD & EKSPOR</small>
            <h2>Laporan berdasarkan periode & filter</h2>
            <p>Pilih periode tanggal, paket, atau jadwal keberangkatan, lalu unduh dokumen Excel atau PDF.</p>
          </div>
        </header>
        <ReportDownloadFilters
          packages={data.packages.map(({ id, name }) => ({ id, name }))}
          departures={data.departures.map((d) => ({
            id: d.id,
            departureDate: d.departureDate,
            dateLabel: d.dateLabel,
            packageId: d.packageId,
            packageName: d.package?.name,
          }))}
        />
      </section>
    </>
  );
}


function Settings({ data }: { data: Context }) { return <><AdminPageHeader eyebrow="PENGATURAN" title="Pengaturan internal" description="Atur nilai default, identitas, dan template pesan yang dipakai sistem." /><section className="management-panel"><header><div><small>IDENTITAS & TRANSAKSI</small><h2>Pengaturan utama</h2></div></header><ManagementSettingsForm values={data.settings ? { companyName: data.settings.companyName, companyAddress: data.settings.companyAddress, companyPhone: data.settings.companyPhone, companyEmail: data.settings.companyEmail, defaultDpAmount: data.settings.defaultDpAmount, paymentDueDays: data.settings.paymentDueDays, financeSignerName: data.settings.financeSignerName, financeSignerTitle: data.settings.financeSignerTitle, birthdayMessageTemplate: data.settings.birthdayMessageTemplate } : null} /></section><section className="management-panel"><header><div><small>IMPORT DATA LAMA</small><h2>Import CSV tervalidasi</h2></div></header><CsvImportForm /></section><section className="management-panel"><header><div><small>REKENING</small><h2>Rekening & kas aktif</h2></div></header><div className="management-mini-list">{data.accounts.map((account) => <div key={account.id}><span><strong>{account.name}</strong><small>{account.bankName || "Kas tunai"} · {account.accountNumber || "Tanpa nomor"}</small></span><Status tone={account.showOnInvoice ? "good" : "neutral"}>{account.showOnInvoice ? "Tampil di invoice" : "Internal"}</Status></div>)}</div></section></>; }

export function ManagementWorkspace({ module, data }: { module?: string; data: Context }) {
  if (!module) return <Overview data={data} />;
  if (module === "jamaah") return <Pilgrims data={data} />;
  if (module === "keberangkatan") return <Departures data={data} />;
  if (module === "pembayaran") return <Payments data={data} />;
  if (module === "keuangan") return <Finance data={data} />;
  if (module === "agen-referral") return <Agents data={data} />;
  if (module === "stok") return <Stock data={data} />;
  if (module === "manifest-room-list") return <RoomListWorkspace data={data} />;
  if (module === "invoice-kwitansi") return <Invoices data={data} />;
  if (module === "laporan") return <Reports data={data} />;
  if (module === "pengaturan") return <Settings data={data} />;
  return <Overview data={data} />;
}

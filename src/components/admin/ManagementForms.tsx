"use client";

import { useActionState, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { CheckCircle2, CircleAlert, Sparkles } from "lucide-react";

import {
  createAccountAction,
  assignRoomAction,
  createAgentAction,
  createBookingAction,
  createPilgrimAction,
  recordCashAction,
  recordPaymentAction,
  recordRefundAction,
  recordStockMovementAction,
  payCommissionAction,
  saveSequenceAction,
  saveManagementSettingsAction,
  saveInventoryItemAction,
  seedManagementDefaultsAction,
  setManagementRecordStatusAction,
  updateAccountAction,
  updateAgentAction,
  updatePilgrimAction,
} from "@/lib/management/actions";
import { rupiah } from "@/lib/management/domain";
import type { ManagementActionState } from "@/lib/management/validation";

const managementInitialState: ManagementActionState = { ok: false, message: "" };

function Feedback({ state }: { state: ManagementActionState }) {
  if (!state.message) return null;
  return <div className={`management-feedback ${state.ok ? "success" : "error"}`} role="status">{state.ok ? <CheckCircle2 /> : <CircleAlert />}<span>{state.message}</span></div>;
}

function ErrorText({ state, name }: { state: ManagementActionState; name: string }) {
  const message = state.errors?.[name]?.[0];
  return message ? <small className="management-field-error">{message}</small> : null;
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return <button className="management-primary-button" type="submit">{children}</button>;
}

export function InitializeManagementButton() {
  const [state, action, pending] = useActionState(async () => seedManagementDefaultsAction(), managementInitialState);
  return <form action={action} className="management-inline-action"><Feedback state={state} /><button disabled={pending} className="management-primary-button" type="submit"><Sparkles />{pending ? "Menyiapkan…" : "Siapkan data awal"}</button></form>;
}

type PilgrimValues = { id: string; fullName: string; whatsapp: string; email: string | null; gender: string | null; birthDate: string | null; nationality: string; passportNumber: string | null; passportExpiry: string | null; notes: string | null };

export function PilgrimForm({ values }: { values?: PilgrimValues }) {
  const [state, action, pending] = useActionState(values ? updatePilgrimAction : createPilgrimAction, managementInitialState);
  const [form, setForm] = useState({ fullName: values?.fullName ?? "", whatsapp: values?.whatsapp ?? "", email: values?.email ?? "", gender: values?.gender ?? "", birthDate: values?.birthDate ?? "", nationality: values?.nationality ?? "Indonesia", passportNumber: values?.passportNumber ?? "", passportExpiry: values?.passportExpiry ?? "", notes: values?.notes ?? "" });
  const change = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  return <form action={action} className="management-form">{values ? <input type="hidden" name="id" value={values.id} /> : null}
    <Feedback state={state} />
    <div className="management-form-grid two">
      <label><span>Nama lengkap *</span><input name="fullName" autoComplete="name" value={form.fullName} onChange={change} required /><ErrorText state={state} name="fullName" /></label>
      <label><span>Nomor WhatsApp *</span><input name="whatsapp" inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" value={form.whatsapp} onChange={change} required /><ErrorText state={state} name="whatsapp" /></label>
      <label><span>Email <i>opsional</i></span><input name="email" type="email" autoComplete="email" value={form.email} onChange={change} /><ErrorText state={state} name="email" /></label>
      <label><span>Jenis kelamin</span><select name="gender" value={form.gender} onChange={change}><option value="">Belum diisi</option><option>Laki-laki</option><option>Perempuan</option></select></label>
      <label><span>Tanggal lahir</span><input name="birthDate" type="date" value={form.birthDate} onChange={change} /></label>
      <label><span>Kewarganegaraan</span><input name="nationality" value={form.nationality} onChange={change} /></label>
      <label><span>Nomor paspor</span><input name="passportNumber" value={form.passportNumber} onChange={change} /></label>
      <label><span>Masa berlaku paspor</span><input name="passportExpiry" type="date" value={form.passportExpiry} onChange={change} /></label>
    </div>
    <label><span>Catatan</span><textarea name="notes" rows={3} value={form.notes} onChange={change} /></label>
    <SubmitButton>{pending ? "Menyimpan…" : values ? "Simpan perubahan" : "Simpan jamaah"}</SubmitButton>
  </form>;
}

type AgentValues = { id: string; name: string; whatsapp: string; email: string | null; referralCode: string; defaultCommission: number };

export function AgentForm({ values }: { values?: AgentValues }) {
  const [state, action, pending] = useActionState(values ? updateAgentAction : createAgentAction, managementInitialState);
  return <form action={action} className="management-form">{values ? <input type="hidden" name="id" value={values.id} /> : null}<Feedback state={state} />
    <div className="management-form-grid two">
      <label><span>Nama agen *</span><input name="name" defaultValue={values?.name} required /><ErrorText state={state} name="name" /></label>
      <label><span>WhatsApp *</span><input name="whatsapp" inputMode="tel" defaultValue={values?.whatsapp} required /><ErrorText state={state} name="whatsapp" /></label>
      <label><span>Email <i>opsional</i></span><input name="email" type="email" defaultValue={values?.email ?? ""} /><ErrorText state={state} name="email" /></label>
      <label><span>Kode link referral *</span><input name="referralCode" placeholder="nama-agen" defaultValue={values?.referralCode} required /><ErrorText state={state} name="referralCode" /></label>
      <label><span>Komisi default</span><select name="defaultCommission" defaultValue={String(values?.defaultCommission ?? 500000)}><option value="500000">Rp500.000 / jamaah</option><option value="1000000">Rp1.000.000 / jamaah</option></select></label>
    </div>
    <SubmitButton>{pending ? "Menyimpan…" : values ? "Simpan perubahan" : "Simpan agen"}</SubmitButton>
  </form>;
}

type BookingFormProps = {
  pilgrims: Array<{ id: string; fullName: string; whatsapp: string }>;
  departures: Array<{ id: string; departureDate: string; price: string; package?: { name: string } }>;
  agents: Array<{ id: string; name: string; defaultCommission: number }>;
};

export function BookingForm({ pilgrims, departures, agents }: BookingFormProps) {
  const [state, action, pending] = useActionState(createBookingAction, managementInitialState);
  const [departureId, setDepartureId] = useState(departures[0]?.id ?? "");
  const selectedDeparture = departures.find((item) => item.id === departureId);
  return <form action={action} className="management-form"><Feedback state={state} />
    <div className="management-form-grid two">
      <label><span>Paket keberangkatan *</span><select name="departureId" value={departureId} onChange={(event) => setDepartureId(event.target.value)} required><option value="">Pilih paket</option>{departures.map((item) => <option key={item.id} value={item.id}>{item.package?.name} — {item.departureDate}</option>)}</select></label>
      <label><span>Harga per jamaah *</span><input name="agreedPrice" inputMode="numeric" defaultValue={selectedDeparture ? Number(selectedDeparture.price) : ""} key={departureId} required /></label>
      <label><span>Nama pembayar *</span><input name="payerName" required /></label>
      <label><span>WhatsApp pembayar *</span><input name="payerWhatsapp" inputMode="tel" required /></label>
      <label><span>Email pembayar</span><input name="payerEmail" type="email" /></label>
      <label><span>Diskon per jamaah</span><input name="discountAmount" inputMode="numeric" defaultValue="0" /></label>
      <label><span>Agen <i>opsional</i></span><select name="agentId" defaultValue=""><option value="">Tanpa agen</option>{agents.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
      <label><span>Komisi per jamaah</span><select name="commissionAmount" defaultValue="500000"><option value="0">Tanpa komisi</option><option value="500000">Rp500.000</option><option value="1000000">Rp1.000.000</option></select></label>
    </div>
    <fieldset className="management-choice-list"><legend>Pilih jamaah *</legend>{pilgrims.length ? pilgrims.map((item) => <label key={item.id}><input type="checkbox" name="pilgrimIds" value={item.id} /><span><strong>{item.fullName}</strong><small>{item.whatsapp}</small></span></label>) : <p>Tambahkan data jamaah terlebih dahulu.</p>}<ErrorText state={state} name="pilgrimIds" /></fieldset>
    <SubmitButton>{pending ? "Menyimpan…" : "Buat pendaftaran"}</SubmitButton>
  </form>;
}

type PaymentBooking = { id: string; bookingNumber: string; payerName: string; registrations: Array<{ id: string; agreedPrice: number; payment: { outstanding: number }; pilgrim?: { fullName: string } }> };

export function PaymentForm({ bookings, accounts }: { bookings: PaymentBooking[]; accounts: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(recordPaymentAction, managementInitialState);
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [allocations, setAllocations] = useState<Record<string, string>>({});
  const [localNow] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  const booking = bookings.find((item) => item.id === bookingId);
  const serialized = useMemo(() => JSON.stringify(Object.entries(allocations).filter(([, value]) => Number(value) > 0).map(([registrationId, value]) => ({ registrationId, amount: Number(value) }))), [allocations]);
  function autoAllocate() {
    let remaining = Number(amount) || 0;
    const next: Record<string, string> = {};
    for (const registration of booking?.registrations ?? []) {
      const value = Math.min(remaining, registration.payment.outstanding);
      if (value > 0) next[registration.id] = String(value);
      remaining -= value;
    }
    setAllocations(next);
  }
  return <form action={action} className="management-form"><Feedback state={state} /><input type="hidden" name="allocations" value={serialized} />
    <div className="management-form-grid two">
      <label><span>Booking *</span><select name="bookingId" value={bookingId} onChange={(event) => { setBookingId(event.target.value); setAllocations({}); }} required>{bookings.map((item) => <option value={item.id} key={item.id}>{item.bookingNumber} — {item.payerName}</option>)}</select></label>
      <label><span>Masuk ke rekening/kas *</span><select name="accountId" required><option value="">Pilih rekening</option>{accounts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label><span>Tanggal pembayaran *</span><input name="paidAt" type="datetime-local" defaultValue={localNow} required /></label>
      <label><span>Metode</span><select name="method" defaultValue="transfer"><option value="transfer">Transfer</option><option value="cash">Tunai</option><option value="card">Kartu</option><option value="other">Lainnya</option></select></label>
      <label><span>Nominal pembayaran *</span><input name="amount" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} required /></label>
      <label><span>Referensi <i>opsional</i></span><input name="reference" placeholder="Nomor transfer" /></label>
    </div>
    <div className="management-allocation"><div><strong>Alokasi per jamaah</strong><button type="button" onClick={autoAllocate}>Alokasikan otomatis</button></div>{booking?.registrations.map((registration) => <label key={registration.id}><span><strong>{registration.pilgrim?.fullName}</strong><small>Sisa {rupiah(registration.payment.outstanding)}</small></span><input aria-label={`Alokasi ${registration.pilgrim?.fullName}`} inputMode="numeric" value={allocations[registration.id] ?? ""} onChange={(event) => setAllocations((current) => ({ ...current, [registration.id]: event.target.value.replace(/\D/g, "") }))} /></label>)}</div>
    <label><span>Catatan</span><textarea name="note" rows={2} /></label>
    <SubmitButton>{pending ? "Mencatat…" : "Catat pembayaran"}</SubmitButton>
  </form>;
}

export function CashForm({ accounts, packages, categories }: { accounts: Array<{ id: string; name: string }>; packages: Array<{ id: string; name: string }>; categories: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(recordCashAction, managementInitialState);
  const [localNow] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  return <form action={action} className="management-form"><Feedback state={state} /><div className="management-form-grid two">
    <label><span>Jenis transaksi</span><select name="direction"><option value="in">Kas masuk</option><option value="out">Kas keluar</option><option value="transfer">Transfer internal</option></select></label>
    <label><span>Rekening/kas asal *</span><select name="accountId" required><option value="">Pilih akun</option>{accounts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label><span>Rekening tujuan <i>untuk transfer</i></span><select name="destinationAccountId"><option value="">Tidak ada</option>{accounts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label><span>Nominal *</span><input name="amount" inputMode="numeric" required /></label>
    <label><span>Tanggal *</span><input name="transactionAt" type="datetime-local" defaultValue={localNow} required /></label>
    <label><span>Paket <i>opsional</i></span><select name="packageId"><option value="">Umum</option>{packages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label><span>Kategori biaya</span><select name="categoryId"><option value="">Tanpa kategori</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label><span>Keterangan *</span><input name="description" required /></label>
  </div><SubmitButton>{pending ? "Mencatat…" : "Simpan transaksi"}</SubmitButton></form>;
}

export function StockForm({ items }: { items: Array<{ id: string; name: string; currentStock: number }> }) {
  const [state, action, pending] = useActionState(recordStockMovementAction, managementInitialState);
  const [localNow] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  return <form action={action} className="management-form"><Feedback state={state} /><div className="management-form-grid two">
    <label><span>Barang *</span><select name="itemId" required>{items.map((item) => <option value={item.id} key={item.id}>{item.name} — tersedia {item.currentStock}</option>)}</select></label>
    <label><span>Pergerakan</span><select name="kind"><option value="in">Stok masuk</option><option value="out">Stok keluar</option><option value="adjustment">Sesuaikan saldo menjadi</option></select></label>
    <label><span>Jumlah *</span><input name="quantity" type="number" min="0" required /></label>
    <label><span>Tanggal *</span><input name="movedAt" type="datetime-local" defaultValue={localNow} required /></label>
    <label className="span-two"><span>Catatan</span><input name="note" /></label>
  </div><SubmitButton>{pending ? "Menyimpan…" : "Perbarui stok"}</SubmitButton></form>;
}

type AccountValues = { id: string; name: string; type: string; bankName: string | null; accountNumber: string | null; accountHolder: string | null; showOnInvoice: boolean };

export function AccountForm({ values }: { values?: AccountValues }) {
  const [state, action, pending] = useActionState(values ? updateAccountAction : createAccountAction, managementInitialState);
  return <form action={action} className="management-form">{values ? <input type="hidden" name="id" value={values.id} /> : null}<Feedback state={state} /><div className="management-form-grid two">
    <label><span>Nama rekening/kas *</span><input name="name" defaultValue={values?.name} required /></label><label><span>Jenis</span><select name="type" defaultValue={values?.type ?? "bank"}><option value="bank">Rekening bank</option><option value="cash">Kas tunai</option></select></label>
    <label><span>Nama bank</span><input name="bankName" defaultValue={values?.bankName ?? ""} /></label><label><span>Nomor rekening</span><input name="accountNumber" defaultValue={values?.accountNumber ?? ""} /></label><label><span>Atas nama</span><input name="accountHolder" defaultValue={values?.accountHolder ?? ""} /></label>
    <label className="management-check"><input type="checkbox" name="showOnInvoice" defaultChecked={values?.showOnInvoice} /><span>Tampilkan pada invoice</span></label>
  </div><SubmitButton>{pending ? "Menyimpan…" : values ? "Simpan perubahan" : "Tambah rekening/kas"}</SubmitButton></form>;
}

export function InventoryItemForm({ values }: { values?: { id: string; name: string; unit: string; minimumStock: number } }) {
  const [state, action, pending] = useActionState(saveInventoryItemAction, managementInitialState);
  return <form action={action} className="management-form">{values ? <input type="hidden" name="id" value={values.id} /> : null}<Feedback state={state} /><div className="management-form-grid two">
    <label><span>Nama barang *</span><input name="name" defaultValue={values?.name} required /></label>
    <label><span>Satuan *</span><input name="unit" defaultValue={values?.unit ?? "pcs"} required /></label>
    <label><span>Batas stok minimum *</span><input name="minimumStock" type="number" min="0" defaultValue={values?.minimumStock ?? 5} required /></label>
  </div><SubmitButton>{pending ? "Menyimpan…" : values ? "Simpan perubahan" : "Tambah barang"}</SubmitButton></form>;
}

export function RecordStatusForm({ entity, id, status }: { entity: "pilgrim" | "agent" | "account" | "inventory"; id: string; status: "active" | "archived" }) {
  const [state, action, pending] = useActionState(setManagementRecordStatusAction, managementInitialState);
  const next = status === "active" ? "archived" : "active";
  return <form action={action} className="management-status-form"><input type="hidden" name="entity" value={entity} /><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={next} /><Feedback state={state} /><button type="submit" disabled={pending}>{pending ? "Memproses…" : status === "active" ? "Arsipkan data" : "Aktifkan kembali"}</button></form>;
}

export function SequenceForm({ kind }: { kind: "invoice" | "receipt" }) {
  const [state, action, pending] = useActionState(saveSequenceAction, managementInitialState);
  return <form action={action} className="management-form compact"><Feedback state={state} /><input type="hidden" name="kind" value={kind} /><div className="management-form-grid two">
    <label><span>Format nomor *</span><input name="pattern" defaultValue={kind === "invoice" ? "{seq}/Jamw/{MM}{YY}" : "{seq}{DD}{MM}{YY}"} required /><small>Token: {'{seq}'}, {'{DD}'}, {'{MM}'}, {'{YY}'}, {'{YYYY}'}</small></label>
    <label><span>Nomor berikutnya *</span><input name="nextNumber" type="number" min="1" defaultValue="1" required /></label>
    <label><span>Jumlah digit urutan</span><input name="padding" type="number" min="1" max="12" defaultValue={kind === "invoice" ? 4 : 6} /></label>
    <label><span>Mulai ulang urutan</span><select name="reset"><option value="never">Tidak pernah</option><option value="monthly">Setiap bulan</option><option value="yearly">Setiap tahun</option></select></label>
  </div><SubmitButton>{pending ? "Mengaktifkan…" : `Aktifkan format ${kind === "invoice" ? "invoice" : "kwitansi"}`}</SubmitButton></form>;
}

export function RefundForm({ payments, accounts }: { payments: Array<{ id: string; amount: number; bookingNumber: string; allocations: Array<{ registrationId: string; amount: number; pilgrimName: string }> }>; accounts: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(recordRefundAction, managementInitialState);
  const [paymentId, setPaymentId] = useState(payments[0]?.id ?? "");
  const selected = payments.find((item) => item.id === paymentId);
  return <form action={action} className="management-form"><Feedback state={state} /><div className="management-form-grid two"><label><span>Pembayaran *</span><select name="paymentId" value={paymentId} onChange={(event) => setPaymentId(event.target.value)}>{payments.map((item) => <option key={item.id} value={item.id}>{item.bookingNumber} · {rupiah(item.amount)}</option>)}</select></label><label><span>Jamaah *</span><select name="registrationId">{selected?.allocations.map((item) => <option key={item.registrationId} value={item.registrationId}>{item.pilgrimName} · alokasi {rupiah(item.amount)}</option>)}</select></label><label><span>Dibayar dari rekening *</span><select name="accountId"><option value="">Pilih rekening</option>{accounts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><span>Nominal refund *</span><input name="amount" inputMode="numeric" required /></label><label className="span-two"><span>Alasan refund *</span><input name="reason" required /></label></div><SubmitButton>{pending ? "Memproses…" : "Catat refund"}</SubmitButton></form>;
}

export function CommissionPayoutForm({ commissions, accounts }: { commissions: Array<{ id: string; agentName: string; pilgrimName: string; amount: number }>; accounts: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(payCommissionAction, managementInitialState);
  return <form action={action} className="management-form"><Feedback state={state} /><div className="management-form-grid two"><label><span>Komisi siap dibayar *</span><select name="commissionId">{commissions.map((item) => <option key={item.id} value={item.id}>{item.agentName} · {item.pilgrimName} · {rupiah(item.amount)}</option>)}</select></label><label><span>Dibayar dari *</span><select name="accountId"><option value="">Pilih rekening</option>{accounts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div><SubmitButton>{pending ? "Memproses…" : "Tandai komisi dibayar"}</SubmitButton></form>;
}

export function ManagementSettingsForm({ values }: { values: { companyName: string; companyAddress: string; companyPhone: string; companyEmail: string; defaultDpAmount: number; paymentDueDays: number; financeSignerName: string; financeSignerTitle: string } | null }) {
  const [state, action, pending] = useActionState(saveManagementSettingsAction, managementInitialState);
  return <form action={action} className="management-form"><Feedback state={state} /><div className="management-form-grid two"><label><span>Nama perusahaan *</span><input name="companyName" defaultValue={values?.companyName ?? "Jam Wisata"} required /></label><label><span>Nomor WhatsApp/telepon</span><input name="companyPhone" defaultValue={values?.companyPhone ?? ""} /></label><label><span>Email perusahaan</span><input name="companyEmail" type="email" defaultValue={values?.companyEmail ?? ""} /></label><label><span>Default DP per jamaah *</span><input name="defaultDpAmount" inputMode="numeric" defaultValue={values?.defaultDpAmount ?? 5000000} required /></label><label><span>Pelunasan maksimal H-</span><input name="paymentDueDays" type="number" min="1" max="180" defaultValue={values?.paymentDueDays ?? 30} required /></label><label><span>Nama penandatangan</span><input name="financeSignerName" defaultValue={values?.financeSignerName ?? ""} /></label><label><span>Jabatan penandatangan</span><input name="financeSignerTitle" defaultValue={values?.financeSignerTitle ?? "Keuangan"} /></label><label className="span-two"><span>Alamat perusahaan</span><textarea name="companyAddress" defaultValue={values?.companyAddress ?? ""} rows={3} /></label></div><SubmitButton>{pending ? "Menyimpan…" : "Simpan pengaturan"}</SubmitButton></form>;
}

export function RoomListForm({ registrations }: { registrations: Array<{ id: string; pilgrimName: string; gender: string | null; packageName: string }> }) {
  const [state, action, pending] = useActionState(assignRoomAction, managementInitialState);
  return <form action={action} className="management-form"><Feedback state={state} /><div className="management-form-grid two"><label><span>Jamaah *</span><select name="registrationId">{registrations.map((item) => <option key={item.id} value={item.id}>{item.pilgrimName} · {item.gender || "jenis kelamin belum diisi"} · {item.packageName}</option>)}</select></label><label><span>Tipe kamar *</span><select name="roomType"><option value="quad">Quad · 4 orang</option><option value="triple">Triple · 3 orang</option><option value="double">Double · 2 orang</option></select></label><label><span>Nomor/nama kamar *</span><input name="roomNumber" placeholder="Contoh: 301 atau Q-01" required /></label></div><p className="management-form-note">Sistem akan menolak kamar yang penuh atau mencampur jamaah laki-laki dan perempuan.</p><SubmitButton>{pending ? "Menyimpan…" : "Masukkan ke Room List"}</SubmitButton></form>;
}

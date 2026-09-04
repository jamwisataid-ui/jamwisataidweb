"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle2, CircleAlert, Eye, EyeOff, FileText, LoaderCircle, Sparkles, UsersRound, WalletCards } from "lucide-react";
import { toast } from "sonner";

import {
  createAccountAction,
  assignRoomAction,
  createAgentAction,
  createBookingAction,
  cancelBookingAction,
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
  toggleReportInclusionAction,
  updateAccountAction,
  updateAgentAction,
  updatePilgrimAction,
} from "@/lib/management/actions";
import { formatDocumentNumber, rupiah } from "@/lib/management/domain";
import type { ManagementActionState } from "@/lib/management/validation";

const managementInitialState: ManagementActionState = { ok: false, message: "" };

function Feedback({ state }: { state: ManagementActionState }) {
  const router = useRouter();
  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [router, state]);
  if (!state.message) return null;
  return <div className={`management-feedback ${state.ok ? "success" : "error"}`} role="status">{state.ok ? <CheckCircle2 /> : <CircleAlert />}<span>{state.message}</span></div>;
}

function ErrorText({ state, name }: { state: ManagementActionState; name: string }) {
  const message = state.errors?.[name]?.[0];
  return message ? <small className="management-field-error">{message}</small> : null;
}

function SubmitButton({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <button className="management-primary-button" type="submit" disabled={pending || disabled}>{pending ? <LoaderCircle className="spin" aria-hidden /> : null}{pending ? "Menyimpan…" : children}</button>;
}

export function InitializeManagementButton() {
  const [state, action, pending] = useActionState(async () => seedManagementDefaultsAction(), managementInitialState);
  return <form action={action} className="management-inline-action"><Feedback state={state} /><button disabled={pending} className="management-primary-button" type="submit">{pending ? <LoaderCircle className="spin" /> : <Sparkles />}{pending ? "Menyiapkan…" : "Siapkan data awal"}</button></form>;
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
  pilgrims: Array<{ id: string; fullName: string; whatsapp: string; email: string | null }>;
  departures: Array<{ id: string; departureDate: string; price: string; package?: { name: string } }>;
  agents: Array<{ id: string; name: string; defaultCommission: number }>;
  defaultDpAmount: number;
};

export function BookingForm({ pilgrims, departures, agents, defaultDpAmount }: BookingFormProps) {
  const [state, action, pending] = useActionState(createBookingAction, managementInitialState);
  const [departureId, setDepartureId] = useState("");
  const [agreedPrice, setAgreedPrice] = useState("");
  const [dpTarget, setDpTarget] = useState(String(defaultDpAmount));
  const [discountAmount, setDiscountAmount] = useState("0");
  const [agentId, setAgentId] = useState("");
  const [commissionAmount, setCommissionAmount] = useState("0");
  const [pilgrimIds, setPilgrimIds] = useState<string[]>([]);
  const [payerName, setPayerName] = useState("");
  const [payerWhatsapp, setPayerWhatsapp] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [pilgrimSearch, setPilgrimSearch] = useState("");
  const selectedDeparture = departures.find((item) => item.id === departureId);
  const selectedAgent = agents.find((item) => item.id === agentId);
  const finalPrice = Math.max(0, Number(agreedPrice || 0) - Number(discountAmount || 0));
  const totalBill = finalPrice * pilgrimIds.length;
  const filteredPilgrims = pilgrims.filter((item) => `${item.fullName} ${item.whatsapp}`.toLowerCase().includes(pilgrimSearch.toLowerCase().trim()));
  const priceReady = Boolean(departureId && Number(agreedPrice) > 0 && Number(dpTarget) > 0 && finalPrice > 0);
  const payerReady = payerName.trim().length >= 2 && payerWhatsapp.replace(/\D/g, "").length >= 8;
  const pilgrimsReady = pilgrimIds.length > 0;
  const formReady = priceReady && payerReady && pilgrimsReady;
  const missing = [!priceReady && "paket dan nominal", !payerReady && "data pembayar", !pilgrimsReady && "jamaah yang berangkat"].filter(Boolean).join(", ");
  function selectDeparture(value: string) {
    setDepartureId(value);
    const departure = departures.find((item) => item.id === value);
    setAgreedPrice(departure ? String(Number(departure.price)) : "");
  }
  function selectAgent(value: string) {
    setAgentId(value);
    const agent = agents.find((item) => item.id === value);
    setCommissionAmount(agent ? String(agent.defaultCommission) : "0");
  }
  function togglePilgrim(id: string, checked: boolean) {
    setPilgrimIds((current) => checked ? [...current, id] : current.filter((item) => item !== id));
  }
  function copyPayer(id: string) {
    const pilgrim = pilgrims.find((item) => item.id === id);
    if (!pilgrim) return;
    setPayerName(pilgrim.fullName);
    setPayerWhatsapp(pilgrim.whatsapp);
    setPayerEmail(pilgrim.email ?? "");
  }
  return <form action={action} className="management-form"><Feedback state={state} />
    <details className="management-booking-help" open>
      <summary><span><BookOpen /><span><strong>Cara Penggunaan — ikuti dari nomor 1 sampai 4</strong><small>Panduan ini terbuka otomatis. Klik di sini jika ingin menutupnya.</small></span></span><i>+</i></summary>
      <ol><li><strong>1. Pilih paket dan harga</strong><span>Harga masuk otomatis. Atur DP dan diskon bila ada.</span></li><li><strong>2. Isi orang yang membayar</strong><span>Bisa disalin dari data jamaah agar tidak perlu mengetik ulang.</span></li><li><strong>3. Pilih agen bila ada</strong><span>Jika bukan dari agen, biarkan “Tanpa agen”.</span></li><li><strong>4. Centang jamaah</strong><span>Periksa ringkasan, lalu tekan “Simpan pendaftaran”.</span></li></ol>
    </details>

    <section className="management-booking-step">
      <header><b>1</b><span><strong>Pilih paket & atur harga</strong><small>Semua nominal di bagian ini berlaku untuk satu jamaah.</small></span><em className={priceReady ? "complete" : "incomplete"}>{priceReady ? <CheckCircle2 /> : <CircleAlert />}{priceReady ? "Sudah lengkap" : "Belum lengkap"}</em></header>
      <div className="management-form-grid two">
        <label><span>Paket keberangkatan *</span><select name="departureId" value={departureId} onChange={(event) => selectDeparture(event.target.value)} required><option value="">Pilih paket keberangkatan</option>{departures.map((item) => <option key={item.id} value={item.id}>{item.package?.name} — {item.departureDate}</option>)}</select><small>Pilih jadwal yang akan diikuti oleh seluruh jamaah dalam pendaftaran ini.</small><ErrorText state={state} name="departureId" /></label>
        <label><span>Harga per jamaah *</span><input name="agreedPrice" inputMode="numeric" value={agreedPrice} onChange={(event) => setAgreedPrice(event.target.value.replace(/\D/g, ""))} placeholder="Pilih paket terlebih dahulu" required /><output className="management-money-readable">Terbaca: <strong>{rupiah(Number(agreedPrice || 0))}</strong></output><small>{selectedDeparture ? `Harga awal paket ${rupiah(Number(selectedDeparture.price))}. Ubah hanya jika ada harga khusus.` : "Harga otomatis terisi setelah paket dipilih."}</small><ErrorText state={state} name="agreedPrice" /></label>
        <label>
          <span>Target DP per jamaah *</span>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <button
              type="button"
              onClick={() => setDpTarget(String(defaultDpAmount || 5000000))}
              className="management-row-link"
              style={{ padding: "4px 10px", borderRadius: "6px", cursor: "pointer", background: dpTarget === String(defaultDpAmount || 5000000) ? "#142a45" : "#f1ede4", color: dpTarget === String(defaultDpAmount || 5000000) ? "#fff" : "#3b4758", border: "1px solid #dcd5c7" }}
            >
              Default Rp5 Juta
            </button>
            <button
              type="button"
              onClick={() => setDpTarget("")}
              className="management-row-link"
              style={{ padding: "4px 10px", borderRadius: "6px", cursor: "pointer", background: dpTarget !== String(defaultDpAmount || 5000000) ? "#142a45" : "#f1ede4", color: dpTarget !== String(defaultDpAmount || 5000000) ? "#fff" : "#3b4758", border: "1px solid #dcd5c7" }}
            >
              Ketik Bebas / Manual
            </button>
          </div>
          <input
            name="dpTarget"
            inputMode="numeric"
            value={dpTarget}
            onChange={(event) => setDpTarget(event.target.value.replace(/\D/g, ""))}
            placeholder="Ketik nominal DP manual..."
            required
          />
          <output className="management-money-readable">Terbaca: <strong>{rupiah(Number(dpTarget || 0))}</strong></output>
          <small>Bisa pakai default Rp5jt atau langsung ketik angka bebas sesuai kesepakatan.</small>
          <ErrorText state={state} name="dpTarget" />
        </label>
        <label><span>Tipe kamar *</span><select name="roomType" defaultValue="quad"><option value="quad">Quad · 4 orang (Standar Paket)</option><option value="triple">Triple · 3 orang</option><option value="double">Double · 2 orang</option></select><small>Tipe kamar default yang akan otomatis diterapkan pada Room List.</small></label>
        <label className="span-two"><span>Diskon per jamaah</span><input name="discountAmount" inputMode="numeric" value={discountAmount} onChange={(event) => setDiscountAmount(event.target.value.replace(/\D/g, ""))} /><output className="management-money-readable">Terbaca: <strong>{rupiah(Number(discountAmount || 0))}</strong></output><small>Isi angka 0 jika tidak ada diskon. Diskon dipotong dari harga setiap jamaah.</small><ErrorText state={state} name="discountAmount" />{Number(discountAmount) >= Number(agreedPrice) && Number(discountAmount) > 0 ? <small className="management-field-error">Diskon harus lebih kecil daripada harga jamaah.</small> : null}</label>
      </div>
    </section>

    <section className="management-booking-step">
      <header><b>2</b><span><strong>Isi data orang yang membayar</strong><small>Ini adalah orang yang akan menerima informasi tagihan.</small></span><em className={payerReady ? "complete" : "incomplete"}>{payerReady ? <CheckCircle2 /> : <CircleAlert />}{payerReady ? "Sudah lengkap" : "Belum lengkap"}</em></header>
      <div className="management-form-grid two">
        <label className="span-two management-copy-payer"><span>Supaya lebih cepat: salin dari data jamaah</span><select aria-label="Salin data pembayar dari jamaah" defaultValue="" onChange={(event) => copyPayer(event.target.value)}><option value="">Pilih nama jamaah jika pembayar juga jamaah</option>{pilgrims.map((item) => <option value={item.id} key={item.id}>{item.fullName} — {item.whatsapp}</option>)}</select><small>Pilihan ini hanya membantu mengisi nama, WhatsApp, dan email. Data masih bisa diedit.</small></label>
        <label><span>Nama pembayar *</span><input name="payerName" autoComplete="name" value={payerName} onChange={(event) => setPayerName(event.target.value)} placeholder="Contoh: Bapak Ahmad" required /><small>Boleh jamaah sendiri, kepala keluarga, atau orang yang mewakili.</small><ErrorText state={state} name="payerName" /></label>
        <label><span>WhatsApp pembayar *</span><input name="payerWhatsapp" inputMode="tel" autoComplete="tel" value={payerWhatsapp} onChange={(event) => setPayerWhatsapp(event.target.value)} placeholder="Contoh: 081234567890" required /><small>Nomor yang akan dihubungi mengenai DP dan pelunasan.</small><ErrorText state={state} name="payerWhatsapp" /></label>
        <label className="span-two"><span>Email pembayar <i>boleh dikosongkan</i></span><input name="payerEmail" type="email" autoComplete="email" value={payerEmail} onChange={(event) => setPayerEmail(event.target.value)} placeholder="Contoh: nama@email.com" /><small>Tidak wajib diisi jika pembayar tidak memiliki email.</small><ErrorText state={state} name="payerEmail" /></label>
      </div>
    </section>

    <section className="management-booking-step">
      <header><b>3</b><span><strong>Apakah pendaftaran berasal dari agen?</strong><small>Jika tidak, biarkan pilihan “Tanpa agen”.</small></span><em className="optional">Opsional</em></header>
      <div className="management-form-grid two">
        <label><span>Agen <i>opsional</i></span><select name="agentId" value={agentId} onChange={(event) => selectAgent(event.target.value)}><option value="">Tanpa agen / pendaftaran langsung</option>{agents.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><small>Pilih agen asal agar referral dan komisinya tercatat pada pendaftaran ini.</small><ErrorText state={state} name="agentId" /></label>
        <label><span>Komisi per jamaah</span><select name="commissionAmount" value={commissionAmount} onChange={(event) => setCommissionAmount(event.target.value)} disabled={!agentId}><option value="0">Tanpa komisi</option><option value="500000">Rp500.000</option><option value="1000000">Rp1.000.000</option></select>{!agentId ? <input type="hidden" name="commissionAmount" value="0" /> : null}<small>{selectedAgent ? `Otomatis mengikuti default ${selectedAgent.name}: ${rupiah(selectedAgent.defaultCommission)}. Komisi baru sah setelah jamaah lunas.` : "Aktif setelah agen dipilih. Tanpa agen, komisi otomatis Rp0."}</small><ErrorText state={state} name="commissionAmount" /></label>
      </div>
    </section>

    <section className="management-booking-step">
      <header><b>4</b><span><strong>Pilih jamaah yang akan berangkat</strong><small>Centang nama jamaah satu per satu.</small></span><em className={pilgrimsReady ? "complete" : "incomplete"}>{pilgrimsReady ? <CheckCircle2 /> : <CircleAlert />}{pilgrimsReady ? `${pilgrimIds.length} dipilih` : "Belum dipilih"}</em></header>
      <label className="management-pilgrim-search"><span>Cari jamaah</span><input type="search" value={pilgrimSearch} onChange={(event) => setPilgrimSearch(event.target.value)} placeholder="Ketik nama atau nomor WhatsApp" /><small>{filteredPilgrims.length} nama ditemukan. Jamaah yang sudah dicentang tetap tersimpan saat pencarian diubah.</small></label>
      {pilgrimIds.map((id) => <input key={id} type="hidden" name="pilgrimIds" value={id} />)}
      <fieldset className="management-choice-list"><legend>{pilgrimIds.length ? `${pilgrimIds.length} jamaah sudah dipilih` : "Pilih minimal satu jamaah *"}</legend>{filteredPilgrims.length ? filteredPilgrims.map((item) => <label className={pilgrimIds.includes(item.id) ? "selected" : ""} key={item.id}><input type="checkbox" value={item.id} checked={pilgrimIds.includes(item.id)} onChange={(event) => togglePilgrim(item.id, event.target.checked)} /><span><strong>{item.fullName}</strong><small>{item.whatsapp}</small></span></label>) : <p className="management-no-search-result">Nama jamaah tidak ditemukan. Coba kata pencarian lain.</p>}<ErrorText state={state} name="pilgrimIds" /></fieldset>
    </section>

    <div className="management-booking-summary"><WalletCards /><span><small>PERIKSA SEBELUM DISIMPAN</small><strong>{selectedDeparture?.package?.name ?? "Paket belum dipilih"}</strong><dl><div><dt>Harga awal / jamaah</dt><dd>{rupiah(Number(agreedPrice || 0))}</dd></div><div><dt>Diskon / jamaah</dt><dd>− {rupiah(Number(discountAmount || 0))}</dd></div><div><dt>Harga akhir / jamaah</dt><dd>{rupiah(finalPrice)}</dd></div><div><dt>Jumlah jamaah</dt><dd>{pilgrimIds.length} orang</dd></div><div className="total"><dt>Total tagihan</dt><dd>{rupiah(totalBill)}</dd></div></dl>{agentId ? <em>Agen {selectedAgent?.name} · komisi {rupiah(Number(commissionAmount))} / jamaah</em> : <em>Pendaftaran langsung tanpa agen</em>}</span></div>
    <div className={`management-booking-submit ${formReady ? "ready" : "not-ready"}`}><span><UsersRound /><span><strong>{formReady ? "Semua data utama sudah lengkap" : "Pendaftaran belum bisa disimpan"}</strong><small>{formReady ? "Periksa ringkasan sekali lagi, lalu simpan." : `Lengkapi terlebih dahulu: ${missing}.`}</small></span></span><SubmitButton disabled={!formReady}>{pending ? "Menyimpan…" : "Simpan pendaftaran"}</SubmitButton></div>
  </form>;
}

type PaymentBooking = { id: string; invoiceId: string; bookingNumber: string; invoiceNumber: string; invoiceAmount: number; invoiceRemaining: number; payerName: string; registrations: Array<{ id: string; agreedPrice: number; dpTarget: number; payment: { status: string; netPaid: number; outstanding: number }; pilgrim?: { fullName: string } }> };

function allocatePayment(registrations: PaymentBooking["registrations"], amount: number) {
  let remaining = amount;
  const allocations: Record<string, string> = {};
  for (const registration of registrations) {
    const value = Math.min(remaining, registration.payment.outstanding);
    if (value > 0) allocations[registration.id] = String(value);
    remaining -= value;
  }
  return allocations;
}

export function PaymentForm({ bookings, accounts, initialBookingId }: { bookings: PaymentBooking[]; accounts: Array<{ id: string; name: string }>; initialBookingId?: string }) {
  const [state, action, pending] = useActionState(recordPaymentAction, managementInitialState);
  const initialBooking = bookings.find((booking) => booking.id === initialBookingId) ?? bookings[0];
  const [invoiceId, setInvoiceId] = useState(initialBooking?.invoiceId ?? "");
  const [amount, setAmount] = useState(() => initialBooking?.invoiceRemaining ? String(initialBooking.invoiceRemaining) : "");
  const [allocations, setAllocations] = useState<Record<string, string>>(() => allocatePayment(initialBooking?.registrations ?? [], initialBooking?.invoiceRemaining ?? 0));
  const [localNow] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  const booking = bookings.find((item) => item.invoiceId === invoiceId);
  const serialized = useMemo(() => JSON.stringify(Object.entries(allocations).filter(([, value]) => Number(value) > 0).map(([registrationId, value]) => ({ registrationId, amount: Number(value) }))), [allocations]);
  function autoAllocate() {
    setAllocations(allocatePayment(booking?.registrations ?? [], Number(amount) || 0));
  }
  function fillDp() {
    let remainingInvoice = booking?.invoiceRemaining ?? 0;
    const next = Object.fromEntries((booking?.registrations ?? []).flatMap((registration) => {
      const value = Math.min(Math.max(0, registration.dpTarget - registration.payment.netPaid), registration.payment.outstanding, remainingInvoice);
      remainingInvoice -= value;
      return value > 0 ? [[registration.id, String(value)]] : [];
    }));
    setAllocations(next);
    setAmount(String(Object.values(next).reduce((total, value) => total + Number(value), 0) || ""));
  }
  function fillSettlement() {
    const next = allocatePayment(booking?.registrations ?? [], booking?.invoiceRemaining ?? 0);
    setAllocations(next);
    setAmount(String(Object.values(next).reduce((total, value) => total + Number(value), 0) || ""));
  }
  return <form action={action} className="management-form"><Feedback state={state} /><input type="hidden" name="allocations" value={serialized} /><input type="hidden" name="bookingId" value={booking?.id ?? ""} />
    <div className="management-payment-flow-note"><FileText /><span><small>INVOICE YANG DIBAYAR</small><strong>{booking?.invoiceNumber ?? "Pilih invoice"} · {rupiah(booking?.invoiceAmount ?? 0)}</strong><p>Nominal otomatis mengikuti invoice. Jika uang yang diterima berbeda, nominal masih bisa diubah.</p></span></div>
    <div className="management-form-grid two">
      <label><span>Invoice *</span><select name="invoiceId" value={invoiceId} onChange={(event) => { const next = bookings.find((item) => item.invoiceId === event.target.value); setInvoiceId(event.target.value); setAmount(next?.invoiceRemaining ? String(next.invoiceRemaining) : ""); setAllocations(allocatePayment(next?.registrations ?? [], next?.invoiceRemaining ?? 0)); }} required>{bookings.map((item) => <option value={item.invoiceId} key={item.invoiceId}>{item.invoiceNumber} — {item.payerName} — sisa {rupiah(item.invoiceRemaining)}</option>)}</select></label>
      <label><span>Masuk ke rekening/kas *</span><select name="accountId" required><option value="">Pilih rekening</option>{accounts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label><span>Tanggal pembayaran *</span><input name="paidAt" type="datetime-local" defaultValue={localNow} required /></label>
      <label><span>Metode</span><select name="method" defaultValue="transfer"><option value="transfer">Transfer</option><option value="cash">Tunai</option><option value="card">Kartu</option><option value="other">Lainnya</option></select></label>
      <label><span>Nominal pembayaran *</span><input name="amount" inputMode="numeric" value={amount} onChange={(event) => { const value = event.target.value.replace(/\D/g, ""); setAmount(value); setAllocations(allocatePayment(booking?.registrations ?? [], Number(value) || 0)); }} required /><small>Terisi dari nominal invoice dan tetap dapat disesuaikan.</small></label>
      <label><span>Referensi <i>opsional</i></span><input name="reference" placeholder="Nomor transfer" /></label>
    </div>
    <div className="management-payment-presets"><span><strong>Isi nominal lebih cepat</strong><small>Pembayaran maksimal mengikuti sisa invoice {rupiah(booking?.invoiceRemaining ?? 0)}.</small></span><div><button type="button" onClick={fillDp}>Sesuai target DP</button><button type="button" onClick={fillSettlement}>Bayar sisa invoice</button></div></div>
    <div className="management-allocation"><div><strong>Alokasi per jamaah</strong><button type="button" onClick={autoAllocate}>Alokasikan nominal custom</button></div>{booking?.registrations.map((registration) => <label key={registration.id}><span><strong>{registration.pilgrim?.fullName}</strong><small>{registration.payment.status} · target DP {rupiah(registration.dpTarget)} · sisa {rupiah(registration.payment.outstanding)}</small></span><input aria-label={`Alokasi ${registration.pilgrim?.fullName}`} inputMode="numeric" value={allocations[registration.id] ?? ""} onChange={(event) => setAllocations((current) => ({ ...current, [registration.id]: event.target.value.replace(/\D/g, "") }))} /></label>)}</div>
    <label><span>Catatan</span><textarea name="note" rows={2} /></label>
    <SubmitButton>{pending ? "Mencatat…" : "Simpan pembayaran & buat kwitansi"}</SubmitButton>
  </form>;
}

export function BookingCancellationForm({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState(cancelBookingAction, managementInitialState);
  return <form action={action} className="management-form"><input type="hidden" name="bookingId" value={bookingId} /><Feedback state={state} /><label><span>Alasan pembatalan *</span><textarea name="reason" rows={3} required placeholder="Contoh: jamaah membatalkan keberangkatan" /></label><p className="management-form-note">Pembatalan tidak otomatis mengeluarkan uang. Jika sudah ada pembayaran, catat refund dari detail pembayaran agar kas dan riwayat tetap akurat.</p><SubmitButton>{pending ? "Membatalkan…" : "Konfirmasi pembatalan"}</SubmitButton></form>;
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
  return <form action={action} className="management-status-form"><input type="hidden" name="entity" value={entity} /><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={next} /><Feedback state={state} /><button type="submit" disabled={pending}>{pending ? <LoaderCircle className="spin" /> : null}{pending ? "Memproses…" : status === "active" ? "Arsipkan data" : "Aktifkan kembali"}</button></form>;
}

export function ReportInclusionToggleForm({
  entity,
  id,
  isIncluded,
}: {
  entity: "payment" | "cash_transaction";
  id: string;
  isIncluded: boolean;
}) {
  const [state, action, pending] = useActionState(toggleReportInclusionAction, managementInitialState);
  const nextInclude = !isIncluded;

  return (
    <form action={action} className="management-status-form" style={{ marginTop: "8px" }}>
      <input type="hidden" name="entity" value={entity} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="include" value={String(nextInclude)} />
      <Feedback state={state} />
      <button
        type="submit"
        disabled={pending}
        className={`management-report-toggle-btn ${isIncluded ? "btn-exclude" : "btn-include"}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          border: isIncluded ? "1px solid #cbd5e1" : "1px solid #16a34a",
          background: isIncluded ? "#f8fafc" : "#f0fdf4",
          color: isIncluded ? "#475569" : "#15803d",
          transition: "all 0.15s ease",
        }}
      >
        {pending ? (
          <LoaderCircle className="spin" aria-hidden />
        ) : isIncluded ? (
          <EyeOff size={15} aria-hidden />
        ) : (
          <Eye size={15} aria-hidden />
        )}
        <span>
          {pending
            ? "Memproses…"
            : isIncluded
            ? "Kecualikan dari Laporan (Data Testing)"
            : "Masukkan Kembali ke Laporan"}
        </span>
      </button>
    </form>
  );
}


type SequenceValues = { pattern: string; nextNumber: number; padding: number; reset: "never" | "monthly" | "yearly"; currentPeriod: string | null };

export function SequenceForm({ kind, values }: { kind: "invoice" | "receipt"; values?: SequenceValues }) {
  const [state, action, pending] = useActionState(saveSequenceAction, managementInitialState);
  const nextDocumentNumber = values ? formatDocumentNumber(values, new Date()).number : kind === "invoice" ? "9933/jamw/300828" : "0066/jamw/300826";
  return <form action={action} className="management-form compact"><Feedback state={state} /><input type="hidden" name="kind" value={kind} /><div className="management-form-grid">
    <label><span>Nomor {kind === "invoice" ? "invoice" : "kwitansi"} berikutnya *</span><input name="nextDocumentNumber" defaultValue={nextDocumentNumber} required /><small>Nomor ini boleh diedit manual. Setelah dokumen diterbitkan, angka depannya naik otomatis.</small></label>
  </div><SubmitButton>{pending ? "Menyimpan…" : `Simpan nomor ${kind === "invoice" ? "invoice" : "kwitansi"}`}</SubmitButton></form>;
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

export function ManagementSettingsForm({ values }: { values: { companyName: string; companyAddress: string; companyPhone: string; companyEmail: string; defaultDpAmount: number; paymentDueDays: number; financeSignerName: string; financeSignerTitle: string; birthdayMessageTemplate: string } | null }) {
  const [state, action, pending] = useActionState(saveManagementSettingsAction, managementInitialState);
  return <form action={action} className="management-form"><Feedback state={state} /><div className="management-form-grid two"><label><span>Nama perusahaan *</span><input name="companyName" defaultValue={values?.companyName ?? "Jam Wisata"} required /></label><label><span>Nomor WhatsApp/telepon</span><input name="companyPhone" defaultValue={values?.companyPhone ?? ""} /></label><label><span>Email perusahaan</span><input name="companyEmail" type="email" defaultValue={values?.companyEmail ?? ""} /></label><label><span>Default DP per jamaah *</span><input name="defaultDpAmount" inputMode="numeric" defaultValue={values?.defaultDpAmount ?? 5000000} required /></label><label><span>Pelunasan maksimal H-</span><input name="paymentDueDays" type="number" min="1" max="180" defaultValue={values?.paymentDueDays ?? 30} required /></label><label><span>Nama penandatangan</span><input name="financeSignerName" defaultValue={values?.financeSignerName ?? ""} /></label><label><span>Jabatan penandatangan</span><input name="financeSignerTitle" defaultValue={values?.financeSignerTitle ?? "Keuangan"} /></label><label className="span-two"><span>Alamat perusahaan</span><textarea name="companyAddress" defaultValue={values?.companyAddress ?? ""} rows={3} /></label><label className="span-two"><span>Template ucapan ulang tahun *</span><textarea name="birthdayMessageTemplate" defaultValue={values?.birthdayMessageTemplate ?? "Assalamu'alaikum Kak [NAMA], selamat ulang tahun yang ke-[UMUR]. Semoga Allah senantiasa memberikan kesehatan, keberkahan usia, dan kemudahan dalam setiap ibadah. Salam hangat dari Jam Wisata."} rows={5} maxLength={1000} required /><small>Gunakan [NAMA] untuk nama jamaah dan [UMUR] untuk umur yang diisi otomatis.</small></label></div><SubmitButton>{pending ? "Menyimpan…" : "Simpan pengaturan"}</SubmitButton></form>;
}

export function RoomListForm({
  registrations,
  defaultRegistrationId,
  defaultCity = "makkah",
  defaultRoomType = "quad",
  defaultRoomNumber = "",
}: {
  registrations: Array<{ id: string; pilgrimName: string; gender: string | null; packageName: string; roomType?: string | null; makkahRoomNumber?: string | null; madinahRoomNumber?: string | null; roomNumber?: string | null }>;
  defaultRegistrationId?: string;
  defaultCity?: "makkah" | "madinah";
  defaultRoomType?: string;
  defaultRoomNumber?: string;
}) {
  const [state, action, pending] = useActionState(assignRoomAction, managementInitialState);
  const [selectedRegId, setSelectedRegId] = useState(defaultRegistrationId ?? registrations[0]?.id ?? "");
  const [city, setCity] = useState<"makkah" | "madinah">(defaultCity);
  const selectedReg = registrations.find((item) => item.id === selectedRegId);
  const [roomType, setRoomType] = useState(selectedReg?.roomType ?? defaultRoomType ?? "quad");
  const [roomNumber, setRoomNumber] = useState(defaultRoomNumber || (city === "madinah" ? (selectedReg?.madinahRoomNumber ?? "") : (selectedReg?.makkahRoomNumber ?? selectedReg?.roomNumber ?? "")));

  function onSelectRegistration(id: string) {
    setSelectedRegId(id);
    const reg = registrations.find((item) => item.id === id);
    if (reg) {
      if (reg.roomType) setRoomType(reg.roomType);
      const curRoom = city === "madinah" ? (reg.madinahRoomNumber ?? "") : (reg.makkahRoomNumber ?? reg.roomNumber ?? "");
      if (curRoom) setRoomNumber(curRoom);
    }
  }

  function onCityChange(newCity: "makkah" | "madinah") {
    setCity(newCity);
    if (selectedReg) {
      const curRoom = newCity === "madinah" ? (selectedReg.madinahRoomNumber ?? "") : (selectedReg.makkahRoomNumber ?? selectedReg.roomNumber ?? "");
      setRoomNumber(curRoom);
    }
  }

  // Extract existing rooms in the current city matching the pilgrim's gender
  const existingRoomsInCity = useMemo(() => {
    const map = new Map<string, { roomNumber: string; roomType: string; count: number }>();
    const pilgrimGender = selectedReg?.gender;
    for (const r of registrations) {
      if (r.id === selectedRegId) continue;
      // If gender known, match gender
      if (pilgrimGender && r.gender && r.gender !== pilgrimGender) continue;
      const rNum = (city === "madinah" ? r.madinahRoomNumber : (r.makkahRoomNumber || r.roomNumber))?.trim();
      if (!rNum) continue;
      const rType = r.roomType || "quad";
      const cur = map.get(rNum) || { roomNumber: rNum, roomType: rType, count: 0 };
      cur.count += 1;
      map.set(rNum, cur);
    }
    const caps: Record<string, number> = { double: 2, triple: 3, quad: 4 };
    return Array.from(map.values()).map((item) => {
      const cap = caps[item.roomType.toLowerCase()] || 4;
      const remaining = Math.max(0, cap - item.count);
      return {
        ...item,
        capacity: cap,
        remaining,
      };
    });
  }, [registrations, city, selectedRegId, selectedReg?.gender]);

  return (
    <form action={action} className="management-form">
      <Feedback state={state} />
      <div className="management-form-grid two">
        <label>
          <span>Pilih Jamaah *</span>
          <select name="registrationId" value={selectedRegId} onChange={(e) => onSelectRegistration(e.target.value)} required>
            {registrations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.pilgrimName} · {item.gender || "jenis kelamin belum diisi"} · {item.packageName}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Lokasi Hotel / Kota *</span>
          <select name="city" value={city} onChange={(e) => onCityChange(e.target.value as "makkah" | "madinah")} required>
            <option value="makkah">Hotel Makkah</option>
            <option value="madinah">Hotel Madinah</option>
          </select>
        </label>
        <label>
          <span>Tipe kamar *</span>
          <select name="roomType" value={roomType} onChange={(e) => setRoomType(e.target.value)} required>
            <option value="quad">Quad · 4 orang</option>
            <option value="triple">Triple · 3 orang</option>
            <option value="double">Double · 2 orang</option>
          </select>
        </label>
        <label>
          <span>Nomor / Nama Kamar * (Wajib Diisi)</span>
          <input
            name="roomNumber"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="Ketik baru atau pilih kamar yang sudah ada..."
            list="existing-rooms-list"
            required
          />
          <datalist id="existing-rooms-list">
            {existingRoomsInCity.map((er) => (
              <option key={er.roomNumber} value={er.roomNumber}>
                {er.roomNumber} (Tipe {er.roomType.toUpperCase()} - sisa {er.remaining} slot)
              </option>
            ))}
          </datalist>
          {existingRoomsInCity.length > 0 && (
            <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Pilih kamar yang tersedia:</span>
              {existingRoomsInCity.filter((er) => er.remaining > 0).map((er) => (
                <button
                  key={er.roomNumber}
                  type="button"
                  onClick={() => {
                    setRoomNumber(er.roomNumber);
                    setRoomType(er.roomType.toLowerCase());
                  }}
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "1px solid #bd8d1b",
                    background: roomNumber === er.roomNumber ? "#bd8d1b" : "#fff9ec",
                    color: roomNumber === er.roomNumber ? "#fff" : "#946a0c",
                    cursor: "pointer",
                  }}
                >
                  {er.roomNumber} ({er.remaining} slot)
                </button>
              ))}
            </div>
          )}
          <small>Nama kamar fisik hotel. Bisa pilih dari kamar yang sudah ada di atas atau ketik nama baru.</small>
        </label>
      </div>
      <p className="management-form-note">
        Sistem otomatis memisahkan kamar laki-laki & perempuan serta menjaga batas kapasitas (Quad 4 orang, Triple 3 orang, Double 2 orang).
      </p>
      <SubmitButton>{pending ? "Menyimpan…" : "Simpan Room List"}</SubmitButton>
    </form>
  );
}


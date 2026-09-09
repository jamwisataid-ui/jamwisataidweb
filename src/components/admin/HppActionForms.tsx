"use client";

import { useActionState } from "react";
import { Archive, Copy, Globe2, Plus, Trash2 } from "lucide-react";
import { FormFeedback } from "./FormFeedback";
import { applyHppPriceAction, archiveHppCostingAction, cloneHppCostingAction, createHppMasterAction, deleteHppMasterAction, saveHppMasterAction } from "@/lib/management/hpp-actions";
import { HPP_MASTER_CATEGORIES } from "@/lib/management/hpp";
import type { ManagementActionState } from "@/lib/management/validation";

const initial: ManagementActionState = { ok: false, message: "" };

export function HppRecordActions({ id }: { id: string }) {
  const [cloneState, cloneAction, cloning] = useActionState(cloneHppCostingAction, initial);
  const [archiveState, archiveAction, archiving] = useActionState(archiveHppCostingAction, initial);
  return <div className="hpp-record-actions"><FormFeedback state={cloneState} /><FormFeedback state={archiveState} /><form action={cloneAction}><input type="hidden" name="id" value={id} /><button disabled={cloning}><Copy />{cloning ? "Menyalin…" : "Duplikasi"}</button></form><form action={archiveAction}><input type="hidden" name="id" value={id} /><button className="danger" disabled={archiving}><Archive />{archiving ? "Mengarsipkan…" : "Arsipkan"}</button></form></div>;
}

export function ApplyHppPriceForm({ id, appliedPrice, departureId, departures }: { id: string; appliedPrice: number; departureId?: string | null; departures: Array<{ id: string; departureDate: string; price: string; package?: { name: string } }> }) {
  const [state, action, pending] = useActionState(applyHppPriceAction, initial);
  return <form action={action} className="management-form hpp-apply-form"><FormFeedback state={state} /><input type="hidden" name="id" value={id} /><div className="management-form-grid two"><label><span>Pilih paket keberangkatan *</span><select name="departureId" defaultValue={departureId ?? ""} required><option value="">-- Pilih paket yang ingin diperbarui --</option>{departures.map((item) => <option value={item.id} key={item.id}>{item.package?.name ?? "Paket"} — {item.departureDate} (Harga saat ini: Rp{Number(item.price).toLocaleString("id-ID")})</option>)}</select><small>Pilih jadwal paket mana yang harganya mau diubah.</small></label><label><span>Nominal harga baru *</span><input name="appliedPrice" inputMode="numeric" defaultValue={appliedPrice} required /><small>Periksa nominal di atas sebelum menerapkan ke website publik.</small></label></div><label className="hpp-apply-confirm"><input type="checkbox" name="confirmed" value="yes" required /><span>Saya yakin dan sudah memeriksa paket serta nominal harga baru di atas.</span></label><button className="admin-primary-button" disabled={pending}><Globe2 />{pending ? "Sedang memperbarui harga website…" : "Ya, Terapkan Harga ke Website"}</button></form>;
}

export function HppMasterPriceForm({ item }: { item: { id: string; name: string; amount: string; currency: string; costBasis: string } }) {
  const [state, action, pending] = useActionState(saveHppMasterAction, initial);
  const [deleteState, deleteAction, deleting] = useActionState(deleteHppMasterAction, initial);
  return <div className="hpp-master-row-wrap"><FormFeedback state={deleteState} /><form action={action} className="hpp-master-row"><input type="hidden" name="id" value={item.id} /><span><strong>{item.name}</strong><small>{item.costBasis === "group" ? "Total rombongan" : item.costBasis === "room_per_night" ? "Per kamar / malam" : "Per jamaah"}</small></span><select name="currency" defaultValue={item.currency} aria-label={`Mata uang ${item.name}`}><option>IDR</option><option>USD</option><option>SAR</option></select><input name="amount" inputMode="decimal" defaultValue={Number(item.amount)} aria-label={`Harga ${item.name}`} /><button disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</button>{state.message ? <small className={state.ok ? "success" : "error"}>{state.message}</small> : null}</form><form action={deleteAction} className="hpp-master-delete"><input type="hidden" name="id" value={item.id} /><button type="submit" disabled={deleting} onClick={(event) => { if (!window.confirm(`Hapus “${item.name}” dari pilihan HPP? Simulasi lama tidak akan berubah.`)) event.preventDefault(); }} aria-label={`Hapus ${item.name}`}><Trash2 />{deleting ? "Menghapus…" : "Hapus"}</button></form></div>;
}

export function HppMasterCreateForm() {
  const [state, action, pending] = useActionState(createHppMasterAction, initial);
  return <form action={action} className="management-form hpp-master-create"><FormFeedback state={state} fieldLabels={{ name: "Nama biaya", category: "Kategori", currency: "Mata uang", costBasis: "Cara menghitung", amount: "Harga awal" }} /><div className="management-form-grid two"><label><span>Nama biaya atau hotel *</span><input name="name" placeholder="Contoh: Hotel Makkah Quad" required minLength={2} /><small>Gunakan nama yang mudah dikenali saat membuat perhitungan.</small></label><label><span>Kategori *</span><select name="category" defaultValue="other">{HPP_MASTER_CATEGORIES.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><small>Menentukan kelompok tempat master ini ditampilkan.</small></label><label><span>Mata uang *</span><select name="currency" defaultValue="IDR"><option>IDR</option><option>USD</option><option>SAR</option></select></label><label><span>Cara menghitung *</span><select name="costBasis" defaultValue="per_pax"><option value="per_pax">Per jamaah</option><option value="group">Total rombongan</option><option value="room_per_night">Per kamar / malam</option></select></label><label className="span-two"><span>Harga awal *</span><input name="amount" inputMode="decimal" defaultValue="0" required /><small>Nilai ini tetap bisa diubah lagi pada simulasi HPP tertentu.</small></label></div><button className="admin-primary-button" disabled={pending}><Plus />{pending ? "Menambahkan…" : "Tambahkan ke master harga"}</button></form>;
}

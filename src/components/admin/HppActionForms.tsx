"use client";

import { useActionState } from "react";
import { Archive, Copy, Globe2 } from "lucide-react";
import { FormFeedback } from "./FormFeedback";
import { applyHppPriceAction, archiveHppCostingAction, cloneHppCostingAction, saveHppMasterAction } from "@/lib/management/hpp-actions";
import type { ManagementActionState } from "@/lib/management/validation";

const initial: ManagementActionState = { ok: false, message: "" };

export function HppRecordActions({ id }: { id: string }) {
  const [cloneState, cloneAction, cloning] = useActionState(cloneHppCostingAction, initial);
  const [archiveState, archiveAction, archiving] = useActionState(archiveHppCostingAction, initial);
  return <div className="hpp-record-actions"><FormFeedback state={cloneState} /><FormFeedback state={archiveState} /><form action={cloneAction}><input type="hidden" name="id" value={id} /><button disabled={cloning}><Copy />{cloning ? "Menyalin…" : "Duplikasi"}</button></form><form action={archiveAction}><input type="hidden" name="id" value={id} /><button className="danger" disabled={archiving}><Archive />{archiving ? "Mengarsipkan…" : "Arsipkan"}</button></form></div>;
}

export function ApplyHppPriceForm({ id, appliedPrice, departureId, departures }: { id: string; appliedPrice: number; departureId?: string | null; departures: Array<{ id: string; departureDate: string; price: string; package?: { name: string } }> }) {
  const [state, action, pending] = useActionState(applyHppPriceAction, initial);
  return <form action={action} className="management-form hpp-apply-form"><FormFeedback state={state} /><input type="hidden" name="id" value={id} /><div className="management-form-grid two"><label><span>Paket keberangkatan *</span><select name="departureId" defaultValue={departureId ?? ""} required><option value="">Pilih keberangkatan</option>{departures.map((item) => <option value={item.id} key={item.id}>{item.package?.name ?? "Paket"} — {item.departureDate} (sekarang Rp{Number(item.price).toLocaleString("id-ID")})</option>)}</select></label><label><span>Harga baru *</span><input name="appliedPrice" inputMode="numeric" defaultValue={appliedPrice} required /><small>Periksa harga lama pada pilihan paket sebelum menerapkan.</small></label></div><label className="hpp-apply-confirm"><input type="checkbox" name="confirmed" value="yes" required /><span>Saya sudah memeriksa paket dan harga baru di atas.</span></label><button className="admin-primary-button" disabled={pending}><Globe2 />{pending ? "Menerapkan harga…" : "Terapkan ke website"}</button></form>;
}

export function HppMasterPriceForm({ item }: { item: { id: string; name: string; amount: string; currency: string; costBasis: string } }) {
  const [state, action, pending] = useActionState(saveHppMasterAction, initial);
  return <form action={action} className="hpp-master-row"><input type="hidden" name="id" value={item.id} /><span><strong>{item.name}</strong><small>{item.costBasis === "group" ? "Total rombongan" : item.costBasis === "room_per_night" ? "Per kamar / malam" : "Per jamaah"}</small></span><select name="currency" defaultValue={item.currency}><option>IDR</option><option>USD</option><option>SAR</option></select><input name="amount" inputMode="decimal" defaultValue={Number(item.amount)} /><button disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</button>{state.message ? <small className={state.ok ? "success" : "error"}>{state.message}</small> : null}</form>;
}

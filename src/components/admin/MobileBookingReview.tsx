"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function MobileBookingReview({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const review = async (decision: "approve" | "reject") => {
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/mobile/bookings/${bookingId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ decision, note }) });
    const payload = await response.json();
    if (!response.ok) setMessage(payload.error || "Pendaftaran gagal diproses.");
    else { setMessage(decision === "approve" ? "Pendaftaran sudah dikonfirmasi." : "Pendaftaran sudah ditolak."); router.refresh(); }
    setBusy(false);
  };
  return <div className="management-mobile-review"><label><span>Catatan untuk jamaah (opsional)</span><textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} rows={3} /></label><div><button disabled={busy} type="button" className="management-primary-button" onClick={() => review("approve")}><Check /> Konfirmasi pendaftaran</button><button disabled={busy} type="button" className="management-secondary-button" onClick={() => review("reject")}><X /> Tolak</button></div>{message ? <small>{message}</small> : null}</div>;
}

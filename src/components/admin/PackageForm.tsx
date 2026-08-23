"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, UploadCloud } from "lucide-react";

import { savePackageAction } from "@/lib/cms/actions";
import type { ActionState } from "@/lib/cms/validation";
import { UploadButton } from "@/lib/uploadthing";
import { FormFeedback } from "./FormFeedback";

type Values = Record<string, unknown>;
type Day = { day: number; title: string; description: string };
const initialState: ActionState = { ok: false, message: "" };

const field = (values: Values, key: string, fallback = "") => String(values[key] ?? fallback);

export function PackageForm({ values = {} }: { values?: Values }) {
  const [state, action, pending] = useActionState(savePackageAction, initialState);
  const [imageUrl, setImageUrl] = useState(field(values, "imageUrl"));
  const [days, setDays] = useState<Day[]>(() => {
    try { return JSON.parse(field(values, "itinerary", "[]")) as Day[]; } catch { return []; }
  });

  const error = (key: string) => state.errors?.[key]?.[0];
  return (
    <form action={action} className="admin-editor-form">
      <FormFeedback state={state} />
      <section className="admin-form-section"><div><p>Identitas program</p><span>Informasi utama yang tampil pada kartu dan halaman detail.</span></div><div className="admin-form-grid">
        <label><span>Nama paket</span><input name="name" defaultValue={field(values, "name")} required />{error("name") ? <small>{error("name")}</small> : null}</label>
        <label><span>ID internal</span><input name="id" defaultValue={field(values, "id")} required placeholder="umrah-9-hari" /></label>
        <label><span>Slug URL</span><input name="slug" defaultValue={field(values, "slug")} required placeholder="umroh-9-hari-reguler" /></label>
        <label><span>Badge</span><input name="badge" defaultValue={field(values, "badge")} placeholder="Quad All In" /></label>
        <label><span>Kategori</span><select name="category" defaultValue={field(values, "category", "umrah")}><option value="umrah">Umrah</option><option value="hajj">Haji</option><option value="halal-tour">Wisata Halal</option></select></label>
        <label><span>Tipe program</span><select name="packageType" defaultValue={field(values, "packageType", "reguler")}><option value="reguler">Reguler</option><option value="bintang-5">Bintang 5</option><option value="plus">Plus</option><option value="tour">Tour</option></select></label>
        <label><span>Durasi (hari)</span><input name="durationDays" type="number" min="1" defaultValue={field(values, "durationDays", "9")} /></label>
        <label><span>Urutan</span><input name="sortOrder" type="number" min="0" defaultValue={field(values, "sortOrder", "0")} /></label>
        <label className="admin-span-2"><span>Ringkasan</span><textarea name="summary" rows={3} defaultValue={field(values, "summary")} /></label>
        <label className="admin-checkbox"><input name="featured" type="checkbox" defaultChecked={Boolean(values.featured)} /><span>Tampilkan sebagai program unggulan</span></label>
      </div></section>

      <section className="admin-form-section"><div><p>Visual paket</p><span>Gunakan foto natural dengan orientasi landscape.</span></div><div className="admin-form-grid">
        <label className="admin-span-2"><span>URL gambar</span><input name="imageUrl" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} required /></label>
        <div className="admin-upload-field"><UploadCloud className="size-5" /><div><strong>Upload gambar baru</strong><small>JPG, PNG, atau WebP. Maksimal 8 MB.</small></div><UploadButton endpoint="cmsImage" onClientUploadComplete={(files) => { if (files[0]?.url) setImageUrl(files[0].url); }} onUploadError={(uploadError) => console.error(uploadError)} /></div>
      </div></section>

      <section className="admin-form-section"><div><p>Keberangkatan utama</p><span>Jadwal ini digunakan pada kartu, filter, dan halaman jadwal.</span></div><div className="admin-form-grid">
        <label><span>Tanggal berangkat</span><input name="departureDate" type="date" defaultValue={field(values, "departureDate")} required /></label>
        <label><span>Label tanggal</span><input name="departureLabel" defaultValue={field(values, "departureLabel")} placeholder="10 Oktober 2026" required /></label>
        <label><span>Tanggal pulang</span><input name="returnDate" type="date" defaultValue={field(values, "returnDate")} /></label>
        <label><span>Tanggal manasik</span><input name="manasikDate" type="date" defaultValue={field(values, "manasikDate")} /></label>
        <label><span>Maskapai</span><input name="airline" defaultValue={field(values, "airline")} required /></label>
        <label><span>Bandara keberangkatan</span><input name="departureAirport" defaultValue={field(values, "departureAirport")} required /></label>
        <label><span>Bandara kedatangan</span><input name="arrivalAirport" defaultValue={field(values, "arrivalAirport")} /></label>
        <label><span>Harga All In</span><input name="price" type="number" min="1" defaultValue={field(values, "price")} required /></label>
        <label><span>Kapasitas</span><input name="capacity" type="number" min="1" defaultValue={field(values, "capacity")} /></label>
        <label><span>Seat tersedia</span><input name="availableSeats" type="number" min="0" defaultValue={field(values, "availableSeats")} /></label>
        <label><span>Status jadwal</span><select name="departureStatus" defaultValue={field(values, "departureStatus", "open")}><option value="open">Open</option><option value="limited">Limited</option><option value="full">Full</option><option value="closed">Closed</option><option value="coming-soon">Coming Soon</option></select></label>
      </div></section>

      <section className="admin-form-section"><div><p>Akomodasi</p><span>Hotel Makkah dan Madinah untuk keberangkatan utama.</span></div><div className="admin-form-grid">
        <label><span>Hotel Makkah</span><input name="makkahHotel" defaultValue={field(values, "makkahHotel")} required /></label><label><span>Bintang</span><input name="makkahStar" type="number" min="1" max="5" defaultValue={field(values, "makkahStar", "5")} /></label><label className="admin-span-2"><span>Jarak Hotel Makkah</span><input name="makkahDistance" defaultValue={field(values, "makkahDistance")} /></label>
        <label><span>Hotel Madinah</span><input name="madinahHotel" defaultValue={field(values, "madinahHotel")} required /></label><label><span>Bintang</span><input name="madinahStar" type="number" min="1" max="5" defaultValue={field(values, "madinahStar", "4")} /></label><label className="admin-span-2"><span>Jarak Hotel Madinah</span><input name="madinahDistance" defaultValue={field(values, "madinahDistance")} /></label>
      </div></section>

      <section className="admin-form-section"><div><p>Rincian program</p><span>Satu poin per baris agar mudah diurutkan dan dibaca.</span></div><div className="admin-form-grid">
        {[["facilities","Fasilitas"],["highlights","Highlight"],["includes","Termasuk"],["excludes","Tidak termasuk"],["terms","Persyaratan"],["destinations","Destinasi"]].map(([key,label]) => <label key={key}><span>{label}</span><textarea name={key} rows={6} defaultValue={field(values,key)} /></label>)}
      </div></section>

      <section className="admin-form-section"><div><p>Itinerary</p><span>Tambah dan susun perjalanan harian.</span></div><div className="admin-day-list"><input type="hidden" name="itinerary" value={JSON.stringify(days)} />{days.map((day,index)=><div className="admin-day-card" key={`${day.day}-${index}`}><span>Hari <input type="number" min="1" value={day.day} onChange={(event)=>setDays((current)=>current.map((item,i)=>i===index?{...item,day:Number(event.target.value)}:item))}/></span><input aria-label={`Judul hari ${day.day}`} value={day.title} onChange={(event)=>setDays((current)=>current.map((item,i)=>i===index?{...item,title:event.target.value}:item))}/><textarea aria-label={`Deskripsi hari ${day.day}`} rows={3} value={day.description} onChange={(event)=>setDays((current)=>current.map((item,i)=>i===index?{...item,description:event.target.value}:item))}/><button type="button" onClick={()=>setDays((current)=>current.filter((_,i)=>i!==index))} aria-label={`Hapus hari ${day.day}`}><Trash2 className="size-4" /></button></div>)}<button className="admin-secondary-button" type="button" onClick={()=>setDays((current)=>[...current,{day:current.length+1,title:"",description:""}])}><Plus className="size-4" /> Tambah hari</button></div></section>

      <section className="admin-form-section"><div><p>SEO & konsultasi</p><span>Judul dan deskripsi mesin pencari serta pesan WhatsApp.</span></div><div className="admin-form-grid">
        <label className="admin-span-2"><span>Pesan WhatsApp</span><textarea name="whatsappMessage" rows={4} defaultValue={field(values,"whatsappMessage")} required /></label><label><span>SEO title</span><input name="seoTitle" maxLength={70} defaultValue={field(values,"seoTitle")} /></label><label><span>SEO description</span><textarea name="seoDescription" maxLength={170} rows={3} defaultValue={field(values,"seoDescription")} /></label><label className="admin-span-2"><span>Portal booking eksternal</span><input name="detailUrl" type="url" defaultValue={field(values,"detailUrl")} /></label>
      </div></section>
      <div className="admin-form-actions"><button name="intent" value="draft" className="admin-secondary-button" disabled={pending}>Simpan Draft</button><button name="intent" value="publish" className="admin-primary-button" disabled={pending}>{pending ? "Menyimpan..." : "Terbitkan Paket"}</button></div>
    </form>
  );
}

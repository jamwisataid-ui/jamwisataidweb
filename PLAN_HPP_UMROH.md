# Rencana Implementasi: Modul HPP Umrah (Harga Pokok Penjualan) & Simulasi Paket

Dokumen ini berisi spesifikasi teknis dan rencana implementasi modul **Kalkulator HPP Umrah & Simulasi Margin Paket** untuk Jam Wisata, yang diadopsi dari rumus dan struktur master spreadsheet **`MUHASIB Pro Full Master.xlsx`**.

---

## 1. Latar Belakang & Tujuan

Klien membutuhkan modul internal di website Jam Wisata untuk menghitung secara mandiri **Harga Pokok Penjualan (HPP)** dan **Harga Jual Final** suatu paket umrah sebelum dipasarkan. 

Modul ini menggantikan proses manual di Excel, sehingga:
1. Perhitungan biaya per pax menjadi otomatis dan real-time.
2. Mendukung konversi mata uang multi-kurs (IDR, USD, dan SAR/Riyal).
3. Formula pembagian biaya kelompok (*group fixed costs*) dan beban **FOC (Free of Charge) Tour Leader** dihitung akurat sesuai standar industri travel umrah.
4. Hasil kalkulasi dapat disimpan sebagai simulasi/draft, diekspor ke Excel (.xlsx) resmi, dan diterapkan langsung ke harga paket di website.

---

## 2. Struktur Komponen & Logika Formula (MUHASIB Pro)

Berdasarkan analisis file master, formula kalkulasi dibagi menjadi 3 tingkatan:

### A. Input Parameter Utama
- **Nama Paket**: Judul paket/simulasi (misal: "Umrah Akhir Tahun 9 Hari").
- **Musim (Season)**: *Low Season* / *Medium Season* / *High Season*.
- **Durasi Perjalanan**: Jumlah hari (misal: 9 hari, 12 hari).
- **Jumlah Jamaah (Pax)**: Angka pembagi biaya kelompok (misal: 35, 45, 50 pax).
- **Kurs Valuta Asing**:
  - Kurs **USD $\rightarrow$ IDR** (contoh: Rp 17.649)
  - Kurs **SAR (Riyal) $\rightarrow$ IDR** (contoh: Rp 4.817)

---

### B. 11 Kategori Komponen Biaya Riil (per Pax)

| No | Kategori Komponen | Mata Uang | Formula & Rincian Perhitungan |
|---|---|---|---|
| **1** | **Tiket Pesawat** | IDR / USD | `Tiket Utama PP (Rp)` + `Tiket Domestik Add-on (Rp)` + `Tiket Negara Lain (USD * Kurs USD)` |
| **2** | **Visa & Asuransi** | USD / SAR / IDR | `Visa Arab Saudi (USD * Kurs USD)` + `Visa Transit (USD * Kurs USD)` + `Asuransi Perjalanan (Rp)` + `Tasreh Raudhah (SAR * Kurs SAR)` |
| **3** | **Land Arrangement (LA)** | IDR / SAR | `Paket LA Hotel Makkah & Madinah (Quad basis / Triple / Double)` |
| **4** | **Handling & Konsumsi** | IDR | `Handling Bandara CGK (92% operasional + 8% tips)` + `Handling Domestik` + `Konsumsi Transit Domestik` + `Lounge` |
| **5** | **Bus Keberangkatan** | IDR | `(Sewa Bus Pariwisata / Total Pax)` + `Snack Bus` + `Tips Kru Bus` |
| **6** | **Bus Kedatangan** | IDR | `(Sewa Bus Pariwisata / Total Pax)` + `Snack Bus` + `Tips Kru Bus` |
| **7** | **Perlengkapan Umrah** | IDR | **Wajib**: Kain Seragam, Syal Rajut, Buku Doa, Buku Kenangan, ID Card & Tag.<br>**Opsional**: Set Koper & Tas, Kain Ihram/Mukena, Jilbab. |
| **8** | **Bimbingan Manasik** | IDR | `Manasik Teori` + `Manasik Praktek & MCU` + `Fee Pemateri Manasik` |
| **9** | **Program Tambahan** | SAR | `Kereta Cepat Haramain (SAR * Kurs SAR)` + `City Tour Thaif (SAR * Kurs SAR)` + `Tour Museum (SAR * Kurs SAR)` |
| **10** | **Sedekah & Sosial** | IDR | `Wakaf Yatim Piatu` + `Alokasi Subsidi Umroh Gratis` |
| **11** | **Biaya Lain & Operasional** | IDR | `Operasional Kantor` + `Uang Saku & Paket Data Tour Leader` + `Fixed Cost Cadangan` |

---

### C. Logika FOC Tour Leader & Penetapan Harga Jual

1. **Subtotal Biaya Riil Jamaah** ($C_{base}$):
   $$C_{base} = \sum_{k=1}^{11} \text{Biaya Komponen } k$$

2. **Beban FOC (Free of Charge) Tour Leader per Pax**:
   Biaya 1 orang Tour Leader ditanggung bersama secara proporsional oleh seluruh jamaah dalam grup:
   $$\text{FOC TL per Pax} = \frac{C_{base}}{\text{Total Pax}}$$

3. **Harga Pokok Penjualan (HPP) Bersih per Pax**:
   $$\text{HPP} = C_{base} + \text{FOC TL per Pax}$$

4. **Harga Jual Final**:
   $$\text{Harga Jual Final} = \text{HPP} + \text{Take Profit Margin (IDR)} + \text{Budget Fee Mitra/Marketing (IDR)}$$

---

## 3. Rencana Arsitektur & Perubahan Sistem

### A. Database Schema (`src/db/schema/management.ts`)
Membuat tabel baru `package_costings` untuk menyimpan setiap simulasi HPP:
- `id`: UUID (Primary Key)
- `packageId`: Text (opsional, relasi ke `packages.id` jika ditautkan)
- `title`: Text (Nama simulasi paket)
- `season`: Enum ("low", "medium", "high")
- `durationDays`: Integer (Durasi hari)
- `paxCount`: Integer (Jumlah jamaah)
- `usdRate`: Numeric (Kurs USD)
- `sarRate`: Numeric (Kurs SAR)
- `airlineName`: Text
- `makkahHotel`: Text
- `madinahHotel`: Text
- `subtotalBase`: BigInt (Subtotal biaya sebelum FOC)
- `focTourLeader`: BigInt (Beban FOC TL per pax)
- `hppPerPax`: BigInt (HPP bersih per pax)
- `profitMargin`: BigInt (Target keuntungan per pax)
- `marketingFee`: BigInt (Fee agen/mitra per pax)
- `sellingPrice`: BigInt (Harga jual final rekomendasi)
- `componentsData`: JSONB (Menyimpan seluruh detail input 11 komponen beserta harga & mata uang)
- `notes`: Text
- `createdAt`, `updatedAt`, `createdBy`

---

### B. Business Logic & Domain Engine (`src/lib/management/hpp.ts`)
- Fungsi kalkulasi murni `calculateHpp(input: HppCostingInput): HppCostingResult`.
- Master preset bawaan dari sheet *Sumber Data* dan *Harga Hotel* (Garuda, Saudia, Lion, AirAsia, Hotel Bintang 3-5 Makkah/Madinah, biaya visa standar USD 135, Tasreh SAR 25, handling Solo/CGK/SUB).
- Helper format mata uang (IDR, USD, SAR).

---

### C. Antarmuka Pengguna (UI) Admin (`src/components/admin/HppCalculatorWorkspace.tsx`)
1. **Navigasi Modul**:
   - Ditempatkan di menu sidebar **Manajemen Internal $\rightarrow$ Keuangan $\rightarrow$ HPP & Simulasi Paket** (`/admin/manajemen/hpp-umroh`).
2. **Kalkulator Interaktif (Dual Panel)**:
   - **Panel Kiri**: Form input terstruktur per kategori (Accordion / Tab: Kurs & Pax, Tiket, LA & Hotel, Visa & Handling, Bus, Perlengkapan, Manasik & Opsional, Profit & Fee). Dilengkapi preset pilihan cepat + opsi ketik angka manual bebas.
   - **Panel Kanan (Sticky Summary Card)**:
     - Real-time Subtotal Biaya Riil
     - Real-time Beban FOC TL
     - **Badge HPP Bersih** (tegas dan jelas)
     - Target Margin Laba & Fee Marketing
     - **HARGA JUAL REKOMENDASI** (angka besar dan kontras)
3. **Fitur Ekspor & Integrasi**:
   - Tombol **"Ekspor Excel (.xlsx)"**: Menghasilkan file Excel resmi berformat identik MUHASIB Pro yang rapi dan siap cetak/lapor pimpinan.
   - Tombol **"Terapkan ke Paket Website"**: Menghubungkan harga jual hasil hitungan ke paket di CMS Jam Wisata.
   - **Daftar Riwayat Simulasi**: Menyimpan draft simulasi untuk dibuka atau diedit kembali kapan saja.

---

## 4. Tahapan Pengerjaan (Milestones)

1. **Fase 1: Schema & Domain Calculation Engine**
   - Menambahkan tabel `package_costings` di schema Drizzle ORM.
   - Membuat engine kalkulasi TypeScript di `src/lib/management/hpp.ts` lengkap dengan unit test komprehensif.
2. **Fase 2: API Endpoints & Export Handler**
   - Endpoint CRUD simulasi HPP: `/api/admin/management/hpp`.
   - Endpoint generator Excel (.xlsx) resmi: `/api/admin/management/hpp/[id]/export`.
3. **Fase 3: Frontend Workspace & Integrasi Sidebar**
   - Pendaftaran modul di `src/lib/management/modules.ts` dan `AdminSidebar.tsx`.
   - Pembuatan komponen interaktif `HppCalculatorWorkspace.tsx`.
   - Integrasi di `ManagementWorkspace.tsx`.
4. **Fase 4: Pengujian & Verifikasi**
   - Pengujian akurasi hitungan dengan data sampel master MUHASIB Pro (35 pax, 9 hari).
   - Verifikasi layout ekspor Excel (.xlsx).
   - Typecheck, unit test, build test, dan deployment commit.

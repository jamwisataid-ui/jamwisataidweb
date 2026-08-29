export const managementModules = [
  {
    slug: "jamaah",
    title: "Data Jamaah",
    eyebrow: "OPERASIONAL JAMAAH",
    description: "Profil jamaah, paket yang diikuti, status pembayaran, dan seluruh riwayatnya akan dikelola dari halaman ini.",
  },
  {
    slug: "dokumen",
    title: "Dokumen Jamaah",
    eyebrow: "KELENGKAPAN DOKUMEN",
    description: "Pantau kelengkapan, verifikasi, dan riwayat dokumen setiap jamaah dalam satu tempat.",
  },
  {
    slug: "keberangkatan",
    title: "Keberangkatan",
    eyebrow: "OPERASIONAL PERJALANAN",
    description: "Kelola jadwal, kuota, paket, serta daftar jamaah untuk setiap keberangkatan.",
  },
  {
    slug: "manifest-room-list",
    title: "Manifest & Room List",
    eyebrow: "KELOMPOK KEBERANGKATAN",
    description: "Susun manifest dan Room List Quad, Triple, atau Double dengan pemisahan jamaah laki-laki dan perempuan.",
  },
  {
    slug: "pembayaran",
    title: "Pembayaran Jamaah",
    eyebrow: "TRANSAKSI JAMAAH",
    description: "Catat DP, cicilan, pelunasan, potongan, refund, dan piutang setiap jamaah.",
  },
  {
    slug: "invoice-kwitansi",
    title: "Invoice & Kwitansi",
    eyebrow: "DOKUMEN TRANSAKSI",
    description: "Terbitkan invoice dan kwitansi dengan penomoran berurutan yang tercatat otomatis.",
  },
  {
    slug: "keuangan",
    title: "Kas & Keuangan",
    eyebrow: "KEUANGAN INTERNAL",
    description: "Kelola kas masuk, kas keluar, piutang, biaya, dan estimasi laba setiap paket.",
  },
  {
    slug: "agen-referral",
    title: "Agen & Referral",
    eyebrow: "PEMASARAN AGEN",
    description: "Kelola agen, link referral, sumber pendaftaran, perhitungan komisi, dan status pembayarannya.",
  },
  {
    slug: "stok",
    title: "Stok Perlengkapan",
    eyebrow: "LOGISTIK UMRAH",
    description: "Pantau stok masuk, stok keluar, dan distribusi perlengkapan kepada jamaah.",
  },
  {
    slug: "laporan",
    title: "Pusat Laporan",
    eyebrow: "REKAP BISNIS",
    description: "Buka dan ekspor laporan jamaah, paket, transaksi, keuangan, agen, dan persediaan per periode.",
  },
  {
    slug: "pengaturan",
    title: "Pengaturan Internal",
    eyebrow: "PENGATURAN",
    description: "Atur identitas perusahaan, DP, batas pelunasan, rekening, dan penandatangan dokumen.",
  },
] as const;

export type ManagementModule = (typeof managementModules)[number];

export function getManagementModule(slug: string) {
  return managementModules.find((module) => module.slug === slug);
}

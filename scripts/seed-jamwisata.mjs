import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL belum tersedia. Isi .env.local sebelum menjalankan seed.");
}

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";

const programs = [
  ["umrah-premium-9-hari", "Umrah Premium 9 Hari", "Reguler", "Program pilihan", `${assetRoot}/umrah-1.png`, "15 Agustus 2026", "9 hari", "Garuda Indonesia", "Pullman Zamzam Makkah", "Concorde Al Madinah", "Kapasitas dikonfirmasi tim", "Pembimbing profesional", 33900000, ["Makkah", "Madinah"], "Program ibadah dengan akomodasi pilihan dan pendampingan yang disiapkan sejak manasik hingga kepulangan."],
  ["umrah-plus-turki-eksklusif", "Umrah Plus Turki Eksklusif", "Plus", "Umrah plus", `${assetRoot}/umrah-2.png`, "8 Desember 2026", "Durasi dikonfirmasi tim", "Saudia", "Nada Ajyad Makkah", "Jawharat Al Rasheed", "Kapasitas dikonfirmasi tim", "Pembimbing profesional", 36900000, ["Makkah", "Madinah", "Istanbul"], "Perjalanan Umrah yang dilanjutkan dengan pengalaman wisata halal di Turki dalam satu pendampingan terarah."],
  ["umrah-awal-tahun-2027", "Umrah Awal Tahun 2027", "Family", "Awal tahun", `${assetRoot}/umrah-3.png`, "23 Januari 2027", "Durasi dikonfirmasi tim", "Garuda Indonesia", "Pullman Zamzam Makkah", "Concorde Al Madinah", "Kapasitas dikonfirmasi tim", "Pendamping jamaah", 33900000, ["Makkah", "Madinah"], "Pilihan perjalanan awal tahun untuk jamaah dan keluarga yang menginginkan persiapan lebih tenang."],
];

const collections = {
  planner_options: [
    { id: "first", title: "Umrah pertama kali", description: "Bimbingan yang jelas untuk setiap tahapan." },
    { id: "parents", title: "Bersama orang tua", description: "Kenyamanan dan ritme perjalanan menjadi prioritas." },
    { id: "plus", title: "Umrah plus / wisata", description: "Ibadah yang dilengkapi perjalanan halal." },
    { id: "private", title: "Private / khusus", description: "Perjalanan lebih personal dan fleksibel." },
    { id: "family", title: "Bersama keluarga", description: "Program yang ramah bagi kebutuhan keluarga." },
    { id: "learning", title: "Masih belajar", description: "Pahami pilihan sebelum menentukan program." },
  ],
  destinations: [
    { name: "Turki", image: `${assetRoot}/tour-1.png`, label: "Sejarah & peradaban" },
    { name: "Jepang", image: `${assetRoot}/tour-2.png`, label: "Budaya & perjalanan halal" },
    { name: "Eropa Barat", image: `${assetRoot}/tour-3.png`, label: "Rangkaian destinasi pilihan" },
  ],
  gallery: [
    { image: `${assetRoot}/about.jpg`, alt: "Suasana jamaah di Masjidil Haram" },
    { image: `${assetRoot}/hero.jpg`, alt: "Perjalanan jamaah menuju Tanah Suci" },
    { image: `${assetRoot}/umrah-1.png`, alt: "Suasana ibadah di Masjidil Haram" },
    { image: `${assetRoot}/tour-1.png`, alt: "Dokumentasi perjalanan halal Jam Wisata" },
    { image: `${assetRoot}/promo.jpg`, alt: "Momen ibadah di sekitar Ka'bah" },
  ],
  articles: [
    { title: "Persiapan yang Perlu Dilakukan Sebelum Berangkat Umrah", category: "Persiapan", date: "Panduan Jam Wisata", image: `${assetRoot}/article-1.webp` },
    { title: "Memahami Manasik agar Ibadah Lebih Tenang dan Terarah", category: "Manasik", date: "Panduan Jam Wisata", image: `${assetRoot}/article-2.jpg` },
    { title: "Hal yang Perlu Diperhatikan Saat Mendampingi Orang Tua", category: "Tips perjalanan", date: "Panduan Jam Wisata", image: `${assetRoot}/article-3.jpg` },
  ],
  faqs: [
    ["Apa saja yang termasuk dalam paket Umrah?", "Cakupan setiap program berbeda. Rincian penerbangan, hotel, transportasi, konsumsi, visa, perlengkapan, dan pendampingan tersedia pada halaman program dan akan dijelaskan kembali oleh tim kami."],
    ["Dokumen apa yang perlu disiapkan?", "Umumnya jamaah menyiapkan paspor, dokumen identitas, foto, dan dokumen kesehatan sesuai ketentuan yang berlaku. Tim Jam Wisata akan memberikan daftar terbaru setelah Anda memilih program."],
    ["Apakah ada manasik sebelum keberangkatan?", "Ya. Jadwal dan format manasik mengikuti program keberangkatan agar jamaah memiliki bekal ibadah dan informasi perjalanan yang memadai."],
    ["Bagaimana jika saya berangkat bersama orang tua?", "Sampaikan kondisi dan kebutuhan orang tua saat konsultasi. Tim kami akan membantu menilai pilihan program, ritme perjalanan, hotel, dan dukungan yang paling sesuai."],
    ["Apakah tersedia perjalanan private?", "Kebutuhan private atau rombongan khusus dapat dikonsultasikan dengan tim. Rekomendasi akan disesuaikan dengan jumlah peserta, waktu, dan kebutuhan perjalanan."],
  ],
  testimonial_videos: [
    { id: "8vJae3mZooI", title: "Ust. Mega & Ust. Ahsan", subtitle: "Cerita jamaah Jam Wisata" },
    { id: "W6DJ7sZAiso", title: "Pengalaman jamaah", subtitle: "Perjalanan bersama Jam Wisata" },
    { id: "KivXY7zX4JU", title: "Keluarga Ibu Della", subtitle: "Cerita perjalanan keluarga" },
    { id: "K3qRoKJGYzc", title: "Keluarga Ibu Inggit", subtitle: "Jamaah asal Bandung" },
  ],
};

const pool = new Pool({ connectionString: databaseUrl, max: 1 });
const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query(`
    CREATE TABLE IF NOT EXISTS jw_programs (
      slug text PRIMARY KEY,
      name text NOT NULL,
      category text NOT NULL CHECK (category IN ('Reguler', 'Plus', 'Family', 'Private')),
      badge text,
      image text NOT NULL,
      departure_date text NOT NULL,
      duration text NOT NULL,
      airline text NOT NULL,
      makkah_hotel text NOT NULL,
      madinah_hotel text NOT NULL,
      capacity text NOT NULL,
      mentor text NOT NULL,
      price integer NOT NULL CHECK (price >= 0),
      destinations jsonb NOT NULL DEFAULT '[]'::jsonb,
      summary text NOT NULL,
      sort_order integer NOT NULL DEFAULT 0,
      is_published boolean NOT NULL DEFAULT true,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS jw_content (
      key text PRIMARY KEY,
      value jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  for (const [index, values] of programs.entries()) {
    await client.query(
      `INSERT INTO jw_programs (slug,name,category,badge,image,departure_date,duration,airline,makkah_hotel,madinah_hotel,capacity,mentor,price,destinations,summary,sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15,$16)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,category=EXCLUDED.category,badge=EXCLUDED.badge,image=EXCLUDED.image,departure_date=EXCLUDED.departure_date,duration=EXCLUDED.duration,airline=EXCLUDED.airline,makkah_hotel=EXCLUDED.makkah_hotel,madinah_hotel=EXCLUDED.madinah_hotel,capacity=EXCLUDED.capacity,mentor=EXCLUDED.mentor,price=EXCLUDED.price,destinations=EXCLUDED.destinations,summary=EXCLUDED.summary,sort_order=EXCLUDED.sort_order,updated_at=now()`,
      [...values.slice(0, 13), JSON.stringify(values[13]), values[14], index],
    );
  }

  for (const [key, value] of Object.entries(collections)) {
    await client.query(
      `INSERT INTO jw_content (key,value) VALUES ($1,$2::jsonb)
       ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()`,
      [key, JSON.stringify(value)],
    );
  }
  await client.query("COMMIT");
  console.log(`Seed selesai: ${programs.length} program dan ${Object.keys(collections).length} koleksi konten.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}

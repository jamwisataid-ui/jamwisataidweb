import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { renderTransactionPdf, renderTransactionPng, type TransactionPdfSnapshot } from "../src/lib/management/document-renderer";

const label = process.argv[2] || "after";
const outputDirectory = join(process.cwd(), "artifacts", "document-layout");

const common = {
  issuedAt: "2026-09-30T10:00:00+07:00",
  customer: {
    name: "Muhammad Rizky Fadhlurrahman Al-Hafizh bin Abdul Muthalib Pratama",
    whatsapp: "081234567890",
  },
  accounts: [
    { bankName: "Bank Syariah Indonesia", accountNumber: "712345678901234567", accountHolder: "PT Jaris Ammar Madani Wisata" },
  ],
  company: {
    name: "Jam Wisata",
    address: "Jl. Cibangkon No. 28A Gatot Subroto Bandung",
    phone: "0819.1050.2123",
    email: "jamwisata99@gmail.com",
    signerName: "Atie Supriati Nurhayati Ramadhani",
    signerTitle: "Manajer Keuangan dan Administrasi Perjalanan",
  },
};

const invoice: TransactionPdfSnapshot = {
  ...common,
  kind: "invoice",
  number: "INV/JAMWISATA/UMRAH-PREMIUM/2026/00000000012345",
  program: {
    packageName: "Umrah Premium Keluarga Bintang Lima Plus Turki",
    departure: "30 Desember 2026",
    makkahHotel: "Pullman Zamzam Makkah Hotel & Convention",
    madinahHotel: "Anwar Al Madinah Mövenpick Hotel",
    airline: "Saudia Airlines penerbangan langsung Jakarta–Jeddah",
  },
  items: [
    {
      description: "Pelunasan Paket Umrah Premium Keluarga Keberangkatan 30 Desember 2026 termasuk akomodasi, penerbangan, transportasi, dan perlengkapan jamaah",
      qty: 12,
      unitPrice: 98_765_432,
      total: 1_185_185_184,
    },
  ],
  total: 1_185_185_184,
};

const receipt: TransactionPdfSnapshot = {
  ...common,
  kind: "receipt",
  number: "KWT/JAMWISATA/TRANSFER-BANK/2026/00000000098765",
  invoiceNumber: invoice.number,
  method: "Transfer Antarbank melalui Virtual Account Perusahaan",
  items: [
    {
      description: "Pembayaran pelunasan Paket Umrah Premium Keluarga untuk dua belas jamaah termasuk biaya akomodasi dan transportasi selama perjalanan",
      qty: 12,
      unitPrice: 98_765_432,
      total: 1_185_185_184,
    },
  ],
  total: 1_185_185_184,
};

async function main() {
  await mkdir(outputDirectory, { recursive: true });
  for (const document of [invoice, receipt]) {
    const [png, pdf] = await Promise.all([renderTransactionPng(document), renderTransactionPdf(document)]);
    const name = document.kind === "receipt" ? "kwitansi" : "invoice";
    await Promise.all([
      writeFile(join(outputDirectory, `${label}-${name}.png`), png),
      writeFile(join(outputDirectory, `${label}-${name}.pdf`), pdf),
    ]);
  }

  console.log(`Generated ${label} invoice and kwitansi samples in ${outputDirectory}`);
}

void main();

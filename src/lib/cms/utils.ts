export function formatRupiahInput(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "";
  const clean = String(value).replace(/\D/g, "");
  if (!clean) return "";
  const num = Number(clean);
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("id-ID").format(num);
}

export function cleanRupiahInput(value: string | undefined | null): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

function angkaKeTeks(n: number): string {
  const satuan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  if (n < 12) return satuan[n];
  if (n < 20) return `${angkaKeTeks(n - 10)} Belas`;
  if (n < 100) return `${satuan[Math.floor(n / 10)]} Puluh ${angkaKeTeks(n % 10)}`.trim();
  if (n < 200) return `Seratus ${angkaKeTeks(n - 100)}`.trim();
  if (n < 1000) return `${satuan[Math.floor(n / 100)]} Ratus ${angkaKeTeks(n % 100)}`.trim();
  if (n < 2000) return `Seribu ${angkaKeTeks(n - 1000)}`.trim();
  if (n < 1000000) return `${angkaKeTeks(Math.floor(n / 1000))} Ribu ${angkaKeTeks(n % 1000)}`.trim();
  if (n < 1000000000) return `${angkaKeTeks(Math.floor(n / 1000000))} Juta ${angkaKeTeks(n % 1000000)}`.trim();
  if (n < 1000000000000) return `${angkaKeTeks(Math.floor(n / 1000000000))} Miliar ${angkaKeTeks(n % 1000000000)}`.trim();
  return "";
}

export function terbilangRupiah(value: string | number | undefined | null): string {
  if (!value) return "";
  const clean = String(value).replace(/\D/g, "");
  const num = Number(clean);
  if (!num || isNaN(num)) return "";
  const words = angkaKeTeks(num);
  return words ? `${words} Rupiah` : "";
}

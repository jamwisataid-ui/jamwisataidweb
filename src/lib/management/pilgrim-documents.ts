export const PILGRIM_DOCUMENT_KINDS = [
  "ktp",
  "kk",
  "akta_lahir",
  "buku_nikah",
  "ijazah",
  "paspor",
  "buku_vaksin",
  "other",
] as const;

export type PilgrimDocumentKind = (typeof PILGRIM_DOCUMENT_KINDS)[number];

export const PILGRIM_DOCUMENT_REQUIREMENTS = [
  { kind: "ktp", label: "KTP", note: "Wajib" },
  { kind: "kk", label: "Kartu Keluarga", note: "Wajib" },
  { kind: "akta_lahir", label: "Akta Lahir", note: "Minimal salah satu dokumen pendukung" },
  { kind: "buku_nikah", label: "Buku Nikah", note: "Minimal salah satu dokumen pendukung" },
  { kind: "ijazah", label: "Ijazah", note: "Minimal salah satu dokumen pendukung" },
  { kind: "paspor", label: "Paspor", note: "Lengkapi saat sudah tersedia" },
  { kind: "buku_vaksin", label: "Buku Vaksin", note: "Belum terunggah" },
] as const satisfies ReadonlyArray<{ kind: PilgrimDocumentKind; label: string; note: string }>;

const pilgrimDocumentKindSet = new Set<string>(PILGRIM_DOCUMENT_KINDS);

export function isPilgrimDocumentKind(value: string): value is PilgrimDocumentKind {
  return pilgrimDocumentKindSet.has(value);
}

export function hasMinimumRequiredPilgrimDocuments(kinds: Iterable<string>) {
  const available = new Set(kinds);
  return available.has("ktp")
    && available.has("kk")
    && (available.has("akta_lahir") || available.has("buku_nikah") || available.has("ijazah"));
}

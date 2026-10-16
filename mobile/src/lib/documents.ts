import type { Document } from "@/types";

export const pilgrimDocumentKinds = [
  { value: "ktp", label: "KTP", note: "Wajib" },
  { value: "kk", label: "Kartu Keluarga", note: "Wajib" },
  { value: "paspor", label: "Paspor", note: "Lengkapi saat sudah tersedia" },
  { value: "buku_vaksin", label: "Buku Vaksin", note: "Dokumen tambahan" },
  { value: "akta_lahir", label: "Akta Lahir", note: "Minimal salah satu dokumen pendukung" },
  { value: "buku_nikah", label: "Buku Nikah", note: "Minimal salah satu dokumen pendukung" },
  { value: "ijazah", label: "Ijazah", note: "Minimal salah satu dokumen pendukung" },
] as const;

export type PilgrimDocumentKind = (typeof pilgrimDocumentKinds)[number]["value"];

export function documentLabel(kind: string) {
  return pilgrimDocumentKinds.find((item) => item.value === kind)?.label ?? "Dokumen lain";
}

export function latestDocumentsByKind(documents: Document[] = []) {
  const latest = new Map<string, Document>();
  [...documents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .forEach((document) => {
      if (!latest.has(document.kind)) latest.set(document.kind, document);
    });
  return latest;
}

export function documentStatus(document?: Document) {
  if (!document) return { label: "Belum diunggah", tone: "empty" as const };
  if (document.reviewStatus === "verified") return { label: "Terverifikasi", tone: "verified" as const };
  if (document.reviewStatus === "rejected") return { label: "Perlu diperbaiki", tone: "rejected" as const };
  return { label: "Menunggu pemeriksaan", tone: "pending" as const };
}


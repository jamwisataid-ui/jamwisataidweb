import { describe, expect, it } from "vitest";

import {
  hasMinimumRequiredPilgrimDocuments,
  isPilgrimDocumentKind,
  PILGRIM_DOCUMENT_REQUIREMENTS,
} from "../src/lib/management/pilgrim-documents";

describe("pilgrim document configuration", () => {
  it("places Buku Vaksin after Paspor and exposes its empty state", () => {
    const passportIndex = PILGRIM_DOCUMENT_REQUIREMENTS.findIndex(({ kind }) => kind === "paspor");
    expect(PILGRIM_DOCUMENT_REQUIREMENTS[passportIndex + 1]).toEqual({
      kind: "buku_vaksin",
      label: "Buku Vaksin",
      note: "Belum terunggah",
    });
    expect(isPilgrimDocumentKind("buku_vaksin")).toBe(true);
  });

  it("keeps Buku Vaksin outside the minimum supporting-document rule", () => {
    expect(hasMinimumRequiredPilgrimDocuments(["ktp", "kk", "buku_vaksin"])).toBe(false);
    expect(hasMinimumRequiredPilgrimDocuments(["ktp", "kk", "akta_lahir"])).toBe(true);
    expect(hasMinimumRequiredPilgrimDocuments(["ktp", "kk", "buku_nikah", "buku_vaksin"])).toBe(true);
    expect(hasMinimumRequiredPilgrimDocuments(["ktp", "kk", "ijazah"])).toBe(true);
  });

  it("rejects unknown kinds while retaining legacy kinds", () => {
    expect(isPilgrimDocumentKind("paspor")).toBe(true);
    expect(isPilgrimDocumentKind("other")).toBe(true);
    expect(isPilgrimDocumentKind("unknown")).toBe(false);
  });
});

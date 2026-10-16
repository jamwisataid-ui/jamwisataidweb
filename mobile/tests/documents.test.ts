import { describe, expect, it } from "vitest";

import { documentLabel, documentStatus, latestDocumentsByKind } from "../src/lib/documents";
import type { Document } from "../src/types";

const document = (id: string, kind: string, createdAt: string, reviewStatus = "pending"): Document => ({ id, kind, createdAt, reviewStatus, originalName: `${id}.pdf`, mimeType: "application/pdf", sizeBytes: 100 });

describe("pilgrim documents", () => {
  it("keeps the newest file as the active replacement", () => {
    const latest = latestDocumentsByKind([
      document("old", "paspor", "2026-01-01T00:00:00.000Z"),
      document("new", "paspor", "2026-02-01T00:00:00.000Z"),
      document("vaccine", "buku_vaksin", "2026-01-15T00:00:00.000Z"),
    ]);
    expect(latest.get("paspor")?.id).toBe("new");
    expect(latest.get("buku_vaksin")?.id).toBe("vaccine");
  });

  it("keeps vaccine book independent from supporting-document rules", () => {
    expect(documentLabel("buku_vaksin")).toBe("Buku Vaksin");
    expect(documentStatus()).toEqual({ label: "Belum diunggah", tone: "empty" });
  });

  it("maps review states to user-friendly labels", () => {
    expect(documentStatus(document("a", "ktp", "2026-01-01", "verified")).label).toBe("Terverifikasi");
    expect(documentStatus(document("b", "ktp", "2026-01-01", "rejected")).label).toBe("Perlu diperbaiki");
  });
});


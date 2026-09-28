import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createPrivateDownloadUrl: vi.fn(),
  deletePrivateObject: vi.fn(),
  insertError: null as Error | null,
  inserted: [] as Array<Record<string, unknown>>,
  pilgrimDocument: null as Record<string, unknown> | null,
  putPrivateObject: vi.fn(),
  validatePrivateFile: vi.fn(),
}));

vi.mock("drizzle-orm", () => ({ eq: vi.fn(() => ({ type: "where" })) }));

vi.mock("@/db/schema", () => ({
  auditLogs: { table: "audit_logs" },
  pilgrimDocuments: { id: { column: "id" }, table: "pilgrim_documents" },
  pilgrims: { id: { column: "id" }, table: "pilgrims" },
}));

vi.mock("@/lib/management/pilgrim-documents", () => ({
  isPilgrimDocumentKind: (value: string) => ["ktp", "kk", "akta_lahir", "buku_nikah", "ijazah", "paspor", "buku_vaksin", "other"].includes(value),
}));

vi.mock("@/lib/admin-session", () => ({
  requireAdminSession: vi.fn().mockResolvedValue({ user: { id: "admin-1" } }),
}));

vi.mock("@/lib/management/storage", () => ({
  createPrivateDownloadUrl: mocks.createPrivateDownloadUrl,
  deletePrivateObject: mocks.deletePrivateObject,
  privateObjectKey: vi.fn(() => "private/pilgrims/pilgrim-1/vaccine.pdf"),
  putPrivateObject: mocks.putPrivateObject,
  validatePrivateFile: mocks.validatePrivateFile,
}));

vi.mock("@/db", () => ({
  requireDatabase: () => ({
    query: {
      pilgrimDocuments: { findFirst: vi.fn().mockResolvedValue(mocks.pilgrimDocument) },
      pilgrims: { findFirst: vi.fn().mockResolvedValue({ id: "pilgrim-1", fullName: "Jamaah Satu" }) },
    },
    insert: vi.fn(() => ({
      values: vi.fn((values: Record<string, unknown>) => {
        mocks.inserted.push(values);
        if (values.entityType === "pilgrim_document") return Promise.resolve();
        return {
          returning: vi.fn(() => mocks.insertError
            ? Promise.reject(mocks.insertError)
            : Promise.resolve([{ id: `document-${mocks.inserted.length}`, ...values }])),
        };
      }),
    })),
  }),
}));

import { GET } from "../src/app/api/admin/management/documents/[id]/route";
import { POST } from "../src/app/api/admin/management/documents/route";

function vaccineBookUpload(fileName: string) {
  const formData = new FormData();
  formData.set("pilgrimId", "pilgrim-1");
  formData.set("kind", "buku_vaksin");
  formData.set("file", new File(["%PDF-1.7 vaccine"], fileName, { type: "application/pdf" }));
  return new Request("http://localhost/api/admin/management/documents", { method: "POST", body: formData });
}

describe("pilgrim Buku Vaksin routes", () => {
  beforeEach(() => {
    mocks.createPrivateDownloadUrl.mockReset();
    mocks.deletePrivateObject.mockReset();
    mocks.deletePrivateObject.mockResolvedValue(undefined);
    mocks.insertError = null;
    mocks.inserted.length = 0;
    mocks.pilgrimDocument = null;
    mocks.putPrivateObject.mockReset();
    mocks.validatePrivateFile.mockReset();
  });

  it("uploads Buku Vaksin and persists it against the selected pilgrim", async () => {
    const response = await POST(vaccineBookUpload("buku-vaksin.pdf"));

    expect(response.status).toBe(200);
    expect(mocks.putPrivateObject).toHaveBeenCalledOnce();
    expect(mocks.inserted[0]).toMatchObject({
      pilgrimId: "pilgrim-1",
      kind: "buku_vaksin",
      originalName: "buku-vaksin.pdf",
      objectKey: "private/pilgrims/pilgrim-1/vaccine.pdf",
    });
  });

  it("accepts a replacement upload for the same pilgrim and document kind", async () => {
    await POST(vaccineBookUpload("buku-vaksin-lama.pdf"));
    await POST(vaccineBookUpload("buku-vaksin-baru.pdf"));

    const versions = mocks.inserted.filter((value) => value.kind === "buku_vaksin");
    expect(versions).toHaveLength(2);
    expect(versions.map((value) => value.originalName)).toEqual(["buku-vaksin-lama.pdf", "buku-vaksin-baru.pdf"]);
    expect(versions.every((value) => value.pilgrimId === "pilgrim-1")).toBe(true);
  });

  it("opens preview inline", async () => {
    mocks.pilgrimDocument = { id: "document-1", kind: "buku_vaksin", originalName: "buku-vaksin.pdf", objectKey: "private/key.pdf" };
    mocks.createPrivateDownloadUrl.mockResolvedValue("https://files.example/preview");

    const response = await GET(new Request("http://localhost/api/admin/management/documents/document-1?mode=preview"), { params: Promise.resolve({ id: "document-1" }) });

    expect(response.status).toBe(307);
    expect(mocks.createPrivateDownloadUrl).toHaveBeenCalledWith("private/key.pdf", undefined);
  });

  it("downloads with the original file name", async () => {
    mocks.pilgrimDocument = { id: "document-1", kind: "buku_vaksin", originalName: "buku-vaksin.pdf", objectKey: "private/key.pdf" };
    mocks.createPrivateDownloadUrl.mockResolvedValue("https://files.example/download");

    const response = await GET(new Request("http://localhost/api/admin/management/documents/document-1"), { params: Promise.resolve({ id: "document-1" }) });

    expect(response.status).toBe(307);
    expect(mocks.createPrivateDownloadUrl).toHaveBeenCalledWith("private/key.pdf", "buku-vaksin.pdf");
  });

  it("keeps database details out of upload error responses", async () => {
    const technicalError = new Error('invalid input value for enum pilgrim_document_kind: "buku_vaksin"');
    mocks.insertError = technicalError;
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(vaccineBookUpload("buku-vaksin.pdf"));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({ error: "Dokumen gagal diunggah. Silakan coba lagi." });
    expect(JSON.stringify(payload)).not.toContain("pilgrim_document_kind");
    expect(mocks.deletePrivateObject).toHaveBeenCalledWith("private/pilgrims/pilgrim-1/vaccine.pdf");
    expect(consoleError).toHaveBeenCalledWith("Pilgrim document upload failed:", technicalError);
    consoleError.mockRestore();
  });
});

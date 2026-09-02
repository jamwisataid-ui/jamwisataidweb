import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

let validatePrivateFile: typeof import("../src/lib/management/storage").validatePrivateFile;

beforeAll(async () => {
  ({ validatePrivateFile } = await import("../src/lib/management/storage"));
});

describe("private document validation", () => {
  it.each([
    ["image/jpeg", [0xff, 0xd8, 0xff, 0x00]],
    ["image/png", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    ["image/webp", [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]],
    ["application/pdf", [0x25, 0x50, 0x44, 0x46, 0x2d]],
  ])("accepts real %s signatures", (mimeType, bytes) => {
    expect(() => validatePrivateFile(Uint8Array.from(bytes), mimeType, bytes.length)).not.toThrow();
  });

  it("rejects a renamed executable even if its MIME says PDF", () => {
    expect(() => validatePrivateFile(Uint8Array.from([0x4d, 0x5a, 0x90, 0x00]), "application/pdf", 4)).toThrow("Isi file tidak sesuai");
  });
});

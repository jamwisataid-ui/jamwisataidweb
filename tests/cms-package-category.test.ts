import { describe, expect, it } from "vitest";

import { filterPackagesByCategory, packageBasePath, packagePublicPath } from "../src/lib/cms/package-category";

describe("kategori paket CMS", () => {
  const packages = [
    { slug: "umroh-reguler", category: "umrah" as const },
    { slug: "turki", category: "halal-tour" as const },
  ];

  it("membuat URL publik sesuai kategori", () => {
    expect(packagePublicPath(packages[0])).toBe("/paket-umroh/umroh-reguler");
    expect(packagePublicPath(packages[1])).toBe("/paket-wisata/turki");
    expect(packageBasePath("umrah")).toBe("/paket-umroh");
  });

  it("memisahkan daftar Umroh dan Wisata", () => {
    expect(filterPackagesByCategory(packages, "umrah")).toEqual([packages[0]]);
    expect(filterPackagesByCategory(packages, "halal-tour")).toEqual([packages[1]]);
  });
});

import type { TravelPackage } from "@/types/jamwisata";

export type ManagedPackageCategory = "umrah" | "halal-tour";

export function packageBasePath(category: TravelPackage["category"]) {
  return category === "halal-tour" ? "/paket-wisata" : "/paket-umroh";
}

export function packagePublicPath(pkg: Pick<TravelPackage, "category" | "slug">) {
  return `${packageBasePath(pkg.category)}/${pkg.slug}`;
}

export function filterPackagesByCategory<T extends Pick<TravelPackage, "category">>(items: T[], category: ManagedPackageCategory) {
  return items.filter((item) => item.category === category);
}

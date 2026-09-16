import type { Metadata } from "next";

import {
  generatePackageMetadata,
  renderPackageDetail,
  type PackageDetailProps,
} from "@/app/paket-umroh/[slug]/page";
import { getPublishedPackagesByCategory } from "@/lib/cms/public";

export async function generateStaticParams() {
  const packages = await getPublishedPackagesByCategory("halal-tour");
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata(props: PackageDetailProps): Promise<Metadata> {
  return generatePackageMetadata(props, "halal-tour");
}

export default async function TourPackageDetailPage(props: PackageDetailProps) {
  return renderPackageDetail(props, "halal-tour");
}

import { getPublishedPackages } from "@/lib/cms/public";
import { mobileData, mobileError, MobileApiError } from "@/lib/mobile/api";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const item = (await getPublishedPackages()).find((candidate) => candidate.slug === slug || candidate.id === slug);
    if (!item) throw new MobileApiError(404, "PACKAGE_NOT_FOUND", "Paket tidak ditemukan.");
    return mobileData(item, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    return mobileError(error, "package-detail");
  }
}

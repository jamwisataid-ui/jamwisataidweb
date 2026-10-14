import { getPublishedPackages } from "@/lib/cms/public";
import { mobileData, mobileError } from "@/lib/mobile/api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim().toLowerCase();
    const category = url.searchParams.get("category");
    const packages = (await getPublishedPackages()).filter((item) => (!query || `${item.name} ${item.destination?.join(" ") ?? ""}`.toLowerCase().includes(query)) && (!category || item.category === category));
    return mobileData(packages);
  } catch (error) {
    return mobileError(error, "packages-list");
  }
}

import { HppMasterPage } from "@/components/admin/HppPages";
import { getHppContext } from "@/lib/management/hpp-data";

export const metadata = { title: "Master Harga HPP" };

export default async function HppMasterPricePage() {
  return <HppMasterPage data={await getHppContext()} />;
}

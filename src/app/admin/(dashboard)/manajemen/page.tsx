import { ManagementWorkspace } from "@/components/admin/ManagementWorkspace";
import { getManagementContext } from "@/lib/management/data";

export default async function ManagementDashboardPage() {
  return <ManagementWorkspace data={await getManagementContext()} />;
}

import { Toaster } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  return <div className="admin-shell"><AdminSidebar name={session.user.name} email={session.user.email} /><main className="admin-main">{children}</main><Toaster position="top-right" richColors /></div>;
}

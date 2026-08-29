import Link from "next/link";
import { ArrowLeft, Inbox, Pencil, Plus, Upload } from "lucide-react";

type PageAction = { href: string; label: string; secondary?: boolean; icon?: "plus" | "edit" | "upload" };

function ActionIcon({ icon = "plus" }: { icon?: PageAction["icon"] }) {
  if (icon === "edit") return <Pencil aria-hidden />;
  if (icon === "upload") return <Upload aria-hidden />;
  return <Plus aria-hidden />;
}

export function AdminPageHeader({ eyebrow, title, description, action, actions, backHref }: { eyebrow: string; title: string; description: string; action?: PageAction; actions?: PageAction[]; backHref?: string }) {
  return <header className="admin-page-header">
    <div>
      {backHref ? <Link className="admin-back-link" href={backHref}><ArrowLeft aria-hidden /> Kembali</Link> : null}
      <p className="admin-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    {actions?.length ? <div className="admin-page-actions">{actions.map((item) => <Link className={item.secondary ? "admin-secondary-button" : "admin-primary-button"} href={item.href} key={item.href}><ActionIcon icon={item.icon} />{item.label}</Link>)}</div> : action ? <Link className="admin-primary-button" href={action.href}><ActionIcon icon={action.icon} />{action.label}</Link> : null}
  </header>;
}

export function AdminStatus({ status }: { status: string }) {
  const label = { published: "Tampil di website", draft: "Belum tampil", archived: "Disimpan" }[status] ?? status;
  return <span className={`admin-status ${status}`}>{label}</span>;
}

export function AdminEmptyState({ title, description, href, action }: { title: string; description: string; href: string; action: string }) {
  return <div className="admin-empty-state"><span><Inbox aria-hidden /></span><h2>{title}</h2><p>{description}</p><Link className="admin-secondary-button" href={href}><Plus aria-hidden />{action}</Link></div>;
}

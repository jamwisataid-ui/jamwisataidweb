import Link from "next/link";
import { ArrowLeft, Inbox, Plus } from "lucide-react";

export function AdminPageHeader({ eyebrow, title, description, action, backHref }: { eyebrow: string; title: string; description: string; action?: { href: string; label: string }; backHref?: string }) {
  return <header className="admin-page-header">
    <div>
      {backHref ? <Link className="admin-back-link" href={backHref}><ArrowLeft aria-hidden /> Kembali</Link> : null}
      <p className="admin-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    {action ? <Link className="admin-primary-button" href={action.href}><Plus aria-hidden />{action.label}</Link> : null}
  </header>;
}

export function AdminStatus({ status }: { status: string }) {
  const label = { published: "Tampil di website", draft: "Belum tampil", archived: "Disimpan" }[status] ?? status;
  return <span className={`admin-status ${status}`}>{label}</span>;
}

export function AdminEmptyState({ title, description, href, action }: { title: string; description: string; href: string; action: string }) {
  return <div className="admin-empty-state"><span><Inbox aria-hidden /></span><h2>{title}</h2><p>{description}</p><Link className="admin-secondary-button" href={href}><Plus aria-hidden />{action}</Link></div>;
}

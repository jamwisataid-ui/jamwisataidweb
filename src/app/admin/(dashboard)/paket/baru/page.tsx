import { randomUUID } from "node:crypto";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { PackageForm } from "@/components/admin/PackageForm";
export default function NewPackagePage() { return <><AdminPageHeader eyebrow="PAKET BARU" title="Tambah paket Umrah" description="Isi informasi utama paket. Pengaturan teknis dibuat otomatis oleh sistem." backHref="/admin/paket" /><PackageForm values={{ id: randomUUID() }} /></>; }

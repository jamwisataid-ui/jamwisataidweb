import { randomUUID } from "node:crypto";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { PackageForm } from "@/components/admin/PackageForm";
export default function NewPackagePage() { return <><AdminPageHeader eyebrow="Paket baru" title="Tambah paket homepage" description="Isi informasi yang tampil pada kartu paket. Pengaturan teknis dibuat otomatis oleh sistem." backHref="/admin/paket" /><PackageForm values={{ id: randomUUID() }} /></>; }

import { AdminPageHeader } from "@/components/admin/AdminUi";
import { PackageForm } from "@/components/admin/PackageForm";
export default function NewPackagePage() { return <><AdminPageHeader eyebrow="Paket baru" title="Susun program perjalanan" description="Lengkapi informasi dengan teliti lalu simpan sebagai draft sampai siap diterbitkan." backHref="/admin/paket" /><PackageForm /></>; }

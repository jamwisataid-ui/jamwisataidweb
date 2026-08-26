"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteArticleAction, deleteEntryAction, deletePackageAction } from "@/lib/cms/actions";

interface DeleteButtonProps {
  id: string;
  name: string;
  type: "package" | "article" | "entry";
  entryType?: string;
  variant?: "table" | "form";
  className?: string;
}

export function DeleteButton({
  id,
  name,
  type,
  entryType,
  variant = "table",
  className = "",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    const itemLabel = type === "package" ? "paket" : type === "article" ? "artikel" : "konten";
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus ${itemLabel} "${name}"?\n\nPerhatian: Data yang sudah dihapus tidak dapat dikembalikan lagi.`
    );

    if (!confirmed) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", id);
      if (entryType) formData.append("type", entryType);

      let result;
      if (type === "package") {
        result = await deletePackageAction(formData);
      } else if (type === "article") {
        result = await deleteArticleAction(formData);
      } else {
        result = await deleteEntryAction(formData);
      }

      if (result.ok) {
        toast.success(result.message);
        if (result.redirectTo) {
          router.push(result.redirectTo);
          router.refresh();
        }
      } else {
        toast.error(result.message || `Gagal menghapus ${itemLabel}.`);
      }
    });
  };

  if (variant === "form") {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className={`admin-danger-button ${className}`}
        title="Hapus data ini secara permanen"
      >
        {isPending ? (
          <>
            <Loader2 className="admin-spinner" style={{ width: 14, height: 14, marginRight: 6, display: "inline-block" }} />
            Menghapus...
          </>
        ) : (
          <>
            <Trash2 style={{ width: 14, height: 14, marginRight: 6, display: "inline-block" }} />
            Hapus {type === "package" ? "paket ini" : type === "article" ? "artikel ini" : "konten ini"}
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={`admin-table-delete-btn ${className}`}
      title={`Hapus ${name}`}
      aria-label={`Hapus ${name}`}
    >
      {isPending ? (
        <Loader2 className="admin-spinner" style={{ width: 14, height: 14 }} />
      ) : (
        <Trash2 style={{ width: 14, height: 14 }} />
      )}
    </button>
  );
}

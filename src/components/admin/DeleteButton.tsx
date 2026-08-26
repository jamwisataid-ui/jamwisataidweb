"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isPending) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending]);

  const itemLabel = type === "package" ? "paket" : type === "article" ? "artikel" : "konten";

  const confirmDelete = () => {
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
        setIsOpen(false);
        if (result.redirectTo) {
          router.push(result.redirectTo);
          router.refresh();
        }
      } else {
        toast.error(result.message || `Gagal menghapus ${itemLabel}.`);
      }
    });
  };

  return (
    <>
      {variant === "form" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`admin-danger-button ${className}`}
          title="Hapus data ini secara permanen"
        >
          <Trash2 style={{ width: 15, height: 15, marginRight: 6, display: "inline-block" }} />
          Hapus {type === "package" ? "paket ini" : type === "article" ? "artikel ini" : "konten ini"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`admin-table-delete-btn ${className}`}
          title={`Hapus ${name}`}
          aria-label={`Hapus ${name}`}
        >
          <Trash2 style={{ width: 15, height: 15 }} />
        </button>
      )}

      {isOpen ? (
        <div
          className="admin-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isPending) {
              setIsOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-delete-title"
        >
          <div className="admin-modal-card">
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => !isPending && setIsOpen(false)}
              disabled={isPending}
              aria-label="Tutup modal"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div className="admin-modal-icon-wrap">
              <AlertTriangle className="admin-modal-icon" />
            </div>

            <h3 id="modal-delete-title" className="admin-modal-title">
              Hapus {itemLabel}?
            </h3>

            <p className="admin-modal-desc">
              Apakah Anda yakin ingin menghapus <strong>&ldquo;{name}&rdquo;</strong>?
            </p>

            <div className="admin-modal-warning-box">
              <span>⚠️ Perhatian:</span> Data yang telah dihapus bersifat permanen dan tidak dapat dipulihkan kembali dari sistem.
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel-btn"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Batal
              </button>
              <button
                type="button"
                className="admin-modal-confirm-btn"
                onClick={confirmDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="admin-spinner" style={{ width: 15, height: 15, marginRight: 6, display: "inline-block" }} />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 style={{ width: 15, height: 15, marginRight: 6, display: "inline-block" }} />
                    Ya, Hapus Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

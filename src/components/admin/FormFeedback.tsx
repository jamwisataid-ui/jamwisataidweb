"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ActionState } from "@/lib/cms/validation";

export function FormFeedback({ state }: { state: ActionState }) {
  const router = useRouter();
  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
    if (state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [router, state]);
  return state.message && !state.ok ? <p className="admin-form-error" role="alert">{state.message}</p> : null;
}

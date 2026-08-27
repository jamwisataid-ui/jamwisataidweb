"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ActionState } from "@/lib/cms/validation";

const defaultFieldLabel = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
const emptyFieldLabels: Record<string, string> = {};

export function FormFeedback({ state, fieldLabels = emptyFieldLabels }: { state: ActionState; fieldLabels?: Record<string, string> }) {
  const router = useRouter();
  const fieldIssues = useMemo(
    () =>
      Object.entries(state.errors ?? {}).flatMap(([key, messages]) =>
        messages.filter(Boolean).map((message) => ({
          key,
          label: fieldLabels[key] ?? defaultFieldLabel(key),
          message,
        }))
      ),
    [fieldLabels, state.errors]
  );

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else {
      const firstIssue = fieldIssues[0];
      toast.error(firstIssue ? `${firstIssue.label}: ${firstIssue.message}` : state.message);
    }
    if (state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [fieldIssues, router, state]);

  if (!state.message || state.ok) return null;

  return (
    <div className="admin-form-error" role="alert">
      <strong>{state.message}</strong>
      {fieldIssues.length ? (
        <ul>
          {fieldIssues.map((issue) => (
            <li key={`${issue.key}-${issue.message}`}>
              <span>{issue.label}</span>
              <small>{issue.message}</small>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

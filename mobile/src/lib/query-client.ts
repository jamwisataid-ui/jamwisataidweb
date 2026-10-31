import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

const ACCOUNT_QUERY_ROOTS = new Set([
  "me",
  "notifications",
  "documents",
  "payments",
  "payment",
  "journey",
  "live-muthowif",
  "muthowif-sessions",
]);

const isAccountQuery = (query: { queryKey: readonly unknown[] }) => ACCOUNT_QUERY_ROOTS.has(String(query.queryKey[0] ?? ""));

export async function clearAccountQueries() {
  await queryClient.cancelQueries({ predicate: isAccountQuery });
  queryClient.removeQueries({ predicate: isAccountQuery });
}

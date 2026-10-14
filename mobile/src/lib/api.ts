import { useAuthStore, type Tokens } from "./auth-store";

const API_URL = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/mobile/v1").replace(/\/$/, "");
type ApiEnvelope<T> = { data: T; meta?: Record<string, unknown> };
type ApiFailure = { error?: { code?: string; message?: string; fieldErrors?: Record<string, string[]> } };

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public fieldErrors?: Record<string, string[]>) { super(message); }
}

async function refresh(refreshToken: string) {
  const response = await fetch(`${API_URL}/auth/refresh`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ refreshToken }) });
  if (!response.ok) throw new Error("refresh failed");
  const payload = await response.json() as ApiEnvelope<{ tokens: Tokens }>;
  await useAuthStore.getState().setTokens(payload.data.tokens);
  return payload.data.tokens.accessToken;
}

export async function api<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const tokens = useAuthStore.getState().tokens;
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("content-type", "application/json");
  if (tokens?.accessToken) headers.set("authorization", `Bearer ${tokens.accessToken}`);
  let response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (response.status === 401 && retry && tokens?.refreshToken && !path.startsWith("/auth/")) {
    try { headers.set("authorization", `Bearer ${await refresh(tokens.refreshToken)}`); response = await fetch(`${API_URL}${path}`, { ...init, headers }); }
    catch { await useAuthStore.getState().signOut(); }
  }
  const payload = await response.json().catch(() => ({})) as ApiEnvelope<T> & ApiFailure;
  if (!response.ok) throw new ApiError(response.status, payload.error?.code || "REQUEST_FAILED", payload.error?.message || "Terjadi kendala. Silakan coba lagi.", payload.error?.fieldErrors);
  return payload.data;
}

export { API_URL };

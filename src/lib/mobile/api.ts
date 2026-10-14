import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export class MobileApiError extends Error {
  constructor(public status: number, public code: string, message: string, public fieldErrors?: Record<string, string[]>) {
    super(message);
  }
}

export function mobileData<T>(data: T, init?: ResponseInit & { meta?: Record<string, unknown> }) {
  const { meta, ...responseInit } = init ?? {};
  return NextResponse.json(meta ? { data, meta } : { data }, responseInit);
}

export function mobileError(error: unknown, context: string) {
  if (error instanceof MobileApiError) {
    return NextResponse.json({ error: { code: error.code, message: error.message, fieldErrors: error.fieldErrors } }, { status: error.status });
  }
  console.error(`[mobile-api] ${context}:`, error);
  return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Terjadi kendala. Silakan coba lagi." } }, { status: 500 });
}

export function zodFieldErrors(error: ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}

export function requestMetadata(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return {
    ipAddress: forwardedFor || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent")?.slice(0, 500) || undefined,
  };
}

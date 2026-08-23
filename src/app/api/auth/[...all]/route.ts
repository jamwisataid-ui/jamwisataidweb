import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

const unavailable = () =>
  Response.json(
    { error: "Authentication belum dikonfigurasi." },
    { status: 503 },
  );

const handlers = auth ? toNextJsHandler(auth) : { GET: unavailable, POST: unavailable };

export const { GET, POST } = handlers;

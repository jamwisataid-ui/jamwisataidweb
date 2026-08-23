import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";

import { db } from "@/db";
import {
  accounts,
  authRateLimits,
  sessions,
  users,
  verifications,
} from "@/db/schema";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const auth = db
  ? betterAuth({
      appName: "Jam Wisata CMS",
      baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
      secret: process.env.BETTER_AUTH_SECRET,
      database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
          user: users,
          session: sessions,
          account: accounts,
          verification: verifications,
          rateLimit: authRateLimits,
        },
      }),
      disabledPaths: process.env.ALLOW_ADMIN_BOOTSTRAP === "1" ? [] : ["/sign-up/email"],
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 10,
        sendResetPassword: async ({ user, url }) => {
          if (!resend) {
            console.warn("RESEND_API_KEY belum dikonfigurasi; email reset tidak dikirim.");
            return;
          }

          await resend.emails.send({
            from: process.env.EMAIL_FROM ?? "Jam Wisata <noreply@jamwisata.id>",
            to: user.email,
            subject: "Atur ulang kata sandi Jam Wisata CMS",
            html: `<p>Assalamu’alaikum ${user.name},</p><p>Gunakan tautan berikut untuk mengatur ulang kata sandi CMS Jam Wisata:</p><p><a href="${url}">Atur ulang kata sandi</a></p><p>Jika Anda tidak meminta perubahan ini, abaikan email ini.</p>`,
          });
        },
      },
      user: {
        additionalFields: {
          role: {
            type: "string",
            required: false,
            defaultValue: "admin",
            input: false,
          },
        },
      },
      rateLimit: {
        enabled: true,
        storage: "database",
        modelName: "rateLimit",
        window: 60,
        max: 100,
        customRules: {
          "/sign-in/email": { window: 60, max: 5 },
          "/request-password-reset": { window: 300, max: 3 },
        },
      },
      session: {
        expiresIn: 60 * 60 * 12,
        updateAge: 60 * 60,
      },
      advanced: {
        cookiePrefix: "jamwisata-cms",
        useSecureCookies: process.env.NODE_ENV === "production",
      },
    })
  : null;

export type AuthSession = NonNullable<Awaited<ReturnType<NonNullable<typeof auth>["api"]["getSession"]>>>;

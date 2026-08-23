import { randomBytes } from "node:crypto";
import { config } from "dotenv";

config({ path: ".env.local" });
process.env.ALLOW_ADMIN_BOOTSTRAP = "1";

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...value] = arg.replace(/^--/, "").split("=");
    return [key, value.join("=")];
  }),
);

const email = args.get("email") ?? process.env.ADMIN_EMAIL;
const name = args.get("name") ?? "Administrator Jam Wisata";
const password = args.get("password") ?? randomBytes(18).toString("base64url");

if (!email) {
  throw new Error("Gunakan --email=admin@jamwisata.id atau set ADMIN_EMAIL.");
}

async function main() {
  const { auth } = await import("../src/lib/auth");
  if (!auth) throw new Error("DATABASE_URL belum dikonfigurasi.");

  try {
    await auth.api.signUpEmail({ body: { email: email!, name, password } });
  } catch (error) {
    const code = typeof error === "object" && error && "body" in error
      ? (error.body as { code?: string })?.code
      : undefined;
    if (code !== "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") throw error;

    const [{ eq }, { requireDatabase }, { accounts, users }] = await Promise.all([
      import("drizzle-orm"),
      import("../src/db"),
      import("../src/db/schema"),
    ]);
    const database = requireDatabase();
    const existing = await database.query.users.findFirst({ where: eq(users.email, email!) });
    if (!existing) throw error;
    const existingAccount = await database.query.accounts.findFirst({ where: eq(accounts.userId, existing.id) });
    if (existingAccount) throw new Error("Admin dengan email tersebut sudah aktif.");

    // Memulihkan user tanpa account akibat bootstrap yang terputus di tengah jalan.
    await database.delete(users).where(eq(users.id, existing.id));
    await auth.api.signUpEmail({ body: { email: email!, name, password } });
  }

  console.log("Admin CMS berhasil dibuat.");
  console.log(`Email: ${email}`);
  console.log(`Password sementara: ${password}`);
  console.log("Simpan password ini dengan aman dan segera ganti setelah login.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { randomBytes, randomUUID } from "node:crypto";
import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, "").split("=");
  return [key, value.join("=")];
}));

const email = (args.get("email") ?? process.env.ADMIN_EMAIL)?.trim().toLowerCase();
const name = args.get("name") ?? "Administrator Jam Wisata";
const password = args.get("password") ?? randomBytes(18).toString("base64url");

if (!email) throw new Error("Gunakan --email=admin@jamwisata.id atau set ADMIN_EMAIL.");
if (password.length < 10) throw new Error("Password minimal 10 karakter.");
const adminEmail = email;

async function main() {
  const [{ requireDatabase }, { sessions, users }, { hashPassword }] = await Promise.all([
    import("../src/db"),
    import("../src/db/schema"),
    import("../src/lib/password"),
  ]);
  const database = requireDatabase();
  const passwordHash = await hashPassword(password);
  const existing = await database.query.users.findFirst({ where: eq(users.email, adminEmail) });

  if (existing) {
    await database.update(users).set({ name, role: "admin", passwordHash, updatedAt: new Date() }).where(eq(users.id, existing.id));
    await database.delete(sessions).where(eq(sessions.userId, existing.id));
  } else {
    await database.insert(users).values({ id: randomUUID(), name, email: adminEmail, role: "admin", passwordHash });
  }

  console.log(existing ? "Admin CMS berhasil diperbarui." : "Admin CMS berhasil dibuat.");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password sementara: ${password}`);
  console.log("Simpan password ini dengan aman.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

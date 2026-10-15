CREATE TYPE "public"."mobile_account_role" AS ENUM('jamaah', 'muthowif');
--> statement-breakpoint
ALTER TABLE "mobile_accounts" ALTER COLUMN "pilgrim_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "mobile_accounts" ADD COLUMN "user_id" text;
--> statement-breakpoint
ALTER TABLE "mobile_accounts" ADD COLUMN "role" "mobile_account_role" DEFAULT 'jamaah' NOT NULL;
--> statement-breakpoint
ALTER TABLE "live_muthowif_sessions" ADD COLUMN "muthowif_user_id" text;
--> statement-breakpoint
ALTER TABLE "live_muthowif_sessions" ADD COLUMN "live_started_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "live_muthowif_sessions" ADD COLUMN "live_ended_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "mobile_accounts" ADD CONSTRAINT "mobile_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "live_muthowif_sessions" ADD CONSTRAINT "live_muthowif_sessions_muthowif_user_id_users_id_fk" FOREIGN KEY ("muthowif_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "mobile_accounts_user_idx" ON "mobile_accounts" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "live_muthowif_sessions_muthowif_idx" ON "live_muthowif_sessions" USING btree ("muthowif_user_id","status","starts_at");
--> statement-breakpoint
ALTER TABLE "mobile_accounts" ADD CONSTRAINT "mobile_accounts_principal_check" CHECK (("role" = 'jamaah' AND "pilgrim_id" IS NOT NULL AND "user_id" IS NULL) OR ("role" = 'muthowif' AND "user_id" IS NOT NULL AND "pilgrim_id" IS NULL));

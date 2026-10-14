ALTER TYPE "booking_status" ADD VALUE IF NOT EXISTS 'pending' BEFORE 'active';--> statement-breakpoint
CREATE TYPE "public"."mobile_account_status" AS ENUM('pending', 'active', 'locked', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."mobile_device_platform" AS ENUM('android', 'ios');--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "source" text DEFAULT 'admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "reviewed_by" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "review_note" text;--> statement-breakpoint
CREATE TABLE "mobile_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pilgrim_id" uuid NOT NULL,
	"pin_hash" text,
	"status" "mobile_account_status" DEFAULT 'pending' NOT NULL,
	"failed_login_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"activated_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "mobile_activation_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pilgrim_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "mobile_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"access_token_hash" text NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"access_expires_at" timestamp with time zone NOT NULL,
	"refresh_expires_at" timestamp with time zone NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"revoked_at" timestamp with time zone,
	"last_used_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "mobile_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"platform" "mobile_device_platform" NOT NULL,
	"push_token" text NOT NULL,
	"device_name" text,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "mobile_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pilgrim_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"kind" text DEFAULT 'info' NOT NULL,
	"deep_link" text,
	"read_at" timestamp with time zone,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_accounts" ADD CONSTRAINT "mobile_accounts_pilgrim_id_pilgrims_id_fk" FOREIGN KEY ("pilgrim_id") REFERENCES "public"."pilgrims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_activation_tokens" ADD CONSTRAINT "mobile_activation_tokens_pilgrim_id_pilgrims_id_fk" FOREIGN KEY ("pilgrim_id") REFERENCES "public"."pilgrims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_activation_tokens" ADD CONSTRAINT "mobile_activation_tokens_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_sessions" ADD CONSTRAINT "mobile_sessions_account_id_mobile_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."mobile_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_devices" ADD CONSTRAINT "mobile_devices_account_id_mobile_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."mobile_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_notifications" ADD CONSTRAINT "mobile_notifications_pilgrim_id_pilgrims_id_fk" FOREIGN KEY ("pilgrim_id") REFERENCES "public"."pilgrims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_notifications" ADD CONSTRAINT "mobile_notifications_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "mobile_accounts_pilgrim_idx" ON "mobile_accounts" USING btree ("pilgrim_id");--> statement-breakpoint
CREATE UNIQUE INDEX "mobile_activation_tokens_hash_idx" ON "mobile_activation_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "mobile_activation_tokens_pilgrim_idx" ON "mobile_activation_tokens" USING btree ("pilgrim_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "mobile_sessions_access_idx" ON "mobile_sessions" USING btree ("access_token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "mobile_sessions_refresh_idx" ON "mobile_sessions" USING btree ("refresh_token_hash");--> statement-breakpoint
CREATE INDEX "mobile_sessions_account_idx" ON "mobile_sessions" USING btree ("account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "mobile_devices_push_token_idx" ON "mobile_devices" USING btree ("push_token");--> statement-breakpoint
CREATE INDEX "mobile_devices_account_idx" ON "mobile_devices" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "mobile_notifications_pilgrim_idx" ON "mobile_notifications" USING btree ("pilgrim_id","created_at");

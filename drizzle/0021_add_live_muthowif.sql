CREATE TYPE "public"."live_muthowif_session_status" AS ENUM('scheduled', 'live', 'ended', 'cancelled');
--> statement-breakpoint
CREATE TYPE "public"."live_muthowif_session_type" AS ENUM('thawaf', 'sai', 'kajian', 'ziarah', 'briefing', 'other');
--> statement-breakpoint
CREATE TABLE "live_muthowif_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"departure_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" "live_muthowif_session_type" DEFAULT 'other' NOT NULL,
	"status" "live_muthowif_session_status" DEFAULT 'scheduled' NOT NULL,
	"muthowif_name" text NOT NULL,
	"muthowif_avatar_url" text,
	"room_name" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"location" text,
	"image_url" text,
	"listener_count" integer DEFAULT 0 NOT NULL,
	"capacity" integer DEFAULT 45 NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "live_muthowif_sessions" ADD CONSTRAINT "live_muthowif_sessions_departure_id_departures_id_fk" FOREIGN KEY ("departure_id") REFERENCES "public"."departures"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "live_muthowif_sessions" ADD CONSTRAINT "live_muthowif_sessions_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "live_muthowif_sessions_room_idx" ON "live_muthowif_sessions" USING btree ("room_name");
--> statement-breakpoint
CREATE INDEX "live_muthowif_sessions_departure_status_idx" ON "live_muthowif_sessions" USING btree ("departure_id","status","starts_at");

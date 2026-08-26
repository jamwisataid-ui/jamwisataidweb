CREATE TABLE "analytics_page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"visitor_id" text NOT NULL,
	"path" text NOT NULL,
	"referrer" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_sessions" (
	"session_id" text PRIMARY KEY NOT NULL,
	"visitor_id" text NOT NULL,
	"current_path" text NOT NULL,
	"referrer" text,
	"device" text DEFAULT 'desktop' NOT NULL,
	"page_views" integer DEFAULT 1 NOT NULL,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_page_views" ADD CONSTRAINT "analytics_page_views_session_id_analytics_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."analytics_sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_page_views_created_idx" ON "analytics_page_views" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "analytics_page_views_path_created_idx" ON "analytics_page_views" USING btree ("path","created_at");--> statement-breakpoint
CREATE INDEX "analytics_page_views_visitor_created_idx" ON "analytics_page_views" USING btree ("visitor_id","created_at");--> statement-breakpoint
CREATE INDEX "analytics_sessions_last_seen_idx" ON "analytics_sessions" USING btree ("last_seen_at");--> statement-breakpoint
CREATE INDEX "analytics_sessions_visitor_idx" ON "analytics_sessions" USING btree ("visitor_id");
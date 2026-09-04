ALTER TABLE "analytics_page_views" ADD COLUMN "utm_source" text;--> statement-breakpoint
ALTER TABLE "analytics_page_views" ADD COLUMN "utm_campaign" text;--> statement-breakpoint
ALTER TABLE "analytics_page_views" ADD COLUMN "utm_content" text;--> statement-breakpoint
ALTER TABLE "analytics_sessions" ADD COLUMN "utm_source" text;--> statement-breakpoint
ALTER TABLE "analytics_sessions" ADD COLUMN "utm_campaign" text;--> statement-breakpoint
ALTER TABLE "analytics_sessions" ADD COLUMN "utm_content" text;--> statement-breakpoint
ALTER TABLE "issued_documents" ADD COLUMN "checksum" text;--> statement-breakpoint
ALTER TABLE "issued_documents" ADD COLUMN "template_version" text DEFAULT 'jamwisata-image-v1' NOT NULL;--> statement-breakpoint
ALTER TABLE "management_settings" ADD COLUMN "birthday_message_template" text DEFAULT 'Assalamu''alaikum Kak [NAMA], selamat ulang tahun yang ke-[UMUR]. Semoga Allah senantiasa memberikan kesehatan, keberkahan usia, dan kemudahan dalam setiap ibadah. Salam hangat dari Jam Wisata.' NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "invoice_id" uuid;--> statement-breakpoint
ALTER TABLE "pilgrim_documents" ADD COLUMN "checksum" text;--> statement-breakpoint
ALTER TABLE "referral_leads" ADD COLUMN "utm_source" text;--> statement-breakpoint
ALTER TABLE "referral_leads" ADD COLUMN "utm_campaign" text;--> statement-breakpoint
ALTER TABLE "referral_leads" ADD COLUMN "utm_content" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "makkah_room_number" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "madinah_room_number" text;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_issued_documents_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."issued_documents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payments_invoice_idx" ON "payments" USING btree ("invoice_id");
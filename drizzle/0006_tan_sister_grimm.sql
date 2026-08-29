CREATE TYPE "public"."booking_status" AS ENUM('active', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."cash_direction" AS ENUM('in', 'out', 'transfer');--> statement-breakpoint
CREATE TYPE "public"."cash_transaction_kind" AS ENUM('payment', 'refund', 'expense', 'commission', 'manual', 'opening_balance');--> statement-breakpoint
CREATE TYPE "public"."commission_status" AS ENUM('pending', 'earned', 'paid', 'reversed');--> statement-breakpoint
CREATE TYPE "public"."pilgrim_document_kind" AS ENUM('ktp', 'kk', 'akta_lahir', 'buku_nikah', 'ijazah', 'paspor', 'other');--> statement-breakpoint
CREATE TYPE "public"."document_review_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."inventory_movement_kind" AS ENUM('in', 'out', 'adjustment');--> statement-breakpoint
CREATE TYPE "public"."issued_document_kind" AS ENUM('invoice', 'receipt');--> statement-breakpoint
CREATE TYPE "public"."issued_document_status" AS ENUM('issued', 'void');--> statement-breakpoint
CREATE TYPE "public"."referral_lead_status" AS ENUM('new', 'contacted', 'converted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."numbering_reset" AS ENUM('never', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'transfer', 'card', 'other');--> statement-breakpoint
CREATE TYPE "public"."payment_record_status" AS ENUM('confirmed', 'void');--> statement-breakpoint
CREATE TYPE "public"."management_record_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('confirmed', 'void');--> statement-breakpoint
CREATE TABLE "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text,
	"referral_code" text NOT NULL,
	"default_commission" bigint DEFAULT 500000 NOT NULL,
	"status" "management_record_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_number" text NOT NULL,
	"departure_id" uuid NOT NULL,
	"payer_name" text NOT NULL,
	"payer_whatsapp" text NOT NULL,
	"payer_email" text,
	"agent_id" uuid,
	"referral_lead_id" uuid,
	"package_snapshot" jsonb NOT NULL,
	"status" "booking_status" DEFAULT 'active' NOT NULL,
	"cancellation_reason" text,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cash_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"destination_account_id" uuid,
	"package_id" text,
	"category_id" uuid,
	"payment_id" uuid,
	"refund_id" uuid,
	"direction" "cash_direction" NOT NULL,
	"kind" "cash_transaction_kind" NOT NULL,
	"amount" bigint NOT NULL,
	"transaction_at" timestamp with time zone NOT NULL,
	"description" text NOT NULL,
	"is_reversal" boolean DEFAULT false NOT NULL,
	"reverses_transaction_id" uuid,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"registration_id" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"status" "commission_status" DEFAULT 'pending' NOT NULL,
	"earned_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"reversed_at" timestamp with time zone,
	"payout_transaction_id" uuid,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_sequences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "issued_document_kind" NOT NULL,
	"name" text NOT NULL,
	"pattern" text NOT NULL,
	"padding" integer DEFAULT 4 NOT NULL,
	"reset" "numbering_reset" DEFAULT 'never' NOT NULL,
	"next_number" integer DEFAULT 1 NOT NULL,
	"current_period" text,
	"active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"status" "management_record_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "expense_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "financial_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'bank' NOT NULL,
	"bank_name" text,
	"account_number" text,
	"account_holder" text,
	"show_on_invoice" boolean DEFAULT false NOT NULL,
	"status" "management_record_status" DEFAULT 'active' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"unit" text DEFAULT 'pcs' NOT NULL,
	"minimum_stock" integer DEFAULT 5 NOT NULL,
	"current_stock" integer DEFAULT 0 NOT NULL,
	"status" "management_record_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_items_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "inventory_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"registration_id" uuid,
	"package_id" text,
	"kind" "inventory_movement_kind" NOT NULL,
	"quantity" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"moved_at" timestamp with time zone NOT NULL,
	"note" text,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issued_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "issued_document_kind" NOT NULL,
	"number" text NOT NULL,
	"booking_id" uuid NOT NULL,
	"payment_id" uuid,
	"sequence_id" uuid NOT NULL,
	"snapshot" jsonb NOT NULL,
	"object_key" text NOT NULL,
	"status" "issued_document_status" DEFAULT 'issued' NOT NULL,
	"issued_at" timestamp with time zone NOT NULL,
	"void_reason" text,
	"voided_at" timestamp with time zone,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "issued_documents_object_key_unique" UNIQUE("object_key")
);
--> statement-breakpoint
CREATE TABLE "management_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"company_name" text DEFAULT 'Jam Wisata' NOT NULL,
	"company_address" text DEFAULT '' NOT NULL,
	"company_phone" text DEFAULT '' NOT NULL,
	"company_email" text DEFAULT '' NOT NULL,
	"default_dp_amount" bigint DEFAULT 5000000 NOT NULL,
	"payment_due_days" integer DEFAULT 30 NOT NULL,
	"finance_signer_name" text DEFAULT '' NOT NULL,
	"finance_signer_title" text DEFAULT 'Keuangan' NOT NULL,
	"signature_object_key" text,
	"stamp_object_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"registration_id" uuid NOT NULL,
	"amount" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"paid_at" timestamp with time zone NOT NULL,
	"amount" bigint NOT NULL,
	"method" "payment_method" NOT NULL,
	"reference" text,
	"proof_object_key" text,
	"note" text,
	"status" "payment_record_status" DEFAULT 'confirmed' NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pilgrim_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pilgrim_id" uuid NOT NULL,
	"kind" "pilgrim_document_kind" NOT NULL,
	"original_name" text NOT NULL,
	"object_key" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"review_status" "document_review_status" DEFAULT 'pending' NOT NULL,
	"review_note" text,
	"uploaded_by" text,
	"verified_by" text,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pilgrim_documents_object_key_unique" UNIQUE("object_key")
);
--> statement-breakpoint
CREATE TABLE "pilgrims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text,
	"gender" text,
	"birth_date" date,
	"nationality" text DEFAULT 'Indonesia' NOT NULL,
	"passport_number" text,
	"passport_expiry" date,
	"notes" text,
	"status" "management_record_status" DEFAULT 'active' NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referral_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"package_id" text,
	"name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text,
	"status" "referral_lead_status" DEFAULT 'new' NOT NULL,
	"converted_pilgrim_id" uuid,
	"source_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"registration_id" uuid,
	"account_id" uuid NOT NULL,
	"refunded_at" timestamp with time zone NOT NULL,
	"amount" bigint NOT NULL,
	"reason" text NOT NULL,
	"status" "refund_status" DEFAULT 'confirmed' NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"pilgrim_id" uuid NOT NULL,
	"agreed_price" bigint NOT NULL,
	"dp_target" bigint DEFAULT 5000000 NOT NULL,
	"discount_amount" bigint DEFAULT 0 NOT NULL,
	"room_type" text,
	"room_number" text,
	"commission_amount" bigint DEFAULT 0 NOT NULL,
	"status" "booking_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_mates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registration_id" uuid NOT NULL,
	"mate_registration_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_departure_id_departures_id_fk" FOREIGN KEY ("departure_id") REFERENCES "public"."departures"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_referral_lead_id_referral_leads_id_fk" FOREIGN KEY ("referral_lead_id") REFERENCES "public"."referral_leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_account_id_financial_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."financial_accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_destination_account_id_financial_accounts_id_fk" FOREIGN KEY ("destination_account_id") REFERENCES "public"."financial_accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_category_id_expense_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_refund_id_refunds_id_fk" FOREIGN KEY ("refund_id") REFERENCES "public"."refunds"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issued_documents" ADD CONSTRAINT "issued_documents_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issued_documents" ADD CONSTRAINT "issued_documents_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issued_documents" ADD CONSTRAINT "issued_documents_sequence_id_document_sequences_id_fk" FOREIGN KEY ("sequence_id") REFERENCES "public"."document_sequences"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issued_documents" ADD CONSTRAINT "issued_documents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_account_id_financial_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."financial_accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrim_documents" ADD CONSTRAINT "pilgrim_documents_pilgrim_id_pilgrims_id_fk" FOREIGN KEY ("pilgrim_id") REFERENCES "public"."pilgrims"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrim_documents" ADD CONSTRAINT "pilgrim_documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrim_documents" ADD CONSTRAINT "pilgrim_documents_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrims" ADD CONSTRAINT "pilgrims_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilgrims" ADD CONSTRAINT "pilgrims_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_leads" ADD CONSTRAINT "referral_leads_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_leads" ADD CONSTRAINT "referral_leads_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_leads" ADD CONSTRAINT "referral_leads_converted_pilgrim_id_pilgrims_id_fk" FOREIGN KEY ("converted_pilgrim_id") REFERENCES "public"."pilgrims"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_account_id_financial_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."financial_accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_pilgrim_id_pilgrims_id_fk" FOREIGN KEY ("pilgrim_id") REFERENCES "public"."pilgrims"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_mates" ADD CONSTRAINT "room_mates_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_mates" ADD CONSTRAINT "room_mates_mate_registration_id_registrations_id_fk" FOREIGN KEY ("mate_registration_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "agents_referral_code_idx" ON "agents" USING btree ("referral_code");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_number_idx" ON "bookings" USING btree ("booking_number");--> statement-breakpoint
CREATE INDEX "bookings_departure_idx" ON "bookings" USING btree ("departure_id");--> statement-breakpoint
CREATE INDEX "cash_transactions_account_date_idx" ON "cash_transactions" USING btree ("account_id","transaction_at");--> statement-breakpoint
CREATE INDEX "cash_transactions_package_idx" ON "cash_transactions" USING btree ("package_id");--> statement-breakpoint
CREATE UNIQUE INDEX "commissions_registration_idx" ON "commissions" USING btree ("registration_id");--> statement-breakpoint
CREATE INDEX "commissions_agent_status_idx" ON "commissions" USING btree ("agent_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "document_sequences_active_kind_idx" ON "document_sequences" USING btree ("kind","active");--> statement-breakpoint
CREATE INDEX "inventory_movements_item_date_idx" ON "inventory_movements" USING btree ("item_id","moved_at");--> statement-breakpoint
CREATE UNIQUE INDEX "issued_documents_kind_number_idx" ON "issued_documents" USING btree ("kind","number");--> statement-breakpoint
CREATE INDEX "issued_documents_booking_idx" ON "issued_documents" USING btree ("booking_id","issued_at");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_allocations_payment_registration_idx" ON "payment_allocations" USING btree ("payment_id","registration_id");--> statement-breakpoint
CREATE INDEX "payment_allocations_registration_idx" ON "payment_allocations" USING btree ("registration_id");--> statement-breakpoint
CREATE INDEX "payments_booking_paid_idx" ON "payments" USING btree ("booking_id","paid_at");--> statement-breakpoint
CREATE INDEX "pilgrim_documents_pilgrim_idx" ON "pilgrim_documents" USING btree ("pilgrim_id","kind");--> statement-breakpoint
CREATE INDEX "pilgrims_name_idx" ON "pilgrims" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX "pilgrims_whatsapp_idx" ON "pilgrims" USING btree ("whatsapp");--> statement-breakpoint
CREATE INDEX "referral_leads_agent_created_idx" ON "referral_leads" USING btree ("agent_id","created_at");--> statement-breakpoint
CREATE INDEX "refunds_payment_idx" ON "refunds" USING btree ("payment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "registrations_booking_pilgrim_idx" ON "registrations" USING btree ("booking_id","pilgrim_id");--> statement-breakpoint
CREATE INDEX "registrations_pilgrim_idx" ON "registrations" USING btree ("pilgrim_id");--> statement-breakpoint
CREATE UNIQUE INDEX "room_mates_pair_idx" ON "room_mates" USING btree ("registration_id","mate_registration_id");
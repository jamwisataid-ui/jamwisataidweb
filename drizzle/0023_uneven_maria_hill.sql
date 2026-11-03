ALTER TABLE "cash_transactions" ADD COLUMN "recipient_name" text;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD COLUMN "recipient_bank" text;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD COLUMN "recipient_account_number" text;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD COLUMN "recipient_account_holder" text;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD COLUMN "transfer_proof_object_key" text;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD COLUMN "transfer_proof_original_name" text;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD COLUMN "transfer_proof_mime_type" text;--> statement-breakpoint
ALTER TABLE "cash_transactions" ADD COLUMN "transfer_proof_size_bytes" integer;

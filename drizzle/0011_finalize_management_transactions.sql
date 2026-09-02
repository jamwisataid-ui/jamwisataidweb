ALTER TABLE "payments" ADD COLUMN "invoice_id" uuid;
ALTER TABLE "issued_documents" ADD COLUMN "checksum" text;
ALTER TABLE "issued_documents" ADD COLUMN "template_version" text NOT NULL DEFAULT 'jamwisata-image-v1';
ALTER TABLE "pilgrim_documents" ADD COLUMN "checksum" text;

UPDATE "payments" AS p
SET "invoice_id" = (
  SELECT d.id
  FROM "issued_documents" AS d
  WHERE d."booking_id" = p."booking_id"
    AND d.kind = 'invoice'
    AND d.status = 'issued'
    AND d."issued_at" <= p."paid_at"
  ORDER BY d."issued_at" DESC
  LIMIT 1
)
WHERE p."invoice_id" IS NULL
  AND EXISTS (
    SELECT 1 FROM "issued_documents" AS d
    WHERE d."booking_id" = p."booking_id" AND d.kind = 'invoice' AND d.status = 'issued'
  );

ALTER TABLE "payments"
  ADD CONSTRAINT "payments_invoice_id_issued_documents_id_fk"
  FOREIGN KEY ("invoice_id") REFERENCES "public"."issued_documents"("id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

CREATE INDEX "payments_invoice_idx" ON "payments" USING btree ("invoice_id");

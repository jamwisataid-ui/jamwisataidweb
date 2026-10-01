UPDATE "document_sequences"
SET "pattern" = '{seq}/jamw/{DD}{MM}{YY}', "updated_at" = now()
WHERE "active" = true AND "kind" IN ('invoice', 'receipt');

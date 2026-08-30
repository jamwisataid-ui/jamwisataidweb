DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "issued_documents" WHERE "kind" = 'invoice') THEN
    UPDATE "document_sequences" SET "active" = false, "updated_at" = now() WHERE "kind" = 'invoice' AND "active" = true;
    INSERT INTO "document_sequences" ("kind", "name", "pattern", "padding", "reset", "next_number", "active")
    VALUES ('invoice', 'Nomor invoice aktif', '{seq}/jamw/300828', 4, 'never', 9933, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM "issued_documents" WHERE "kind" = 'receipt') THEN
    UPDATE "document_sequences" SET "active" = false, "updated_at" = now() WHERE "kind" = 'receipt' AND "active" = true;
    INSERT INTO "document_sequences" ("kind", "name", "pattern", "padding", "reset", "next_number", "active")
    VALUES ('receipt', 'Nomor kwitansi aktif', '{seq}/jamw/300826', 4, 'never', 66, true);
  END IF;
END $$;

INSERT INTO "management_settings" ("id") VALUES ('default') ON CONFLICT ("id") DO NOTHING;

INSERT INTO "expense_categories" ("name") VALUES
  ('Tiket pesawat'), ('Hotel'), ('Visa'), ('Perlengkapan'),
  ('Transportasi'), ('Konsumsi'), ('Operasional lain')
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "inventory_items" ("name") VALUES
  ('Koper bagasi'), ('Koper kabin'), ('Kain ihram'), ('Seragam'),
  ('Kerudung'), ('Tas multifungsi'), ('ID card'), ('Cover koper'),
  ('Cover paspor'), ('Name tag')
ON CONFLICT ("name") DO NOTHING;

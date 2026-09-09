UPDATE "hpp_price_master"
SET "cost_basis" = 'per_pax',
    "amount" = CASE
      WHEN "code" = 'arrival_bus' AND "amount" = 13000000 THEN 371428.5714
      ELSE "amount"
    END,
    "updated_at" = now()
WHERE "code" IN ('departure_bus', 'arrival_bus');

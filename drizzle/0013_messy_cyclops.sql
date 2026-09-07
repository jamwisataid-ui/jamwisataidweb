CREATE TYPE "public"."hpp_cost_basis" AS ENUM('per_pax', 'group', 'room_per_night');--> statement-breakpoint
CREATE TYPE "public"."hpp_currency" AS ENUM('IDR', 'USD', 'SAR');--> statement-breakpoint
CREATE TYPE "public"."hpp_la_mode" AS ENUM('package', 'hotel_detail');--> statement-breakpoint
CREATE TYPE "public"."hpp_status" AS ENUM('draft', 'final', 'applied', 'archived');--> statement-breakpoint
CREATE TABLE "hpp_costing_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"costing_id" uuid NOT NULL,
	"code" text NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"currency" "hpp_currency" DEFAULT 'IDR' NOT NULL,
	"cost_basis" "hpp_cost_basis" DEFAULT 'per_pax' NOT NULL,
	"unit_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"quantity" numeric(10, 2) DEFAULT '1' NOT NULL,
	"computed_per_pax" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hpp_costings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"package_id" text,
	"departure_id" uuid,
	"departure_date" date,
	"season" text DEFAULT 'high' NOT NULL,
	"la_mode" "hpp_la_mode" DEFAULT 'package' NOT NULL,
	"duration_days" integer NOT NULL,
	"pax_count" integer NOT NULL,
	"usd_rate" numeric(18, 2) NOT NULL,
	"sar_rate" numeric(18, 2) NOT NULL,
	"profit_margin" numeric(18, 2) DEFAULT '0' NOT NULL,
	"marketing_fee" numeric(18, 2) DEFAULT '0' NOT NULL,
	"subtotal_base" numeric(18, 2) DEFAULT '0' NOT NULL,
	"foc_tour_leader" numeric(18, 2) DEFAULT '0' NOT NULL,
	"hpp_per_pax" numeric(18, 2) DEFAULT '0' NOT NULL,
	"selling_price" numeric(18, 2) DEFAULT '0' NOT NULL,
	"applied_price" bigint,
	"formula_version" text DEFAULT 'muhasib-v1' NOT NULL,
	"status" "hpp_status" DEFAULT 'draft' NOT NULL,
	"notes" text,
	"snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" text,
	"updated_by" text,
	"applied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hpp_price_master" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"currency" "hpp_currency" DEFAULT 'IDR' NOT NULL,
	"cost_basis" "hpp_cost_basis" DEFAULT 'per_pax' NOT NULL,
	"amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "management_record_status" DEFAULT 'active' NOT NULL,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hpp_costing_items" ADD CONSTRAINT "hpp_costing_items_costing_id_hpp_costings_id_fk" FOREIGN KEY ("costing_id") REFERENCES "public"."hpp_costings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hpp_costings" ADD CONSTRAINT "hpp_costings_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hpp_costings" ADD CONSTRAINT "hpp_costings_departure_id_departures_id_fk" FOREIGN KEY ("departure_id") REFERENCES "public"."departures"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hpp_costings" ADD CONSTRAINT "hpp_costings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hpp_costings" ADD CONSTRAINT "hpp_costings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hpp_price_master" ADD CONSTRAINT "hpp_price_master_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "hpp_costing_items_costing_code_idx" ON "hpp_costing_items" USING btree ("costing_id","code");--> statement-breakpoint
CREATE INDEX "hpp_costing_items_costing_sort_idx" ON "hpp_costing_items" USING btree ("costing_id","sort_order");--> statement-breakpoint
CREATE INDEX "hpp_costings_status_updated_idx" ON "hpp_costings" USING btree ("status","updated_at");--> statement-breakpoint
CREATE INDEX "hpp_costings_package_idx" ON "hpp_costings" USING btree ("package_id");--> statement-breakpoint
CREATE UNIQUE INDEX "hpp_price_master_code_idx" ON "hpp_price_master" USING btree ("code");--> statement-breakpoint
CREATE INDEX "hpp_price_master_category_idx" ON "hpp_price_master" USING btree ("category","sort_order");
--> statement-breakpoint
INSERT INTO "hpp_price_master" ("code", "category", "name", "currency", "cost_basis", "amount", "sort_order", "metadata") VALUES
('main_ticket','ticket','Tiket pesawat utama PP','IDR','per_pax',14400000,10,'{}'),
('domestic_ticket','ticket','Tiket domestik tambahan','IDR','per_pax',1250000,20,'{}'),
('other_flight','ticket','Penerbangan negara lain','USD','per_pax',0,30,'{}'),
('saudi_visa','visa','Visa Arab Saudi','USD','per_pax',135,40,'{}'),
('other_visa','visa','Visa transit/lainnya','USD','per_pax',0,50,'{}'),
('insurance','visa','Asuransi perjalanan','IDR','per_pax',75000,60,'{}'),
('tasreh','visa','Tasreh Raudhah','SAR','per_pax',25,70,'{}'),
('land_arrangement','la','Paket LA Makkah & Madinah','IDR','per_pax',6400000,80,'{}'),
('handling_jakarta','handling','Handling Jakarta','IDR','per_pax',140000,90,'{"allocation":{"operasional":0.92,"tips":0.08}}'),
('handling_domestic','handling','Handling domestik','IDR','per_pax',25000,100,'{}'),
('domestic_meal','handling','Konsumsi transit domestik','IDR','per_pax',35000,110,'{"defaultQuantity":2}'),
('lounge','handling','Lounge','IDR','per_pax',0,120,'{}'),
('departure_bus','departure_bus','Sewa bus keberangkatan','IDR','group',0,130,'{}'),
('departure_snack','departure_bus','Snack bus keberangkatan','IDR','per_pax',15000,140,'{}'),
('arrival_bus','arrival_bus','Sewa bus kedatangan','IDR','group',13000000,150,'{}'),
('arrival_snack','arrival_bus','Snack bus kedatangan','IDR','per_pax',15000,160,'{}'),
('mandatory_equipment','equipment','Perlengkapan wajib','IDR','per_pax',250000,170,'{"allocation":[0.38,0.14,0.14,0.12,0.22]}'),
('optional_equipment','equipment','Perlengkapan opsional','IDR','per_pax',675000,180,'{"allocation":[0.70,0.19,0.11]}'),
('manasik','manasik','Manasik teori, praktik & MCU','IDR','per_pax',275000,190,'{"allocation":[0.46,0.54]}'),
('speaker','manasik','Fee pemateri','IDR','per_pax',50000,200,'{}'),
('haramain','program','Kereta cepat Haramain','SAR','per_pax',0,210,'{}'),
('taif','program','City Tour Thaif','SAR','per_pax',0,220,'{}'),
('other_tour','program','Program/tour lainnya','SAR','per_pax',0,230,'{}'),
('social','social','Sedekah & sosial','IDR','per_pax',250000,240,'{"allocation":[0.20,0.80]}'),
('office','other','Operasional kantor','IDR','per_pax',0,250,'{}'),
('tour_leader','other','Uang saku & data Tour Leader','IDR','per_pax',100000,260,'{}'),
('fixed_cost','other','Fixed cost cadangan','IDR','per_pax',250000,270,'{}'),
('la-movenpick-daraleiman','la_package','Movenpick / Dar Al Eiman','IDR','per_pax',16350000,310,'{"makkah":"Movenpick *5","madinah":"Dar Al Eiman *5"}'),
('la-pullman-alharam','la_package','Pullman / Al Haram','IDR','per_pax',15000000,320,'{"makkah":"Pullman *5","madinah":"Al Haram"}'),
('la-makarem-royal','la_package','Makarem Ajyad / Royal Andalus','IDR','per_pax',10800000,330,'{"makkah":"Makarem Ajyad *5","madinah":"Royal Andalus Al Fakher"}'),
('hotel-makkah-movenpick','hotel_makkah','Movenpick Hotel *****','SAR','room_per_night',2170,410,'{"roomType":"quad","low":1495,"medium":1575,"high":2170}'),
('hotel-makkah-pullman','hotel_makkah','Pullman Zamzam *****','SAR','room_per_night',2180,420,'{"roomType":"quad","low":1495,"medium":1655,"high":2180}'),
('hotel-makkah-swiss','hotel_makkah','Swissotel *****','SAR','room_per_night',1915,430,'{"roomType":"quad","low":1715,"medium":1815,"high":1915}'),
('hotel-madinah-alaqeeq','hotel_madinah','Al Aqeeq *****','SAR','room_per_night',1070,510,'{"roomType":"quad","low":1020,"medium":1070,"high":1070}'),
('hotel-madinah-alharam','hotel_madinah','Dar Al Eiman Al Haram *****','SAR','room_per_night',1620,520,'{"roomType":"quad","low":1170,"medium":1370,"high":1620}'),
('hotel-madinah-munakareem','hotel_madinah','Leader Muna Kareem ****','SAR','room_per_night',1240,530,'{"roomType":"quad","low":1100,"medium":1180,"high":1240}')
ON CONFLICT ("code") DO NOTHING;

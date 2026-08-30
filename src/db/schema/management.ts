import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { users } from "./auth";
import { departures, packages } from "./content";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const recordStatus = pgEnum("management_record_status", ["active", "archived"]);
export const documentKind = pgEnum("pilgrim_document_kind", ["ktp", "kk", "akta_lahir", "buku_nikah", "ijazah", "paspor", "other"]);
export const documentReviewStatus = pgEnum("document_review_status", ["pending", "verified", "rejected"]);
export const bookingStatus = pgEnum("booking_status", ["active", "cancelled", "completed"]);
export const paymentMethod = pgEnum("payment_method", ["cash", "transfer", "card", "other"]);
export const paymentRecordStatus = pgEnum("payment_record_status", ["confirmed", "void"]);
export const refundStatus = pgEnum("refund_status", ["confirmed", "void"]);
export const cashDirection = pgEnum("cash_direction", ["in", "out", "transfer"]);
export const cashTransactionKind = pgEnum("cash_transaction_kind", ["payment", "refund", "expense", "commission", "manual", "opening_balance"]);
export const commissionStatus = pgEnum("commission_status", ["pending", "earned", "paid", "reversed"]);
export const inventoryMovementKind = pgEnum("inventory_movement_kind", ["in", "out", "adjustment"]);
export const issuedDocumentKind = pgEnum("issued_document_kind", ["invoice", "receipt"]);
export const issuedDocumentStatus = pgEnum("issued_document_status", ["issued", "void"]);
export const numberingReset = pgEnum("numbering_reset", ["never", "monthly", "yearly"]);
export const leadStatus = pgEnum("referral_lead_status", ["new", "contacted", "converted", "closed"]);

export const managementSettings = pgTable("management_settings", {
  id: text("id").primaryKey().default("default"),
  companyName: text("company_name").notNull().default("Jam Wisata"),
  companyAddress: text("company_address").notNull().default(""),
  companyPhone: text("company_phone").notNull().default(""),
  companyEmail: text("company_email").notNull().default(""),
  defaultDpAmount: bigint("default_dp_amount", { mode: "number" }).notNull().default(5_000_000),
  paymentDueDays: integer("payment_due_days").notNull().default(30),
  financeSignerName: text("finance_signer_name").notNull().default(""),
  financeSignerTitle: text("finance_signer_title").notNull().default("Keuangan"),
  birthdayMessageTemplate: text("birthday_message_template").notNull().default("Assalamu'alaikum Kak [NAMA], selamat ulang tahun yang ke-[UMUR]. Semoga Allah senantiasa memberikan kesehatan, keberkahan usia, dan kemudahan dalam setiap ibadah. Salam hangat dari Jam Wisata."),
  signatureObjectKey: text("signature_object_key"),
  stampObjectKey: text("stamp_object_key"),
  ...timestamps,
});

export const financialAccounts = pgTable("financial_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("bank"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountHolder: text("account_holder"),
  showOnInvoice: boolean("show_on_invoice").notNull().default(false),
  status: recordStatus("status").notNull().default("active"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const pilgrims = pgTable("pilgrims", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email"),
  gender: text("gender"),
  birthDate: date("birth_date", { mode: "string" }),
  nationality: text("nationality").notNull().default("Indonesia"),
  passportNumber: text("passport_number"),
  passportExpiry: date("passport_expiry", { mode: "string" }),
  notes: text("notes"),
  status: recordStatus("status").notNull().default("active"),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  updatedBy: text("updated_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
}, (table) => [
  index("pilgrims_name_idx").on(table.fullName),
  index("pilgrims_whatsapp_idx").on(table.whatsapp),
]);

export const pilgrimDocuments = pgTable("pilgrim_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  pilgrimId: uuid("pilgrim_id").notNull().references(() => pilgrims.id, { onDelete: "restrict" }),
  kind: documentKind("kind").notNull(),
  originalName: text("original_name").notNull(),
  objectKey: text("object_key").notNull().unique(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  reviewStatus: documentReviewStatus("review_status").notNull().default("pending"),
  reviewNote: text("review_note"),
  uploadedBy: text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  verifiedBy: text("verified_by").references(() => users.id, { onDelete: "set null" }),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [index("pilgrim_documents_pilgrim_idx").on(table.pilgrimId, table.kind)]);

export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email"),
  referralCode: text("referral_code").notNull(),
  defaultCommission: bigint("default_commission", { mode: "number" }).notNull().default(500_000),
  status: recordStatus("status").notNull().default("active"),
  ...timestamps,
}, (table) => [uniqueIndex("agents_referral_code_idx").on(table.referralCode)]);

export const referralLeads = pgTable("referral_leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id").notNull().references(() => agents.id, { onDelete: "restrict" }),
  packageId: text("package_id").references(() => packages.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email"),
  status: leadStatus("status").notNull().default("new"),
  convertedPilgrimId: uuid("converted_pilgrim_id").references(() => pilgrims.id, { onDelete: "set null" }),
  sourcePath: text("source_path"),
  utmSource: text("utm_source"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  ...timestamps,
}, (table) => [index("referral_leads_agent_created_idx").on(table.agentId, table.createdAt)]);

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingNumber: text("booking_number").notNull(),
  departureId: uuid("departure_id").notNull().references(() => departures.id, { onDelete: "restrict" }),
  payerName: text("payer_name").notNull(),
  payerWhatsapp: text("payer_whatsapp").notNull(),
  payerEmail: text("payer_email"),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "restrict" }),
  referralLeadId: uuid("referral_lead_id").references(() => referralLeads.id, { onDelete: "set null" }),
  packageSnapshot: jsonb("package_snapshot").$type<Record<string, unknown>>().notNull(),
  status: bookingStatus("status").notNull().default("active"),
  cancellationReason: text("cancellation_reason"),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
}, (table) => [
  uniqueIndex("bookings_number_idx").on(table.bookingNumber),
  index("bookings_departure_idx").on(table.departureId),
]);

export const registrations = pgTable("registrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "restrict" }),
  pilgrimId: uuid("pilgrim_id").notNull().references(() => pilgrims.id, { onDelete: "restrict" }),
  agreedPrice: bigint("agreed_price", { mode: "number" }).notNull(),
  dpTarget: bigint("dp_target", { mode: "number" }).notNull().default(5_000_000),
  discountAmount: bigint("discount_amount", { mode: "number" }).notNull().default(0),
  roomType: text("room_type"),
  roomNumber: text("room_number"),
  commissionAmount: bigint("commission_amount", { mode: "number" }).notNull().default(0),
  status: bookingStatus("status").notNull().default("active"),
  ...timestamps,
}, (table) => [
  uniqueIndex("registrations_booking_pilgrim_idx").on(table.bookingId, table.pilgrimId),
  index("registrations_pilgrim_idx").on(table.pilgrimId),
]);

export const roomMates = pgTable("room_mates", {
  id: uuid("id").defaultRandom().primaryKey(),
  registrationId: uuid("registration_id").notNull().references(() => registrations.id, { onDelete: "cascade" }),
  mateRegistrationId: uuid("mate_registration_id").notNull().references(() => registrations.id, { onDelete: "cascade" }),
}, (table) => [uniqueIndex("room_mates_pair_idx").on(table.registrationId, table.mateRegistrationId)]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "restrict" }),
  accountId: uuid("account_id").notNull().references(() => financialAccounts.id, { onDelete: "restrict" }),
  paidAt: timestamp("paid_at", { withTimezone: true }).notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  method: paymentMethod("method").notNull(),
  reference: text("reference"),
  proofObjectKey: text("proof_object_key"),
  note: text("note"),
  status: paymentRecordStatus("status").notNull().default("confirmed"),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
}, (table) => [index("payments_booking_paid_idx").on(table.bookingId, table.paidAt)]);

export const paymentAllocations = pgTable("payment_allocations", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentId: uuid("payment_id").notNull().references(() => payments.id, { onDelete: "restrict" }),
  registrationId: uuid("registration_id").notNull().references(() => registrations.id, { onDelete: "restrict" }),
  amount: bigint("amount", { mode: "number" }).notNull(),
}, (table) => [
  uniqueIndex("payment_allocations_payment_registration_idx").on(table.paymentId, table.registrationId),
  index("payment_allocations_registration_idx").on(table.registrationId),
]);

export const refunds = pgTable("refunds", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentId: uuid("payment_id").notNull().references(() => payments.id, { onDelete: "restrict" }),
  registrationId: uuid("registration_id").references(() => registrations.id, { onDelete: "restrict" }),
  accountId: uuid("account_id").notNull().references(() => financialAccounts.id, { onDelete: "restrict" }),
  refundedAt: timestamp("refunded_at", { withTimezone: true }).notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  reason: text("reason").notNull(),
  status: refundStatus("status").notNull().default("confirmed"),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
}, (table) => [index("refunds_payment_idx").on(table.paymentId)]);

export const expenseCategories = pgTable("expense_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  status: recordStatus("status").notNull().default("active"),
  ...timestamps,
});

export const cashTransactions = pgTable("cash_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").notNull().references(() => financialAccounts.id, { onDelete: "restrict" }),
  destinationAccountId: uuid("destination_account_id").references(() => financialAccounts.id, { onDelete: "restrict" }),
  packageId: text("package_id").references(() => packages.id, { onDelete: "restrict" }),
  categoryId: uuid("category_id").references(() => expenseCategories.id, { onDelete: "restrict" }),
  paymentId: uuid("payment_id").references(() => payments.id, { onDelete: "restrict" }),
  refundId: uuid("refund_id").references(() => refunds.id, { onDelete: "restrict" }),
  direction: cashDirection("direction").notNull(),
  kind: cashTransactionKind("kind").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  transactionAt: timestamp("transaction_at", { withTimezone: true }).notNull(),
  description: text("description").notNull(),
  isReversal: boolean("is_reversal").notNull().default(false),
  reversesTransactionId: uuid("reverses_transaction_id"),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
}, (table) => [
  index("cash_transactions_account_date_idx").on(table.accountId, table.transactionAt),
  index("cash_transactions_package_idx").on(table.packageId),
]);

export const commissions = pgTable("commissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id").notNull().references(() => agents.id, { onDelete: "restrict" }),
  registrationId: uuid("registration_id").notNull().references(() => registrations.id, { onDelete: "restrict" }),
  amount: bigint("amount", { mode: "number" }).notNull(),
  status: commissionStatus("status").notNull().default("pending"),
  earnedAt: timestamp("earned_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  reversedAt: timestamp("reversed_at", { withTimezone: true }),
  payoutTransactionId: uuid("payout_transaction_id"),
  note: text("note"),
  ...timestamps,
}, (table) => [
  uniqueIndex("commissions_registration_idx").on(table.registrationId),
  index("commissions_agent_status_idx").on(table.agentId, table.status),
]);

export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  unit: text("unit").notNull().default("pcs"),
  minimumStock: integer("minimum_stock").notNull().default(5),
  currentStock: integer("current_stock").notNull().default(0),
  status: recordStatus("status").notNull().default("active"),
  ...timestamps,
});

export const inventoryMovements = pgTable("inventory_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  itemId: uuid("item_id").notNull().references(() => inventoryItems.id, { onDelete: "restrict" }),
  registrationId: uuid("registration_id").references(() => registrations.id, { onDelete: "restrict" }),
  packageId: text("package_id").references(() => packages.id, { onDelete: "restrict" }),
  kind: inventoryMovementKind("kind").notNull(),
  quantity: integer("quantity").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  movedAt: timestamp("moved_at", { withTimezone: true }).notNull(),
  note: text("note"),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
}, (table) => [index("inventory_movements_item_date_idx").on(table.itemId, table.movedAt)]);

export const documentSequences = pgTable("document_sequences", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: issuedDocumentKind("kind").notNull(),
  name: text("name").notNull(),
  pattern: text("pattern").notNull(),
  padding: integer("padding").notNull().default(4),
  reset: numberingReset("reset").notNull().default("never"),
  nextNumber: integer("next_number").notNull().default(1),
  currentPeriod: text("current_period"),
  active: boolean("active").notNull().default(false),
  ...timestamps,
}, (table) => [uniqueIndex("document_sequences_active_kind_idx").on(table.kind).where(sql`${table.active} = true`)]);

export const issuedDocuments = pgTable("issued_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: issuedDocumentKind("kind").notNull(),
  number: text("number").notNull(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "restrict" }),
  paymentId: uuid("payment_id").references(() => payments.id, { onDelete: "restrict" }),
  sequenceId: uuid("sequence_id").notNull().references(() => documentSequences.id, { onDelete: "restrict" }),
  snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
  objectKey: text("object_key").notNull().unique(),
  status: issuedDocumentStatus("status").notNull().default("issued"),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull(),
  voidReason: text("void_reason"),
  voidedAt: timestamp("voided_at", { withTimezone: true }),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
}, (table) => [
  uniqueIndex("issued_documents_kind_number_idx").on(table.kind, table.number),
  index("issued_documents_booking_idx").on(table.bookingId, table.issuedAt),
]);

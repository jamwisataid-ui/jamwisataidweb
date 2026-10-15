import { index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { users } from "./auth";
import { departures } from "./content";
import { pilgrims } from "./management";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const mobileAccountStatus = pgEnum("mobile_account_status", ["pending", "active", "locked", "revoked"]);
export const mobileDevicePlatform = pgEnum("mobile_device_platform", ["android", "ios"]);
export const liveMuthowifSessionStatus = pgEnum("live_muthowif_session_status", ["scheduled", "live", "ended", "cancelled"]);
export const liveMuthowifSessionType = pgEnum("live_muthowif_session_type", ["thawaf", "sai", "kajian", "ziarah", "briefing", "other"]);

export const mobileAccounts = pgTable("mobile_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  pilgrimId: uuid("pilgrim_id").notNull().references(() => pilgrims.id, { onDelete: "cascade" }),
  pinHash: text("pin_hash"),
  status: mobileAccountStatus("status").notNull().default("pending"),
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  activatedAt: timestamp("activated_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [uniqueIndex("mobile_accounts_pilgrim_idx").on(table.pilgrimId)]);

export const mobileActivationTokens = pgTable("mobile_activation_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  pilgrimId: uuid("pilgrim_id").notNull().references(() => pilgrims.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("mobile_activation_tokens_hash_idx").on(table.tokenHash),
  index("mobile_activation_tokens_pilgrim_idx").on(table.pilgrimId, table.createdAt),
]);

export const mobileSessions = pgTable("mobile_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").notNull().references(() => mobileAccounts.id, { onDelete: "cascade" }),
  accessTokenHash: text("access_token_hash").notNull(),
  refreshTokenHash: text("refresh_token_hash").notNull(),
  accessExpiresAt: timestamp("access_expires_at", { withTimezone: true }).notNull(),
  refreshExpiresAt: timestamp("refresh_expires_at", { withTimezone: true }).notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("mobile_sessions_access_idx").on(table.accessTokenHash),
  uniqueIndex("mobile_sessions_refresh_idx").on(table.refreshTokenHash),
  index("mobile_sessions_account_idx").on(table.accountId),
]);

export const mobileDevices = pgTable("mobile_devices", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").notNull().references(() => mobileAccounts.id, { onDelete: "cascade" }),
  platform: mobileDevicePlatform("platform").notNull(),
  pushToken: text("push_token").notNull(),
  deviceName: text("device_name"),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps,
}, (table) => [
  uniqueIndex("mobile_devices_push_token_idx").on(table.pushToken),
  index("mobile_devices_account_idx").on(table.accountId),
]);

export const mobileNotifications = pgTable("mobile_notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  pilgrimId: uuid("pilgrim_id").notNull().references(() => pilgrims.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  kind: text("kind").notNull().default("info"),
  deepLink: text("deep_link"),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("mobile_notifications_pilgrim_idx").on(table.pilgrimId, table.createdAt)]);

export const liveMuthowifSessions = pgTable("live_muthowif_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  departureId: uuid("departure_id").notNull().references(() => departures.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: liveMuthowifSessionType("type").notNull().default("other"),
  status: liveMuthowifSessionStatus("status").notNull().default("scheduled"),
  muthowifName: text("muthowif_name").notNull(),
  muthowifAvatarUrl: text("muthowif_avatar_url"),
  roomName: text("room_name").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  location: text("location"),
  imageUrl: text("image_url"),
  listenerCount: integer("listener_count").notNull().default(0),
  capacity: integer("capacity").notNull().default(45),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
}, (table) => [
  uniqueIndex("live_muthowif_sessions_room_idx").on(table.roomName),
  index("live_muthowif_sessions_departure_status_idx").on(table.departureId, table.status, table.startsAt),
]);

import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default("Admin"),
  createdAt: text("created_at").notNull().default(""),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // random token
  // role distinguishes admin sessions (cookie sk_sess) from PSB santri sessions
  // (cookie psb_sess). Default 'admin' keeps existing rows valid.
  role: text("role").notNull().default("admin"),
  // Admin sessions reference admin_users; nullable because santri sessions use
  // subjectId (a pendaftar uuid in eskahade-db) instead.
  userId: integer("user_id").references(() => adminUsers.id),
  // Generic subject id for non-admin sessions (e.g. pendaftar.id).
  subjectId: text("subject_id"),
  expiresAt: integer("expires_at").notNull(), // unix ms
  createdAt: integer("created_at").notNull().default(0),
});

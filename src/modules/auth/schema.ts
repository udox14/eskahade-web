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
  userId: integer("user_id")
    .notNull()
    .references(() => adminUsers.id),
  expiresAt: integer("expires_at").notNull(), // unix ms
  createdAt: integer("created_at").notNull().default(0),
});

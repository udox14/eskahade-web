import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Struktur organisasi. level: pimpinan (top), atas (mid), bawah (base row).
export const orgMembers = sqliteTable("org_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  name: text("name").notNull(),
  level: text("level").notNull().default("bawah"), // pimpinan | atas | bawah
  icon: text("icon").notNull().default("user-circle"),
  imageKey: text("image_key"),
  sortOrder: integer("sort_order").notNull().default(0),
});

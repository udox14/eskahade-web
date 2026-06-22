import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Statistik strip (Santri Aktif, Tahun Pengabdian, ...).
export const stats = sqliteTable("stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: text("number").notNull(),
  label: text("label").notNull(),
  icon: text("icon").notNull().default("star"),
  sortOrder: integer("sort_order").notNull().default(0),
});

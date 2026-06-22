import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Layanan cards (ESKAHADE / PSB / IKHLASH). scheme controls the card color set.
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  cta: text("cta").notNull().default(""),
  icon: text("icon").notNull().default("squares-four"),
  href: text("href").notNull().default("#"),
  scheme: text("scheme").notNull().default("light"), // green | gold | light
  sortOrder: integer("sort_order").notNull().default(0),
});

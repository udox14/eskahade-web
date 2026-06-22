import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Program / jenjang pendidikan cards.
export const programs = sqliteTable("programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  tag: text("tag").notNull().default(""),
  icon: text("icon").notNull().default("book-open-text"),
  sortOrder: integer("sort_order").notNull().default(0),
});

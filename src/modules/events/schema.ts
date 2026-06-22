import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Agenda / kegiatan mendatang.
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  day: text("day").notNull().default(""),
  month: text("month").notNull().default(""),
  fullDate: text("full_date").notNull().default(""),
  title: text("title").notNull(),
  time: text("time").notNull().default(""),
  location: text("location").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Media library — metadata for objects stored in R2 (bucket binding BUCKET).
export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(), // R2 object key
  filename: text("filename").notNull().default(""),
  mime: text("mime").notNull().default(""),
  size: integer("size").notNull().default(0),
  alt: text("alt").notNull().default(""),
  createdAt: text("created_at").notNull().default(""),
});

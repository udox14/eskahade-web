import { sqliteTable, text } from "drizzle-orm/sqlite-core";

// Global key/value site settings (header, footer, contact, social, branding).
// Flexible KV so new global fields can be added without a migration.
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

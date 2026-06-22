import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Testimoni wali santri / alumni / tokoh.
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  initials: text("initials").notNull().default(""),
  avatarColor: text("avatar_color").notNull().default("#DCE6D5"),
  imageKey: text("image_key"),
  sortOrder: integer("sort_order").notNull().default(0),
});

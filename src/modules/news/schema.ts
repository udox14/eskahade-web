import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const newsCategories = sqliteTable("news_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const newsPosts = sqliteTable("news_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id").references(() => newsCategories.id),
  date: text("date").notNull().default(""), // display date e.g. "12 Juni 2026"
  publishedAt: text("published_at").notNull().default(""), // ISO for sorting
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""), // HTML from Tiptap
  coverKey: text("cover_key"),
  featured: integer("featured").notNull().default(0),
  published: integer("published").notNull().default(1),
  createdAt: text("created_at").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(""),
});

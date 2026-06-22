import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const galleryCategories = sqliteTable("gallery_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const galleryPhotos = sqliteTable("gallery_photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caption: text("caption").notNull().default(""),
  categoryId: integer("category_id").references(() => galleryCategories.id),
  imageKey: text("image_key"),
  // masonry spans (mirrors the mockup's grid-column/grid-row span)
  colSpan: integer("col_span").notNull().default(1),
  rowSpan: integer("row_span").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
});

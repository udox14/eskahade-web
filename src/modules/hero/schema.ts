import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Beranda hero — single row (id = 1).
export const hero = sqliteTable("hero", {
  id: integer("id").primaryKey(),
  badgeText: text("badge_text").notNull().default(""),
  headingPre: text("heading_pre").notNull().default(""),
  headingHighlight: text("heading_highlight").notNull().default(""),
  headingPost: text("heading_post").notNull().default(""),
  subheading: text("subheading").notNull().default(""),
  cta1Label: text("cta1_label").notNull().default(""),
  cta1Href: text("cta1_href").notNull().default(""),
  cta2Label: text("cta2_label").notNull().default(""),
  cta2Href: text("cta2_href").notNull().default(""),
  imageKey: text("image_key"),
  floatNumber: text("float_number").notNull().default(""),
  floatLabel: text("float_label").notNull().default(""),
  accentNumber: text("accent_number").notNull().default(""),
  accentLabel: text("accent_label").notNull().default(""),
});

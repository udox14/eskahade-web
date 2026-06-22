import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Profil page — single-row blocks (id = 1) + ordered lists.

export const profileHero = sqliteTable("profile_hero", {
  id: integer("id").primaryKey(),
  eyebrow: text("eyebrow").notNull().default("Tentang Kami"),
  title: text("title").notNull().default(""),
  paragraph: text("paragraph").notNull().default(""),
  imageKey: text("image_key"),
});

export const sambutan = sqliteTable("sambutan", {
  id: integer("id").primaryKey(),
  arabic: text("arabic").notNull().default(""),
  name: text("name").notNull().default(""),
  role: text("role").notNull().default(""),
  imageKey: text("image_key"),
  paragraph1: text("paragraph1").notNull().default(""),
  paragraph2: text("paragraph2").notNull().default(""),
});

export const vision = sqliteTable("vision", {
  id: integer("id").primaryKey(),
  visionText: text("vision_text").notNull().default(""),
  quoteText: text("quote_text").notNull().default(""),
});

export const historyTimeline = sqliteTable("history_timeline", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  year: text("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const missionPoints = sqliteTable("mission_points", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: text("number").notNull().default(""),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const facilities = sqliteTable("facilities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("buildings"),
  sortOrder: integer("sort_order").notNull().default(0),
});

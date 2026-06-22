// Aggregated schema — re-exports every module's tables so drizzle-kit can see them
// and so `db` can be typed against the full schema.
// NOTE: relative imports (not "@/") so drizzle-kit can resolve them outside Next.
export * from "../modules/settings/schema";
export * from "../modules/hero/schema";
export * from "../modules/services/schema";
export * from "../modules/stats/schema";
export * from "../modules/programs/schema";
export * from "../modules/events/schema";
export * from "../modules/testimonials/schema";
export * from "../modules/news/schema";
export * from "../modules/gallery/schema";
export * from "../modules/org/schema";
export * from "../modules/profile/schema";
export * from "../modules/media/schema";
export * from "../modules/auth/schema";

import type { Config } from "drizzle-kit";

// Drizzle generates plain .sql migrations into db/migrations; they are applied to
// Cloudflare D1 with `wrangler d1 migrations apply sukahideng-web`.
export default {
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./db/migrations",
} satisfies Config;

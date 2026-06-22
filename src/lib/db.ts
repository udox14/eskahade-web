import { drizzle } from "drizzle-orm/d1";
import { getDB } from "@/lib/cf";
import * as schema from "@/db/schema";

// Drizzle client bound to the request's D1 instance.
export function db() {
  return drizzle(getDB(), { schema });
}

export { schema };

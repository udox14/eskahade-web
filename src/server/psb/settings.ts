import { db } from "@/lib/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

// PSB content lives in eskahade-web's existing key/value `settings` table
// (prefixed keys, e.g. psb_site_content) so it shares the unified DB. Values are
// JSON-encoded. Mirrors the PSB app's repo but against the web settings schema
// (which has no updatedAt column).

export async function getPsbSetting<T = unknown>(key: string): Promise<T | null> {
  const [row] = await db().select().from(settings).where(eq(settings.key, key)).limit(1);
  if (!row) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return row.value as unknown as T;
  }
}

export async function putPsbSetting(key: string, value: unknown) {
  const json = typeof value === "string" ? value : JSON.stringify(value);
  await db()
    .insert(settings)
    .values({ key, value: json })
    .onConflictDoUpdate({ target: settings.key, set: { value: json } });
}

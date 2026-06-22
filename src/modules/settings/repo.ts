import { db } from "@/lib/db";
import { settings } from "./schema";
import { eq, inArray } from "drizzle-orm";

// Default settings seeded in db/seed.ts; these are convenience helpers.
export async function getSetting(key: string): Promise<string> {
  const [row] = await db().select().from(settings).where(eq(settings.key, key)).limit(1);
  return row?.value ?? "";
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const rows = await db().select().from(settings).where(inArray(settings.key, keys));
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db().select().from(settings);
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

export async function upsertSetting(key: string, value: string) {
  await db()
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

export async function upsertSettings(kvs: Record<string, string>) {
  for (const [key, value] of Object.entries(kvs)) {
    await upsertSetting(key, value);
  }
}

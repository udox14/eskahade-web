import { db } from "@/lib/db";
import { media } from "./schema";
import { desc, eq } from "drizzle-orm";

export type MediaRow = typeof media.$inferSelect;

export async function getMediaList(limit = 100): Promise<MediaRow[]> {
  return db().select().from(media).orderBy(desc(media.createdAt)).limit(limit);
}

export async function getMediaByKey(key: string): Promise<MediaRow | null> {
  const [row] = await db().select().from(media).where(eq(media.key, key)).limit(1);
  return row ?? null;
}

export async function insertMedia(data: Omit<MediaRow, "id">): Promise<void> {
  await db().insert(media).values(data as typeof media.$inferInsert);
}

export async function deleteMedia(id: number): Promise<void> {
  await db().delete(media).where(eq(media.id, id));
}

export async function updateMediaAlt(id: number, alt: string): Promise<void> {
  await db().update(media).set({ alt }).where(eq(media.id, id));
}

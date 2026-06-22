import { db } from "@/lib/db";
import { stats } from "./schema";
import { asc, eq } from "drizzle-orm";

export type StatRow = typeof stats.$inferSelect;

export async function getStats(): Promise<StatRow[]> {
  return db().select().from(stats).orderBy(asc(stats.sortOrder));
}

export async function upsertStat(data: Omit<StatRow, "id"> & { id?: number }) {
  if (data.id) {
    const { id, ...rest } = data;
    await db().update(stats).set(rest).where(eq(stats.id, id));
  } else {
    await db().insert(stats).values(data as typeof stats.$inferInsert);
  }
}

export async function deleteStat(id: number) {
  await db().delete(stats).where(eq(stats.id, id));
}

export async function updateStatOrder(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    await db().update(stats).set({ sortOrder: i }).where(eq(stats.id, ids[i]));
  }
}

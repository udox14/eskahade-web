import { db } from "@/lib/db";
import { events } from "./schema";
import { asc, eq } from "drizzle-orm";

export type EventRow = typeof events.$inferSelect;

export async function getEvents(): Promise<EventRow[]> {
  return db().select().from(events).orderBy(asc(events.sortOrder));
}

export async function upsertEvent(data: Omit<EventRow, "id"> & { id?: number }) {
  if (data.id) {
    const { id, ...rest } = data;
    await db().update(events).set(rest).where(eq(events.id, id));
  } else {
    await db().insert(events).values(data as typeof events.$inferInsert);
  }
}

export async function deleteEvent(id: number) {
  await db().delete(events).where(eq(events.id, id));
}

export async function updateEventOrder(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    await db().update(events).set({ sortOrder: i }).where(eq(events.id, ids[i]));
  }
}

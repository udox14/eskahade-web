import { db } from "@/lib/db";
import {
  profileHero,
  sambutan,
  vision,
  historyTimeline,
  missionPoints,
  facilities,
} from "./schema";
import { asc, eq } from "drizzle-orm";

export async function getProfileHero() {
  const [row] = await db().select().from(profileHero).where(eq(profileHero.id, 1)).limit(1);
  return row ?? null;
}
export async function upsertProfileHero(data: Omit<typeof profileHero.$inferSelect, "id">) {
  await db().insert(profileHero).values({ id: 1, ...data }).onConflictDoUpdate({ target: profileHero.id, set: data });
}

export async function getSambutan() {
  const [row] = await db().select().from(sambutan).where(eq(sambutan.id, 1)).limit(1);
  return row ?? null;
}
export async function upsertSambutan(data: Omit<typeof sambutan.$inferSelect, "id">) {
  await db().insert(sambutan).values({ id: 1, ...data }).onConflictDoUpdate({ target: sambutan.id, set: data });
}

export async function getVision() {
  const [row] = await db().select().from(vision).where(eq(vision.id, 1)).limit(1);
  return row ?? null;
}
export async function upsertVision(data: Omit<typeof vision.$inferSelect, "id">) {
  await db().insert(vision).values({ id: 1, ...data }).onConflictDoUpdate({ target: vision.id, set: data });
}

export async function getHistoryTimeline() {
  return db().select().from(historyTimeline).orderBy(asc(historyTimeline.sortOrder));
}
export async function upsertHistoryItem(data: Omit<typeof historyTimeline.$inferSelect, "id"> & { id?: number }) {
  if (data.id) { const { id, ...rest } = data; await db().update(historyTimeline).set(rest).where(eq(historyTimeline.id, id)); }
  else { await db().insert(historyTimeline).values(data as typeof historyTimeline.$inferInsert); }
}
export async function deleteHistoryItem(id: number) { await db().delete(historyTimeline).where(eq(historyTimeline.id, id)); }

export async function getMissionPoints() {
  return db().select().from(missionPoints).orderBy(asc(missionPoints.sortOrder));
}
export async function upsertMissionPoint(data: Omit<typeof missionPoints.$inferSelect, "id"> & { id?: number }) {
  if (data.id) { const { id, ...rest } = data; await db().update(missionPoints).set(rest).where(eq(missionPoints.id, id)); }
  else { await db().insert(missionPoints).values(data as typeof missionPoints.$inferInsert); }
}
export async function deleteMissionPoint(id: number) { await db().delete(missionPoints).where(eq(missionPoints.id, id)); }

export async function getFacilities() {
  return db().select().from(facilities).orderBy(asc(facilities.sortOrder));
}
export async function upsertFacility(data: Omit<typeof facilities.$inferSelect, "id"> & { id?: number }) {
  if (data.id) { const { id, ...rest } = data; await db().update(facilities).set(rest).where(eq(facilities.id, id)); }
  else { await db().insert(facilities).values(data as typeof facilities.$inferInsert); }
}
export async function deleteFacility(id: number) { await db().delete(facilities).where(eq(facilities.id, id)); }

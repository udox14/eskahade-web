import { db } from "@/lib/db";
import { services } from "./schema";
import { asc, eq } from "drizzle-orm";

export type ServiceRow = typeof services.$inferSelect;

export async function getServices(): Promise<ServiceRow[]> {
  return db().select().from(services).orderBy(asc(services.sortOrder));
}

export async function upsertService(data: Omit<ServiceRow, "id"> & { id?: number }) {
  if (data.id) {
    const { id, ...rest } = data;
    await db().update(services).set(rest).where(eq(services.id, id));
  } else {
    await db().insert(services).values(data as typeof services.$inferInsert);
  }
}

export async function deleteService(id: number) {
  await db().delete(services).where(eq(services.id, id));
}

export async function updateServiceOrder(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    await db().update(services).set({ sortOrder: i }).where(eq(services.id, ids[i]));
  }
}

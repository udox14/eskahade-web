import { db } from "@/lib/db";
import { programs } from "./schema";
import { asc, eq } from "drizzle-orm";

export type ProgramRow = typeof programs.$inferSelect;

export async function getPrograms(): Promise<ProgramRow[]> {
  return db().select().from(programs).orderBy(asc(programs.sortOrder));
}

export async function upsertProgram(data: Omit<ProgramRow, "id"> & { id?: number }) {
  if (data.id) {
    const { id, ...rest } = data;
    await db().update(programs).set(rest).where(eq(programs.id, id));
  } else {
    await db().insert(programs).values(data as typeof programs.$inferInsert);
  }
}

export async function deleteProgram(id: number) {
  await db().delete(programs).where(eq(programs.id, id));
}

export async function updateProgramOrder(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    await db().update(programs).set({ sortOrder: i }).where(eq(programs.id, ids[i]));
  }
}

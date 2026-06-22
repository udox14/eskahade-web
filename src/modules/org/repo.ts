import { db } from "@/lib/db";
import { orgMembers } from "./schema";
import { asc, eq } from "drizzle-orm";

export type OrgMemberRow = typeof orgMembers.$inferSelect;

export async function getOrgMembers(level?: string): Promise<OrgMemberRow[]> {
  const rows = await db().select().from(orgMembers).orderBy(asc(orgMembers.sortOrder));
  return level ? rows.filter(r => r.level === level) : rows;
}

export async function upsertOrgMember(data: Omit<OrgMemberRow, "id"> & { id?: number }) {
  if (data.id) {
    const { id, ...rest } = data;
    await db().update(orgMembers).set(rest).where(eq(orgMembers.id, id));
  } else {
    await db().insert(orgMembers).values(data as typeof orgMembers.$inferInsert);
  }
}

export async function deleteOrgMember(id: number) {
  await db().delete(orgMembers).where(eq(orgMembers.id, id));
}

export async function updateOrgOrder(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    await db().update(orgMembers).set({ sortOrder: i }).where(eq(orgMembers.id, ids[i]));
  }
}

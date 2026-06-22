import { db } from "@/lib/db";
import { hero } from "./schema";
import { eq } from "drizzle-orm";

export type HeroRow = typeof hero.$inferSelect;

export async function getHero(): Promise<HeroRow | null> {
  const [row] = await db().select().from(hero).where(eq(hero.id, 1)).limit(1);
  return row ?? null;
}

export async function upsertHero(data: Omit<HeroRow, "id">) {
  await db()
    .insert(hero)
    .values({ id: 1, ...data })
    .onConflictDoUpdate({ target: hero.id, set: data });
}

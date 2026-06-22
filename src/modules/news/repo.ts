import { db } from "@/lib/db";
import { newsCategories, newsPosts } from "./schema";
import { asc, desc, eq, and, like } from "drizzle-orm";

export type NewsCategoryRow = typeof newsCategories.$inferSelect;
export type NewsPostRow = typeof newsPosts.$inferSelect;

const PAGE_SIZE = 9;

export async function getNewsCategories(): Promise<NewsCategoryRow[]> {
  return db().select().from(newsCategories).orderBy(asc(newsCategories.id));
}

export async function getNewsPosts(opts?: {
  categorySlug?: string;
  page?: number;
  limit?: number;
  publishedOnly?: boolean;
}) {
  const limit = opts?.limit ?? PAGE_SIZE;
  const offset = ((opts?.page ?? 1) - 1) * limit;
  let q = db()
    .select({ post: newsPosts, category: newsCategories })
    .from(newsPosts)
    .leftJoin(newsCategories, eq(newsPosts.categoryId, newsCategories.id))
    .orderBy(desc(newsPosts.publishedAt))
    .limit(limit)
    .offset(offset);

  if (opts?.categorySlug && opts.categorySlug !== "semua") {
    const [cat] = await db()
      .select()
      .from(newsCategories)
      .where(eq(newsCategories.slug, opts.categorySlug))
      .limit(1);
    if (cat) q = q.where(eq(newsPosts.categoryId, cat.id)) as typeof q;
  }
  if (opts?.publishedOnly) {
    q = q.where(eq(newsPosts.published, 1)) as typeof q;
  }
  return q;
}

export async function countNewsPosts(opts?: { categorySlug?: string; publishedOnly?: boolean }) {
  let q = db().select({ count: newsPosts.id }).from(newsPosts);
  if (opts?.categorySlug && opts.categorySlug !== "semua") {
    const [cat] = await db()
      .select()
      .from(newsCategories)
      .where(eq(newsCategories.slug, opts.categorySlug))
      .limit(1);
    if (cat) q = q.where(eq(newsPosts.categoryId, cat.id)) as typeof q;
  }
  if (opts?.publishedOnly) {
    q = q.where(eq(newsPosts.published, 1)) as typeof q;
  }
  const rows = await q;
  return rows.length;
}

export async function getFeaturedPost() {
  const [row] = await db()
    .select({ post: newsPosts, category: newsCategories })
    .from(newsPosts)
    .leftJoin(newsCategories, eq(newsPosts.categoryId, newsCategories.id))
    .where(and(eq(newsPosts.featured, 1), eq(newsPosts.published, 1)))
    .orderBy(desc(newsPosts.publishedAt))
    .limit(1);
  return row ?? null;
}

export async function getNewsPostBySlug(slug: string) {
  const [row] = await db()
    .select({ post: newsPosts, category: newsCategories })
    .from(newsPosts)
    .leftJoin(newsCategories, eq(newsPosts.categoryId, newsCategories.id))
    .where(eq(newsPosts.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getNewsPostById(id: number) {
  const [row] = await db()
    .select()
    .from(newsPosts)
    .where(eq(newsPosts.id, id))
    .limit(1);
  return row ?? null;
}

export async function upsertNewsPost(data: Omit<NewsPostRow, "id"> & { id?: number }) {
  const now = new Date().toISOString();
  if (data.id) {
    const { id, ...rest } = data;
    await db()
      .update(newsPosts)
      .set({ ...rest, updatedAt: now })
      .where(eq(newsPosts.id, id));
  } else {
    await db()
      .insert(newsPosts)
      .values({ ...data, createdAt: now, updatedAt: now } as typeof newsPosts.$inferInsert);
  }
}

export async function deleteNewsPost(id: number) {
  await db().delete(newsPosts).where(eq(newsPosts.id, id));
}

export async function upsertNewsCategory(data: Omit<NewsCategoryRow, "id"> & { id?: number }) {
  if (data.id) {
    const { id, ...rest } = data;
    await db().update(newsCategories).set(rest).where(eq(newsCategories.id, id));
  } else {
    await db().insert(newsCategories).values(data as typeof newsCategories.$inferInsert);
  }
}

export async function deleteNewsCategory(id: number) {
  await db().delete(newsCategories).where(eq(newsCategories.id, id));
}

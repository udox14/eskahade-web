import { db } from "@/lib/db";
import { testimonials } from "./schema";
import { asc, eq } from "drizzle-orm";

export type TestimonialRow = typeof testimonials.$inferSelect;

export async function getTestimonials(): Promise<TestimonialRow[]> {
  return db().select().from(testimonials).orderBy(asc(testimonials.sortOrder));
}

export async function upsertTestimonial(data: Omit<TestimonialRow, "id"> & { id?: number }) {
  if (data.id) {
    const { id, ...rest } = data;
    await db().update(testimonials).set(rest).where(eq(testimonials.id, id));
  } else {
    await db().insert(testimonials).values(data as typeof testimonials.$inferInsert);
  }
}

export async function deleteTestimonial(id: number) {
  await db().delete(testimonials).where(eq(testimonials.id, id));
}

export async function updateTestimonialOrder(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    await db().update(testimonials).set({ sortOrder: i }).where(eq(testimonials.id, ids[i]));
  }
}

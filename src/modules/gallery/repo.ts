import { db } from "@/lib/db";
import { galleryCategories, galleryPhotos } from "./schema";
import { asc, eq } from "drizzle-orm";

export type GalleryCategoryRow = typeof galleryCategories.$inferSelect;
export type GalleryPhotoRow = typeof galleryPhotos.$inferSelect;

export async function getGalleryCategories(): Promise<GalleryCategoryRow[]> {
  return db().select().from(galleryCategories).orderBy(asc(galleryCategories.id));
}

export async function getGalleryPhotos(categorySlug?: string, limit?: number) {
  let rows = await db()
    .select({ photo: galleryPhotos, category: galleryCategories })
    .from(galleryPhotos)
    .leftJoin(galleryCategories, eq(galleryPhotos.categoryId, galleryCategories.id))
    .orderBy(asc(galleryPhotos.sortOrder));

  if (categorySlug && categorySlug !== "semua") {
    rows = rows.filter(r => r.category?.slug === categorySlug);
  }
  if (limit) rows = rows.slice(0, limit);
  return rows;
}

export async function upsertGalleryPhoto(data: Omit<GalleryPhotoRow, "id"> & { id?: number }) {
  if (data.id) {
    const { id, ...rest } = data;
    await db().update(galleryPhotos).set(rest).where(eq(galleryPhotos.id, id));
  } else {
    await db().insert(galleryPhotos).values(data as typeof galleryPhotos.$inferInsert);
  }
}

export async function deleteGalleryPhoto(id: number) {
  await db().delete(galleryPhotos).where(eq(galleryPhotos.id, id));
}

export async function updateGalleryPhotoOrder(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    await db().update(galleryPhotos).set({ sortOrder: i }).where(eq(galleryPhotos.id, ids[i]));
  }
}

export async function upsertGalleryCategory(data: Omit<GalleryCategoryRow, "id"> & { id?: number }) {
  if (data.id) {
    const { id, ...rest } = data;
    await db().update(galleryCategories).set(rest).where(eq(galleryCategories.id, id));
  } else {
    await db().insert(galleryCategories).values(data as typeof galleryCategories.$inferInsert);
  }
}

export async function deleteGalleryCategory(id: number) {
  await db().delete(galleryCategories).where(eq(galleryCategories.id, id));
}

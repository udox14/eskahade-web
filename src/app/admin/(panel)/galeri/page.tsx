import { getGalleryPhotos, getGalleryCategories } from "@/modules/gallery/repo";
import GaleriClient from "./GaleriClient";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const [rawPhotos, categories] = await Promise.all([
    getGalleryPhotos().catch(() => []),
    getGalleryCategories().catch(() => []),
  ]);
  const photos = rawPhotos.map(r => r.photo);
  return <GaleriClient initialPhotos={photos} initialCategories={categories} />;
}

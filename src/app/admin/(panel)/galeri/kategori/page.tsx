import { getGalleryCategories } from "@/modules/gallery/repo";
import KategoriGaleriClient from "./KategoriGaleriClient";

export const dynamic = "force-dynamic";

export default async function KategoriGaleriPage() {
  const items = await getGalleryCategories().catch(() => []);
  return <KategoriGaleriClient initialItems={items} />;
}

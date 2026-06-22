import { getNewsCategories } from "@/modules/news/repo";
import KategoriBeritaClient from "./KategoriBeritaClient";

export const dynamic = "force-dynamic";

export default async function KategoriBeritaPage() {
  const items = await getNewsCategories().catch(() => []);
  return <KategoriBeritaClient initialItems={items} />;
}

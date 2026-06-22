import { getNewsPosts, getNewsCategories } from "@/modules/news/repo";
import BeritaClient from "./BeritaClient";

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const [rawPosts, categories] = await Promise.all([
    getNewsPosts({ limit: 200 }).catch(() => []),
    getNewsCategories().catch(() => []),
  ]);
  const posts = rawPosts.map(r => r.post);
  return <BeritaClient initialPosts={posts} initialCategories={categories} />;
}

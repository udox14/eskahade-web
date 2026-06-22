import { getMediaList } from "@/modules/media/repo";
import MediaClient from "./MediaClient";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const items = await getMediaList(100).catch(() => []);
  return <MediaClient initialItems={items} />;
}

import { getHistoryTimeline } from "@/modules/profile/repo";
import HistoryClient from "./HistoryClient";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const items = await getHistoryTimeline().catch(() => []);
  return <HistoryClient initialItems={items} />;
}

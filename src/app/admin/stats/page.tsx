import { getStats } from "@/modules/stats/repo";
import StatsClient from "./StatsClient";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const items = await getStats().catch(() => []);
  return <StatsClient initialItems={items} />;
}

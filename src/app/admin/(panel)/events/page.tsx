import { getEvents } from "@/modules/events/repo";
import EventsClient from "./EventsClient";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const items = await getEvents().catch(() => []);
  return <EventsClient initialItems={items} />;
}

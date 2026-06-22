import { getServices } from "@/modules/services/repo";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const items = await getServices().catch(() => []);
  return <ServicesClient initialItems={items} />;
}

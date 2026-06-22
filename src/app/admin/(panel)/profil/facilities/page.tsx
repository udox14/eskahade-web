import { getFacilities } from "@/modules/profile/repo";
import FacilitiesClient from "./FacilitiesClient";

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  const items = await getFacilities().catch(() => []);
  return <FacilitiesClient initialItems={items} />;
}

import { getOrgMembers } from "@/modules/org/repo";
import StrukturClient from "./StrukturClient";

export const dynamic = "force-dynamic";

export default async function StrukturPage() {
  const items = await getOrgMembers().catch(() => []);
  return <StrukturClient initialItems={items} />;
}

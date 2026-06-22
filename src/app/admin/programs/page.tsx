import { getPrograms } from "@/modules/programs/repo";
import ProgramsClient from "./ProgramsClient";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const items = await getPrograms().catch(() => []);
  return <ProgramsClient initialItems={items} />;
}

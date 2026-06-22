import { getAllSettings } from "@/modules/settings/repo";
import PengaturanForm from "./PengaturanForm";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const settings = await getAllSettings().catch(() => ({} as Record<string, string>));
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: "#1F3A27", margin: "0 0 6px" }}>Pengaturan Situs</h1>
      <p style={{ color: "#6E7B66", fontSize: 14, margin: "0 0 28px" }}>Konfigurasi identitas lembaga, kontak, sosial media, dan tampilan situs.</p>
      <PengaturanForm initialSettings={settings} />
    </div>
  );
}

import { getVision } from "@/modules/profile/repo";
import VisionForm from "./VisionForm";

export const dynamic = "force-dynamic";

export default async function VisionPage() {
  const data = await getVision().catch(() => null);
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: "#1F3A27", margin: "0 0 6px" }}>Visi & Misi</h1>
      <p style={{ color: "#6E7B66", fontSize: 14, margin: "0 0 28px" }}>Teks visi dan kutipan inspiratif yang tampil di halaman Profil.</p>
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E5EAE2", padding: 32, maxWidth: 760 }}>
        <VisionForm initialData={data} />
      </div>
    </div>
  );
}

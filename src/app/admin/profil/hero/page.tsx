import { getProfileHero } from "@/modules/profile/repo";
import ProfilHeroForm from "./ProfilHeroForm";

export const dynamic = "force-dynamic";

export default async function ProfilHeroPage() {
  const data = await getProfileHero().catch(() => null);
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: "#1F3A27", margin: "0 0 6px" }}>Profil — Hero / Banner</h1>
      <p style={{ color: "#6E7B66", fontSize: 14, margin: "0 0 28px" }}>Konten banner yang tampil di bagian atas halaman Profil.</p>
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E5EAE2", padding: 32, maxWidth: 760 }}>
        <ProfilHeroForm initialData={data} />
      </div>
    </div>
  );
}

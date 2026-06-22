import { getHero } from "@/modules/hero/repo";
import HeroForm from "./HeroForm";

export default async function HeroAdminPage() {
  let data = await getHero().catch(() => null);
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: "#1F3A27", margin: "0 0 6px" }}>Hero / Banner</h1>
      <p style={{ color: "#6E7B66", fontSize: 14, margin: "0 0 28px" }}>Konten utama yang tampil paling atas di halaman Beranda.</p>
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E5EAE2", padding: 32, maxWidth: 760 }}>
        <HeroForm initialData={data} />
      </div>
    </div>
  );
}

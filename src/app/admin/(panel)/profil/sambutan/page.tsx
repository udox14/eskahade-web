import { getSambutan } from "@/modules/profile/repo";
import SambutanForm from "./SambutanForm";

export const dynamic = "force-dynamic";

export default async function SambutanPage() {
  const data = await getSambutan().catch(() => null);
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: "#1F3A27", margin: "0 0 6px" }}>Sambutan Pengasuh</h1>
      <p style={{ color: "#6E7B66", fontSize: 14, margin: "0 0 28px" }}>Kata sambutan dari pimpinan / pengasuh pondok yang tampil di halaman Profil.</p>
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E5EAE2", padding: 32, maxWidth: 760 }}>
        <SambutanForm initialData={data} />
      </div>
    </div>
  );
}

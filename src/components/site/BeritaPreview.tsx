import Link from "next/link";
import Image from "next/image";

interface Post {
  id: number;
  title: string;
  slug: string;
  date: string;
  coverKey: string | null;
  category: { name: string } | null;
}

export default function BeritaPreview({ posts }: { posts: Post[] }) {
  return (
    <section style={{ background: "var(--card)", borderTop: "1px solid #ECE6D6", borderBottom: "1px solid #ECE6D6" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "56px var(--pad-x)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 34, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
              <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Kabar Terbaru
            </div>
            <h2 className="section-title" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 40, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: 0 }}>
              Berita &amp; Kegiatan Pesantren
            </h2>
          </div>
          <Link href="/berita" className="berita-all-btn">
            Semua Berita <i className="ph ph-arrow-right" />
          </Link>
        </div>

        <div className="berita-grid">
          {posts.map((b, i) => (
            <Link key={b.id} href={`/berita/${b.slug}`} className="berita-card">
              <div style={{ aspectRatio: "16/10", position: "relative", background: "linear-gradient(150deg,#8FAE85,#5F7E58)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {b.coverKey ? (
                  <Image src={`/api/media/${b.coverKey}`} alt={b.title} fill style={{ objectFit: "cover" }} />
                ) : (
                  <i className="ph ph-image" style={{ fontSize: 30, color: "rgba(31,58,39,.4)" }} />
                )}
                <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(31,58,39,.9)", color: "#E7EFE0", fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 99 }}>
                  {b.category?.name ?? "Info"}
                </span>
              </div>
              <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                <span style={{ fontSize: 12, color: "var(--text-placeholder)", fontWeight: 500 }}>{b.date}</span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "17.5px", lineHeight: 1.25, color: "var(--green-deep)", margin: 0 }}>{b.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .section-title { font-size: 40px; }
        .berita-all-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 18px; border-radius: 10px; border: 1px solid #C7CDBA; color: var(--green-deep); font-weight: 600; font-size: 14px; transition: background .15s; }
        .berita-all-btn:hover { background: #EFEAD9; }
        .berita-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 20px; }
        .berita-card { display: flex; flex-direction: column; background: var(--bg); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; transition: transform .2s; }
        .berita-card:hover { transform: translateY(-4px); }
        @media (max-width: 900px) { .berita-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) {
          .section-title { font-size: 26px !important; line-height: 1.2 !important; }
        }
      `}</style>
    </section>
  );
}

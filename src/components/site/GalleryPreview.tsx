import Link from "next/link";
import Image from "next/image";

interface Photo {
  id: number;
  caption: string;
  imageKey: string | null;
  colSpan: number;
  rowSpan: number;
  category: { name: string } | null;
}

const GRADIENT_BG = [
  "linear-gradient(150deg,#8FAE85,#5F7E58)",
  "linear-gradient(150deg,#C9B98A,#A99A60)",
  "linear-gradient(150deg,#B6C7AC,#8FAE85)",
  "linear-gradient(150deg,#6E8C66,#4A6B4A)",
  "linear-gradient(150deg,#D2C28F,#B6A463)",
  "linear-gradient(150deg,#9DB793,#728F69)",
];

export default function GalleryPreview({ photos }: { photos: Photo[] }) {
  return (
    <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "12px var(--pad-x) 56px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 26, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
            <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Galeri
          </div>
          <h2 className="section-title" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 36, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: 0 }}>
            Potret Keseharian Santri
          </h2>
        </div>
        <Link href="/galeri" className="gallery-all-btn">
          Buka Galeri <i className="ph ph-arrow-right" />
        </Link>
      </div>

      <div className="gallery-preview-grid">
        {photos.map((g, i) => (
          <div
            key={g.id}
            style={{
              gridColumn: `span ${g.colSpan}`,
              gridRow: `span ${g.rowSpan}`,
              borderRadius: 16,
              background: GRADIENT_BG[i % GRADIENT_BG.length],
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              padding: 14,
            }}
            className="gallery-item"
          >
            {g.imageKey && <Image src={`/api/media/${g.imageKey}`} alt={g.caption} fill style={{ objectFit: "cover" }} />}
            <i className="ph ph-image" style={{ position: "absolute", top: 14, left: 14, fontSize: 22, color: "rgba(255,255,255,.55)", zIndex: 1 }} />
            <span style={{ position: "relative", zIndex: 1, color: "#F4F0E6", fontSize: 13, fontWeight: 600, textShadow: "0 1px 8px rgba(0,0,0,.4)" }}>{g.caption}</span>
          </div>
        ))}
      </div>

      <style>{`
        .section-title { font-size: 36px; }
        .gallery-preview-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: 150px; gap: 14px; }
        .gallery-item:hover { filter: brightness(1.03); }
        .gallery-all-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 18px; border-radius: 10px; border: 1px solid #C7CDBA; color: var(--green-deep); font-weight: 600; font-size: 14px; transition: background .15s; }
        .gallery-all-btn:hover { background: #EFEAD9; }
        @media (max-width: 900px) {
          .section-title { font-size: 26px !important; }
          .gallery-preview-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: 150px; }
          .gallery-item { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
        @media (max-width: 540px) {
          .gallery-preview-grid { grid-template-columns: 1fr; grid-auto-rows: 160px; }
          .gallery-item { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
      `}</style>
    </section>
  );
}

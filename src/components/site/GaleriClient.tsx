"use client";
import { useState } from "react";
import Image from "next/image";

interface Category { id: number; name: string; slug: string; }
interface Photo { id: number; caption: string; imageKey: string | null; colSpan: number; rowSpan: number; categorySlug: string; categoryName: string; }

const GRADIENTS = [
  "linear-gradient(150deg,#8FAE85,#5F7E58)",
  "linear-gradient(150deg,#C9B98A,#A99A60)",
  "linear-gradient(150deg,#B6C7AC,#8FAE85)",
  "linear-gradient(150deg,#6E8C66,#4A6B4A)",
  "linear-gradient(150deg,#D2C28F,#B6A463)",
  "linear-gradient(150deg,#9DB793,#728F69)",
];

export default function GaleriClient({ categories, photos }: { categories: Category[]; photos: Photo[] }) {
  const [active, setActive] = useState("semua");
  const [lb, setLb] = useState<Photo | null>(null);

  const visible = active === "semua" ? photos : photos.filter(p => p.categorySlug === active);

  return (
    <>
      {/* Filter */}
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "26px var(--pad-x) 8px" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {categories.map(c => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              style={{
                padding: "9px 18px", borderRadius: 99, fontSize: "13.5px", fontWeight: 600, cursor: "pointer",
                border: `1px solid ${active === c.slug ? "var(--green)" : "#D8D0BC"}`,
                background: active === c.slug ? "var(--green)" : "var(--card)",
                color: active === c.slug ? "#F4F0E6" : "var(--text-muted)",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "22px var(--pad-x) 56px" }}>
        <div className="galeri-grid">
          {visible.map((p, i) => (
            <div
              key={p.id}
              onClick={() => setLb(p)}
              className="galeri-item"
              style={{
                gridColumn: `span ${p.colSpan}`,
                gridRow: `span ${p.rowSpan}`,
                background: GRADIENTS[i % GRADIENTS.length],
              }}
            >
              {p.imageKey && <Image src={`/api/media/${p.imageKey}`} alt={p.caption} fill style={{ objectFit: "cover", zIndex: 0 }} />}
              <i className="ph ph-magnifying-glass-plus" style={{ position: "absolute", top: 16, right: 16, fontSize: 20, color: "rgba(255,255,255,.7)", zIndex: 2 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(31,58,39,.45),transparent 55%)", zIndex: 1 }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ display: "inline-block", background: "rgba(217,169,58,.92)", color: "var(--gold-dark)", fontSize: "10.5px", fontWeight: 700, padding: "3px 9px", borderRadius: 99, marginBottom: 7 }}>{p.categoryName}</span>
                <div style={{ color: "#F4F0E6", fontSize: 14, fontWeight: 700, textShadow: "0 1px 8px rgba(0,0,0,.4)" }}>{p.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lb && (
        <div onClick={() => setLb(null)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(20,30,22,.82)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ position: "relative", width: "min(820px,90vw)", aspectRatio: "16/10", borderRadius: 20, background: GRADIENTS[0], display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 80px -20px rgba(0,0,0,.6)", overflow: "hidden" }}>
            {lb.imageKey
              ? <Image src={`/api/media/${lb.imageKey}`} alt={lb.caption} fill style={{ objectFit: "cover" }} />
              : <i className="ph ph-image" style={{ fontSize: 56, color: "rgba(255,255,255,.5)" }} />}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 24, background: "linear-gradient(to top,rgba(31,58,39,.7),transparent)", borderRadius: "0 0 20px 20px", zIndex: 2 }}>
              <span style={{ display: "inline-block", background: "var(--gold)", color: "var(--gold-dark)", fontSize: 11, fontWeight: 700, padding: "4px 11px", borderRadius: 99, marginBottom: 8 }}>{lb.categoryName}</span>
              <div style={{ color: "#F4F0E6", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22 }}>{lb.caption}</div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setLb(null); }}
              aria-label="Tutup"
              style={{ position: "absolute", top: -16, right: -16, width: 44, height: 44, borderRadius: 99, border: "none", background: "#F4F0E6", color: "var(--green-deep)", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}
            >
              <i className="ph ph-x" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .galeri-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: 200px; gap: 14px; grid-auto-flow: dense; }
        .galeri-item { border-radius: 18px; position: relative; overflow: hidden; cursor: pointer; display: flex; align-items: flex-end; padding: 16px; }
        .galeri-item:hover { filter: brightness(1.04); }
        @media (max-width: 900px) { .galeri-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: 150px; } }
        @media (max-width: 540px) { .galeri-grid { grid-template-columns: 1fr; grid-auto-rows: 160px; } }
      `}</style>
    </>
  );
}

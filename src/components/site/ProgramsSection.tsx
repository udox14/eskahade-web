import type { ProgramRow } from "@/modules/programs/repo";

export default function ProgramsSection({ programs }: { programs: ProgramRow[] }) {
  return (
    <section id="program" style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "28px var(--pad-x) 56px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 34, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
            <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Jenjang Pendidikan
          </div>
          <h2 className="section-title" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 40, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: 0, maxWidth: 560, lineHeight: 1.1 }}>
            Satu Atap, Beragam Jalur Keilmuan
          </h2>
        </div>
        <p style={{ fontSize: 15, color: "var(--text-dim)", maxWidth: 360, lineHeight: 1.65, margin: 0 }}>
          Dari pendidikan diniyah salafiyah hingga jenjang formal terakreditasi, santri tumbuh seimbang antara ilmu agama dan kompetensi umum.
        </p>
      </div>

      <div className="programs-grid">
        {programs.map(p => (
          <div key={p.id} className="program-card">
            <div style={{ width: 50, height: 50, borderRadius: 13, background: "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", fontSize: 25, marginBottom: 18 }}>
              <i className={`ph ph-${p.icon}`} />
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, color: "var(--green-deep)", margin: "0 0 7px" }}>{p.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)", margin: "0 0 14px" }}>{p.description}</p>
            <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, color: "var(--green-accent)", background: "#EBF0E4", padding: "5px 11px", borderRadius: 99 }}>{p.tag}</span>
          </div>
        ))}
      </div>

      <style>{`
        .section-title { font-size: 40px; }
        .programs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .program-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 26px; transition: border-color .2s, transform .2s; }
        .program-card:hover { transform: translateY(-3px); border-color: var(--border-hover); }
        @media (max-width: 900px) { .programs-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 768px) {
          .section-title { font-size: 26px !important; line-height: 1.2 !important; }
        }
        @media (max-width: 540px) { .programs-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

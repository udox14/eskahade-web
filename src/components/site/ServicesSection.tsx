import type { ServiceRow } from "@/modules/services/repo";
import Link from "next/link";

const SCHEME_STYLES: Record<string, { bg: string; border: string; ic: string; tc: string; sc: string }> = {
  green:  { bg: "var(--green)", border: "var(--green)", ic: "var(--gold)", tc: "#F4F0E6", sc: "#C2D2B8" },
  gold:   { bg: "var(--gold)", border: "var(--gold)", ic: "var(--gold-dark)", tc: "var(--gold-dark)", sc: "#6B5418" },
  light:  { bg: "var(--card)", border: "var(--border)", ic: "var(--green)", tc: "var(--green-deep)", sc: "var(--text-dim)" },
};

export default function ServicesSection({ services }: { services: ServiceRow[] }) {
  return (
    <section id="layanan" style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "36px var(--pad-x) 12px" }}>
      <div className="services-grid">
        {services.map(s => {
          const st = SCHEME_STYLES[s.scheme] ?? SCHEME_STYLES.light;
          return (
            <Link
              key={s.id}
              href={s.href}
              className="service-card"
              style={{ background: st.bg, border: `1px solid ${st.border}` }}
            >
              <i className={`ph ph-${s.icon}`} style={{ fontSize: 30, color: st.ic }} />
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 19, color: st.tc, marginBottom: 5 }}>{s.title}</div>
                <div style={{ fontSize: "13.5px", lineHeight: 1.5, color: st.sc }}>{s.description}</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "13.5px", fontWeight: 600, color: st.tc }}>
                {s.cta} <i className="ph ph-arrow-right" />
              </span>
            </Link>
          );
        })}
      </div>
      <style>{`
        .services-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .service-card { position: relative; display: flex; flex-direction: column; gap: 16px; padding: 26px; border-radius: 20px; overflow: hidden; transition: transform .2s; }
        .service-card:hover { transform: translateY(-4px); }
        @media (max-width: 900px) { .services-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

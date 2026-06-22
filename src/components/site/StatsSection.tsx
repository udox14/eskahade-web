import type { StatRow } from "@/modules/stats/repo";

export default function StatsSection({ stats }: { stats: StatRow[] }) {
  return (
    <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "48px var(--pad-x)" }}>
      <div className="stats-grid" style={{ background: "var(--green-deep)", borderRadius: 26, padding: "40px 36px" }}>
        {stats.map(st => (
          <div key={st.id} style={{ textAlign: "center", padding: 6 }}>
            <i className={`ph ph-${st.icon}`} style={{ fontSize: 28, color: "var(--gold)", marginBottom: 10, display: "block" }} />
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 38, color: "#F4F0E6", lineHeight: 1 }}>{st.number}</div>
            <div style={{ fontSize: "13.5px", color: "#A8BCA0", fontWeight: 500, marginTop: 7 }}>{st.label}</div>
          </div>
        ))}
      </div>
      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px) {
          .stats-grid { padding: 24px 16px !important; gap: 16px !important; }
        }
        @media (max-width: 540px) { .stats-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

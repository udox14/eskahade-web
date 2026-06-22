import type { EventRow } from "@/modules/events/repo";

interface Props {
  events: EventRow[];
  settings: Record<string, string>;
}

export default function AgendaSection({ events, settings }: Props) {
  return (
    <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "56px var(--pad-x)" }}>
      <div className="agenda-grid">
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
            <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Agenda
          </div>
          <h2 className="section-title" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 38, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: "0 0 16px", lineHeight: 1.1 }}>
            Kegiatan Mendatang
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)", margin: "0 0 24px" }}>
            Ikuti rangkaian kegiatan akademik dan keagamaan pesantren. Jadwal dapat berubah; ikuti kanal resmi untuk pembaruan.
          </p>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "13px 20px", borderRadius: 11, background: "var(--green)", color: var_("--bg"), fontWeight: 600, fontSize: "14.5px" }}
             className="agenda-cal-btn">
            <i className="ph ph-calendar-dots" /> Kalender Lengkap
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {events.map(a => (
            <div key={a.id} className="agenda-item">
              <div style={{ textAlign: "center", minWidth: 58 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: "var(--green)", lineHeight: 1 }}>{a.day}</div>
                <div style={{ fontSize: 12, color: "var(--text-placeholder)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{a.month}</div>
              </div>
              <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)" }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--green-deep)", margin: "0 0 4px" }}>{a.title}</h3>
                <div className="agenda-meta" style={{ fontSize: 13, color: "var(--text-faint)", display: "flex", gap: 16 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="ph ph-clock" /> {a.time}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="ph ph-map-pin" /> {a.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .section-title { font-size: 38px; }
        .agenda-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 44px; align-items: start; }
        .agenda-item { display: flex; align-items: center; gap: 20px; padding: 18px 22px; background: var(--card); border: 1px solid var(--border); border-radius: 16px; }
        .agenda-item:hover { border-color: var(--border-hover); }
        .agenda-cal-btn { display: inline-flex; align-items: center; gap: 9px; padding: 13px 20px; border-radius: 11px; background: var(--green); color: var(--bg); font-weight: 600; font-size: 14.5px; transition: background .15s; }
        .agenda-cal-btn:hover { background: var(--green-hover); }
        @media (max-width: 900px) { .agenda-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) {
          .section-title { font-size: 26px !important; line-height: 1.2 !important; }
        }
        @media (max-width: 600px) {
          .agenda-item { padding: 14px 16px !important; gap: 14px !important; }
          .agenda-meta { gap: 8px 12px !important; flex-wrap: wrap; }
        }
      `}</style>
    </section>
  );
}

// tiny helper to use CSS var in inline style (TypeScript doesn't like var(--x) in style values)
function var_(name: string) { return `var(${name})` as unknown as string; }

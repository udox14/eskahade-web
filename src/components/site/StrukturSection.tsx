import Link from "next/link";
import type { OrgMemberRow } from "@/modules/org/repo";
import Image from "next/image";

interface Props {
  pimpinan: OrgMemberRow | null;
  struktur: OrgMemberRow[];
}

export default function StrukturSection({ pimpinan, struktur }: Props) {
  return (
    <section id="struktur" style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "60px var(--pad-x)" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
          <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Struktur Organisasi
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 38, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: 0 }}>
          Pengasuh &amp; Pengurus
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        {/* Pimpinan */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "26px 34px", textAlign: "center", minWidth: 280 }}>
          <div style={{ width: 72, height: 72, borderRadius: 99, margin: "0 auto 14px", background: "#DCE6D5", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", fontSize: 32, overflow: "hidden" }}>
            {pimpinan?.imageKey
              ? <Image src={`/api/media/${pimpinan.imageKey}`} alt={pimpinan.name} width={72} height={72} style={{ objectFit: "cover", width: 72, height: 72 }} />
              : <i className="ph ph-user" />}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>Pengasuh / Pimpinan</div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 21, color: "var(--green-deep)" }}>
            {pimpinan?.name ?? "K.H. Ahmad Fauzi Sukahideng"}
          </div>
        </div>

        <div style={{ width: "1.5px", height: 28, background: "#D6CFB9" }} />

        {/* Pengurus */}
        <div className="struktur-grid">
          {struktur.map(o => (
            <div key={o.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 22, textAlign: "center" }}>
              <div style={{ width: 54, height: 54, borderRadius: 99, margin: "0 auto 12px", background: "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", fontSize: 24, overflow: "hidden" }}>
                {o.imageKey
                  ? <Image src={`/api/media/${o.imageKey}`} alt={o.name} width={54} height={54} style={{ objectFit: "cover", width: 54, height: 54 }} />
                  : <i className={`ph ph-${o.icon}`} />}
              </div>
              <div style={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 4 }}>{o.role}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--green-deep)" }}>{o.name}</div>
            </div>
          ))}
        </div>

        <Link href="/profil#struktur" style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--green)" }}>
          Lihat struktur lengkap <i className="ph ph-arrow-right" />
        </Link>
      </div>

      <style>{`
        .struktur-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; width: 100%; }
        @media (max-width: 900px) { .struktur-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px) { .struktur-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

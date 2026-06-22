import type { TestimonialRow } from "@/modules/testimonials/repo";
import Image from "next/image";

export default function TestimoniSection({ testimonials }: { testimonials: TestimonialRow[] }) {
  return (
    <section style={{ background: "var(--section-alt)" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "60px var(--pad-x)" }}>
        <div style={{ textAlign: "center", marginBottom: 38 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
            <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Testimoni
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 38, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: 0 }}>
            Kata Mereka Tentang Sukahideng
          </h2>
        </div>

        <div className="testi-grid">
          {testimonials.map(t => (
            <div key={t.id} style={{ background: "#F6F3EA", border: "1px solid #DCE2D0", borderRadius: 20, padding: 28 }}>
              <i className="ph-fill ph-quotes" style={{ fontSize: 30, color: "#C7D2B9" }} />
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#404A38", margin: "14px 0 22px" }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                {t.imageKey ? (
                  <Image src={`/api/media/${t.imageKey}`} alt={t.name} width={46} height={46} style={{ borderRadius: "99px", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 46, height: 46, borderRadius: 99, background: t.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: 16 }}>
                    {t.initials}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14.5px", color: "var(--green-deep)" }}>{t.name}</div>
                  <div style={{ fontSize: "12.5px", color: "var(--text-faint)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media (max-width: 900px) { .testi-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

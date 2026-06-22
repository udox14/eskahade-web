import type { HeroRow } from "@/modules/hero/repo";
import Image from "next/image";

interface Props {
  hero: HeroRow | null;
  settings: Record<string, string>;
}

export default function HeroSection({ hero, settings }: Props) {
  const h = hero ?? {
    badgeText: "Berkhidmat sejak 1922",
    headingPre: "Menempa Generasi",
    headingHighlight: "Berilmu",
    headingPost: "& Berakhlak Mulia",
    subheading: "Memadukan tradisi keilmuan pesantren salafiyah dengan pendidikan formal yang modern — membentuk santri yang mendalam ilmunya, kokoh imannya, dan bermanfaat bagi masyarakat.",
    cta1Label: "Penerimaan Santri Baru",
    cta1Href: "/#layanan",
    cta2Label: "Jelajahi Pesantren",
    cta2Href: "/profil",
    imageKey: null,
    floatNumber: "2.400+",
    floatLabel: "Santri Aktif",
    accentNumber: "100Th+",
    accentLabel: "Pengabdian",
  };

  return (
    <section style={{ position: "relative", maxWidth: "var(--max-w)", margin: "0 auto", padding: "56px var(--pad-x) 40px" }}>
      <div className="hero-grid">
        {/* Text side */}
        <div>
          <p className="hero-arabic" style={{ fontFamily: "var(--font-arabic)", fontSize: 22, color: "var(--green-mid)", margin: "0 0 18px" }}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "6px 14px", border: "1px solid #C9CFBC", borderRadius: 99, fontSize: "12.5px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--green-accent)", marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, background: "var(--gold)", borderRadius: 99 }} />
            {h.badgeText}
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 56, lineHeight: 1.04, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: "0 0 22px" }}
              className="hero-h1">
            {h.headingPre}{" "}
            <span style={{ color: "var(--green)", fontStyle: "italic", fontFamily: "var(--font-heading)" }}>{h.headingHighlight}</span>
            {h.headingPost ? ` ${h.headingPost}` : ""}
          </h1>
          <p style={{ fontSize: "17.5px", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 520, margin: "0 0 32px" }}>
            {h.subheading}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <a href={h.cta1Href} className="hero-cta-primary">
              <i className="ph ph-student" /> {h.cta1Label}
            </a>
            <a href={h.cta2Href} className="hero-cta-secondary">
              {h.cta2Label}
            </a>
          </div>
        </div>

        {/* Image side */}
        <div style={{ position: "relative" }} className="hero-img-col">
          <div style={{ position: "relative", aspectRatio: "4/4.4", borderRadius: 26, overflow: "hidden", background: "linear-gradient(160deg,#B8CBAE 0%,#93AE89 60%,#6E8C66 100%)", border: "1px solid #cfd6c4" }}>
            {h.imageKey ? (
              <Image src={`/api/media/${h.imageKey}`} alt="Lingkungan Pesantren" fill style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#2F4A33" }}>
                <i className="ph ph-mosque" style={{ fontSize: 64, opacity: 0.55 }} />
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", opacity: 0.7 }}>Foto Lingkungan Pesantren</span>
              </div>
            )}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "45%", background: "linear-gradient(to top,rgba(31,58,39,.5),transparent)" }} />
          </div>

          {/* Floating stat */}
          <div style={{ position: "absolute", left: -26, bottom: 34, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "18px 20px", boxShadow: "0 18px 40px -22px rgba(31,58,39,.45)", animation: "floatUp 6s ease-in-out infinite", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", fontSize: 24 }}>
              <i className="ph ph-users-three" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 24, color: "var(--green-deep)", lineHeight: 1 }}>{h.floatNumber}</div>
              <div style={{ fontSize: "12.5px", color: "var(--text-faint)", fontWeight: 500 }}>{h.floatLabel}</div>
            </div>
          </div>

          {/* Accent badge */}
          <div style={{ position: "absolute", right: -14, top: 26, background: "var(--gold)", color: "var(--gold-dark)", borderRadius: 14, padding: "12px 16px", boxShadow: "0 14px 30px -18px rgba(58,45,8,.6)", transform: "rotate(3deg)" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{h.accentNumber}</div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>{h.accentLabel}</div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 48px; align-items: center; }
        .hero-h1 { font-size: 56px; }
        .hero-cta-primary { display: inline-flex; align-items: center; gap: 9px; padding: 14px 24px; border-radius: 12px; background: var(--green); color: var(--bg); font-weight: 700; font-size: 15.5px; transition: background .15s; }
        .hero-cta-primary:hover { background: var(--green-hover); }
        .hero-cta-secondary { display: inline-flex; align-items: center; gap: 9px; padding: 14px 24px; border-radius: 12px; background: transparent; border: 1px solid #C7CDBA; color: var(--green-deep); font-weight: 600; font-size: 15.5px; transition: background .15s; }
        .hero-cta-secondary:hover { background: #EBE5D5; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-img-col { display: none; }
          .hero-h1 { font-size: 36px !important; }
        }
        @media (max-width: 540px) {
          .hero-h1 { font-size: 28px !important; }
          .hero-arabic { font-size: 18px !important; margin-bottom: 12px !important; }
        }
        @media (max-width: 480px) {
          .hero-cta-primary, .hero-cta-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

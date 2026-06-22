import Link from "next/link";
import Image from "next/image";

interface Props {
  settings: Record<string, string>;
}

export default function SiteFooter({ settings }: Props) {
  const ig = settings["social_instagram_url"] ?? "#";
  const yt = settings["social_youtube_url"] ?? "#";
  const fb = settings["social_facebook_url"] ?? "#";
  const logoKey = settings["logo_key"];

  return (
    <footer style={{ background: "var(--footer-bg)", color: "#C7D2BC" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "56px var(--pad-x) 28px" }}>
        <div className="footer-grid">
          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              {logoKey ? (
                <Image src={`/api/media/${logoKey}`} alt="Logo" width={52} height={52} style={{ height: 52, width: "auto" }} />
              ) : (
                <div style={{ width: 52, height: 52, background: "var(--footer-inner)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#C7D2BC" }}>
                  <i className="ph ph-mosque" style={{ fontSize: 24 }} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, gap: 2 }}>
                <span style={{ fontSize: "9.5px", color: "#97A78D", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>Lembaga Pendidikan</span>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17, color: "#F4F0E6", letterSpacing: "0.02em", textTransform: "uppercase", lineHeight: 1.05 }}>
                  {settings["nama_lembaga"] ?? "Pondok Pesantren Sukahideng"}
                </span>
                <span style={{ fontSize: "9.5px", color: "#97A78D", fontWeight: 500, letterSpacing: "0.02em" }}>
                  {settings["sub_lokasi"] ?? "Kab. Tasikmalaya · Jawa Barat"}
                </span>
              </div>
            </div>
            <p style={{ fontSize: "13.5px", lineHeight: 1.7, color: "#97A78D", maxWidth: 280 }}>
              {settings["footer_tagline"] ?? "Lembaga Pendidikan Pondok Pesantren Sukahideng — Tasikmalaya. Berkhidmat membina umat melalui ilmu dan akhlak."}
            </p>
          </div>

          {/* Jelajahi */}
          <div>
            <div style={{ fontWeight: 700, color: "#F4F0E6", fontSize: 14, marginBottom: 16 }}>Jelajahi</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: "13.5px" }}>
              {[["Profil Pesantren", "/profil"], ["Program Pendidikan", "/#program"], ["Berita", "/berita"], ["Galeri", "/galeri"], ["Struktur Organisasi", "/#struktur"]].map(([l, h]) => (
                <Link key={h} href={h} style={{ color: "#C7D2BC" }} className="footer-link">{l}</Link>
              ))}
            </div>
          </div>

          {/* Layanan */}
          <div>
            <div style={{ fontWeight: 700, color: "#F4F0E6", fontSize: 14, marginBottom: 16 }}>Layanan</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: "13.5px" }}>
              {[["ESKAHADE", "#"], ["PSB — Santri Baru", "#"], ["Web IKHLASH Alumni", "#"]].map(([l, h]) => (
                <Link key={l} href={h} style={{ color: "#C7D2BC" }} className="footer-link">{l}</Link>
              ))}
            </div>
          </div>

          {/* Kontak */}
          <div>
            <div style={{ fontWeight: 700, color: "#F4F0E6", fontSize: 14, marginBottom: 16 }}>Kontak</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: "13.5px", color: "#97A78D" }}>
              <span style={{ display: "flex", gap: 9 }}><i className="ph ph-map-pin" style={{ color: "var(--gold)" }} /> {settings["contact_location_short"] ?? "Sukarame, Tasikmalaya"}</span>
              <span style={{ display: "flex", gap: 9 }}><i className="ph ph-phone" style={{ color: "var(--gold)" }} /> {settings["contact_phone1"] ?? "(0265) 545 123"}</span>
              <span style={{ display: "flex", gap: 9 }}><i className="ph ph-envelope-simple" style={{ color: "var(--gold)" }} /> {settings["contact_email"] ?? "info@ppsukahideng.sch.id"}</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              {[[ig, "instagram-logo"], [yt, "youtube-logo"], [fb, "facebook-logo"]].map(([href, icon]) => (
                <a key={icon} href={href} className="footer-social" aria-label={icon}>
                  <i className={`ph ph-${icon}`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border-footer)", marginTop: 40, paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: "12.5px", color: "#7E8F75" }}>
          <span>{settings["footer_copyright"] ?? `© 2026 Pondok Pesantren Sukahideng. Hak cipta dilindungi.`}</span>
          <span>{settings["footer_managed_by"] ?? "Dikelola oleh Tim Media Sukahideng"}</span>
        </div>
      </div>

      <style>{`
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.1fr; gap: 36px; }
        .footer-link:hover { color: #F4F0E6; }
        .footer-social { width: 38px; height: 38px; border-radius: 10px; background: var(--footer-inner); display: flex; align-items: center; justify-content: center; color: #C7D2BC; font-size: 18px; transition: background .15s, color .15s; }
        .footer-social:hover { background: var(--green); color: #F4F0E6; }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px) { .footer-grid { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}

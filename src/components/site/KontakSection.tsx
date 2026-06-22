interface Props {
  settings: Record<string, string>;
}

export default function KontakSection({ settings }: Props) {
  const alamat = settings["contact_address"] ?? "Kp. Sukahideng, Ds. Sukarapih, Kec. Sukarame, Kab. Tasikmalaya, Jawa Barat 46461";
  const phone1 = settings["contact_phone1"] ?? "(0265) 545 123";
  const phone2 = settings["contact_phone2"] ?? "0812 3456 7890";
  const email = settings["contact_email"] ?? "info@ppsukahideng.sch.id";
  const mapsUrl = settings["contact_maps_url"] ?? "#";
  const mapsEmbed = settings["contact_maps_embed"] ?? "";

  return (
    <section id="kontak" style={{ background: "var(--card)", borderTop: "1px solid #ECE6D6" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "60px var(--pad-x)" }}>
        <div className="kontak-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
              <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Kontak &amp; Lokasi
            </div>
            <h2 className="section-title" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 36, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: "0 0 24px", lineHeight: 1.1 }}>
              Berkunjung &amp; Silaturahmi
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <ContactRow icon="map-pin">
                <strong>Alamat</strong>
                <p>{alamat}</p>
              </ContactRow>
              <ContactRow icon="phone">
                <strong>Telepon</strong>
                <p>{phone1} · {phone2}</p>
              </ContactRow>
              <ContactRow icon="envelope-simple">
                <strong>Email</strong>
                <p>{email}</p>
              </ContactRow>
            </div>
          </div>

          <div style={{ borderRadius: 22, overflow: "hidden", border: "1px solid var(--border)", minHeight: 320, background: "#DCE6D5", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {mapsEmbed ? (
              <iframe src={mapsEmbed} width="100%" height="100%" style={{ border: 0, position: "absolute", inset: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" title="Peta Lokasi" />
            ) : (
              <div style={{ textAlign: "center", color: "#2F4A33" }}>
                <i className="ph ph-map-trifold" style={{ fontSize: 50, opacity: 0.55 }} />
                <div style={{ fontSize: "13.5px", fontWeight: 600, marginTop: 10, opacity: 0.75 }}>Peta Lokasi — Google Maps</div>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 14, padding: "9px 16px", background: "var(--green)", color: "#F4F0E6", borderRadius: 9, fontSize: "13.5px", fontWeight: 600 }}>
                  Buka di Maps <i className="ph ph-arrow-up-right" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .section-title { font-size: 36px; }
        .kontak-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 40px; align-items: stretch; }
        @media (max-width: 900px) { .kontak-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) {
          .section-title { font-size: 26px !important; line-height: 1.2 !important; }
        }
      `}</style>
    </section>
  );
}

function ContactRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <i className={`ph ph-${icon}`} style={{ fontSize: 22, color: "var(--green)", marginTop: 2 }} />
      <div style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

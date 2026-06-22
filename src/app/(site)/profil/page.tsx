import { getProfileHero, getSambutan, getVision, getHistoryTimeline, getMissionPoints, getFacilities } from "@/modules/profile/repo";
import { getOrgMembers } from "@/modules/org/repo";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

export default async function ProfilPage() {
  const [ph, sambutan, vision, timeline, mission, facilities, orgMembers] = await Promise.all([
    getProfileHero(), getSambutan(), getVision(), getHistoryTimeline(), getMissionPoints(), getFacilities(), getOrgMembers(),
  ]);

  const pimpinan = orgMembers.find(m => m.level === "pimpinan");
  const pengurusAtas = orgMembers.filter(m => m.level === "atas");
  const pengurusBawah = orgMembers.filter(m => m.level === "bawah");

  return (
    <>
      {/* Breadcrumb + Hero */}
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "48px var(--pad-x) 20px" }}>
        <div style={{ fontSize: 13, color: "var(--text-placeholder)", marginBottom: 16 }}>
          <Link href="/" style={{ color: "var(--green-mid)" }}>Beranda</Link>
          <span style={{ margin: "0 6px" }}>/</span> Profil
        </div>
        <div className="profil-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 14 }}>
              <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Tentang Kami
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 48, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: "0 0 18px", lineHeight: 1.08 }}>
              {ph?.title ?? "Seabad Khidmat Membina Umat"}
            </h1>
            <p style={{ fontSize: "16.5px", lineHeight: 1.75, color: "var(--text-muted)", margin: 0, maxWidth: 520 }}>
              {ph?.paragraph ?? "Pondok Pesantren Sukahideng berdiri di Tasikmalaya sebagai lembaga pendidikan Islam yang menjaga tradisi salafiyah sekaligus merangkul kemajuan zaman."}
            </p>
          </div>
          <div style={{ aspectRatio: "4/3.4", borderRadius: 24, background: "linear-gradient(160deg,#B8CBAE,#6E8C66)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(47,74,51,.6)", border: "1px solid #cfd6c4", position: "relative", overflow: "hidden" }}>
            {ph?.imageKey
              ? <Image src={`/api/media/${ph.imageKey}`} alt="Gedung Pesantren" fill style={{ objectFit: "cover" }} />
              : <div style={{ textAlign: "center" }}><i className="ph ph-mosque" style={{ fontSize: 56 }} /><div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>Foto Gedung Pesantren</div></div>
            }
          </div>
        </div>
      </section>

      {/* Sambutan */}
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "36px var(--pad-x)" }}>
        <div style={{ background: "var(--green-deep)", borderRadius: 26, padding: 44 }} className="sambutan-grid">
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 150, height: 150, borderRadius: 26, margin: "0 auto 18px", background: "#DCE6D5", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", fontSize: 56, overflow: "hidden" }}>
              {sambutan?.imageKey
                ? <Image src={`/api/media/${sambutan.imageKey}`} alt={sambutan?.name ?? ""} width={150} height={150} style={{ objectFit: "cover" }} />
                : <i className="ph ph-user" />}
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, color: "#F4F0E6" }}>{sambutan?.name ?? "K.H. Ahmad Fauzi"}</div>
            <div style={{ fontSize: 13, color: "#A8BCA0", marginTop: 4 }}>{sambutan?.role ?? "Pengasuh / Pimpinan Pesantren"}</div>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-arabic)", fontSize: 22, color: "#D9C07E", margin: "0 0 16px" }}>
              {sambutan?.arabic ?? "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ"}
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "#D2DDC8", margin: "0 0 14px" }}>
              {sambutan?.paragraph1 ?? "Segala puji bagi Allah SWT. Selamat datang di laman resmi Pondok Pesantren Sukahideng. Kami berikhtiar membentuk insan yang mendalam ilmu agamanya, kokoh imannya, serta siap mengabdi bagi agama, bangsa, dan negara."}
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "#A8BCA0", margin: 0 }}>
              {sambutan?.paragraph2 ?? "Semoga laman ini menjadi jembatan silaturahmi dan informasi bagi para wali santri, alumni, dan masyarakat luas. Selamat menjelajah."}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "44px var(--pad-x)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
            <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Perjalanan
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 38, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: 0 }}>Jejak Sejarah Sukahideng</h2>
        </div>
        <div className="timeline-grid">
          {timeline.map(t => (
            <div key={t.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 26 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 30, color: "var(--gold)", marginBottom: 10 }}>{t.year}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--green-deep)", margin: "0 0 7px" }}>{t.title}</h3>
              <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--text-dim)", margin: 0 }}>{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visi Misi */}
      <section style={{ background: "var(--card)", borderTop: "1px solid #ECE6D6", borderBottom: "1px solid #ECE6D6" }}>
        <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "52px var(--pad-x)" }}>
          <div className="vm-grid">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
                <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Visi
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 30, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: "0 0 18px", lineHeight: 1.2 }}>
                {vision?.visionText ?? "Terwujudnya generasi Qur'ani yang berilmu, beramal, dan berakhlakul karimah."}
              </h2>
              <div style={{ background: "var(--green-deep)", borderRadius: 18, padding: 24, color: "#D2DDC8" }}>
                <i className="ph ph-quotes" style={{ fontSize: 26, color: "var(--gold)" }} />
                <p style={{ fontSize: 15, lineHeight: 1.7, margin: "10px 0 0" }}>
                  {vision?.quoteText ?? "Mendidik dengan keteladanan, membina dengan kasih sayang, dan mengabdi untuk kemaslahatan umat."}
                </p>
              </div>
            </div>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 18 }}>
                <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Misi
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {mission.map(m => (
                  <div key={m.id} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 20px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16 }}>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "var(--green)", minWidth: 28 }}>{m.number}</div>
                    <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: "#44503C", margin: 0 }}>{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fasilitas */}
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "52px var(--pad-x)" }}>
        <div style={{ textAlign: "center", marginBottom: 38 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
            <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Fasilitas
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 38, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: 0 }}>Sarana Penunjang Santri</h2>
        </div>
        <div className="fasilitas-grid">
          {facilities.map(f => (
            <div key={f.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: 24, textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px", background: "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", fontSize: 27 }}>
                <i className={`ph ph-${f.icon}`} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--green-deep)" }}>{f.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Struktur lengkap */}
      <section id="struktur" style={{ background: "var(--section-alt)" }}>
        <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "56px var(--pad-x)" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
              <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Struktur Organisasi
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 38, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: 0 }}>Pengasuh &amp; Pengurus</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <OrgCard size="lg" member={pimpinan} fallbackName="K.H. Ahmad Fauzi" label="Pengasuh / Pimpinan" />
            <div style={{ width: "1.5px", height: 30, background: "#C7D1B9" }} />
            <div className="str1-grid">
              {pengurusAtas.map(o => <OrgCard key={o.id} size="md" member={o} />)}
            </div>
            <div style={{ width: "1.5px", height: 30, background: "#C7D1B9" }} />
            <div className="str2-grid">
              {pengurusBawah.map(o => <OrgCard key={o.id} size="sm" member={o} />)}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .profil-hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 44px; align-items: center; }
        .sambutan-grid { display: grid; grid-template-columns: 0.6fr 1.4fr; gap: 40px; align-items: center; }
        .timeline-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
        .vm-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 40px; }
        .fasilitas-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .str1-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; width: 100%; max-width: 760px; }
        .str2-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; width: 100%; }
        @media (max-width: 900px) {
          .profil-hero-grid { grid-template-columns: 1fr; }
          .sambutan-grid { grid-template-columns: 1fr; }
          .timeline-grid { grid-template-columns: repeat(2,1fr); }
          .vm-grid { grid-template-columns: 1fr; }
          .fasilitas-grid { grid-template-columns: repeat(2,1fr); }
          .str1-grid { grid-template-columns: 1fr; }
          .str2-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 540px) {
          .timeline-grid { grid-template-columns: 1fr; }
          .str2-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

function OrgCard({ member, size, fallbackName, label }: { member: any; size: "lg" | "md" | "sm"; fallbackName?: string; label?: string }) {
  const sz = size === "lg" ? { avatar: 80, icon: 36, name: 22, bg: "#F6F3EA" } : size === "md" ? { avatar: 58, icon: 26, name: 16, bg: "#F6F3EA" } : { avatar: 50, icon: 22, name: 14.5, bg: "#F6F3EA" };
  return (
    <div style={{ background: sz.bg, border: "1px solid #DCE2D0", borderRadius: size === "lg" ? 22 : 18, padding: size === "lg" ? "28px 40px" : size === "md" ? 22 : 20, textAlign: "center", minWidth: size === "lg" ? 300 : undefined }}>
      <div style={{ width: sz.avatar, height: sz.avatar, borderRadius: 99, margin: "0 auto 12px", background: "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", fontSize: sz.icon, overflow: "hidden" }}>
        {member?.imageKey
          ? <Image src={`/api/media/${member.imageKey}`} alt={member?.name ?? ""} width={sz.avatar} height={sz.avatar} style={{ objectFit: "cover" }} />
          : <i className={`ph ph-${member?.icon ?? "user-circle"}`} />}
      </div>
      {(label ?? member?.role) && <div style={{ fontSize: size === "lg" ? 12 : 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: size === "lg" ? "var(--gold)" : "var(--green-mid)", marginBottom: 4 }}>{label ?? member?.role}</div>}
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: sz.name, color: "var(--green-deep)" }}>{member?.name ?? fallbackName}</div>
    </div>
  );
}

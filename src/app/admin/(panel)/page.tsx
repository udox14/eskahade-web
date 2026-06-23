import { db } from "@/lib/db";
import { services, stats, programs, events, testimonials, newsPosts, galleryPhotos, orgMembers, media } from "@/db/schema";
import { count } from "drizzle-orm";
import Link from "next/link";

async function getCounts() {
  const d = db();
  const [s, sv, st, pr, ev, te, np, gp, om] = await Promise.all([
    d.select({ n: count() }).from(services),
    d.select({ n: count() }).from(stats),
    d.select({ n: count() }).from(programs),
    d.select({ n: count() }).from(events),
    d.select({ n: count() }).from(testimonials),
    d.select({ n: count() }).from(newsPosts),
    d.select({ n: count() }).from(galleryPhotos),
    d.select({ n: count() }).from(orgMembers),
    d.select({ n: count() }).from(media),
  ]);
  return {
    services: s[0]?.n ?? 0,
    stats: sv[0]?.n ?? 0,
    programs: st[0]?.n ?? 0,
    events: pr[0]?.n ?? 0,
    testimonials: ev[0]?.n ?? 0,
    news: te[0]?.n ?? 0,
    gallery: np[0]?.n ?? 0,
    org: gp[0]?.n ?? 0,
    media: om[0]?.n ?? 0,
  };
}

const quickLinks = [
  { label: "Edit Hero / Banner", href: "/admin/hero", icon: "layout", color: "#2E5237" },
  { label: "Tambah Berita", href: "/admin/berita", icon: "newspaper", color: "#1A6B5A" },
  { label: "Upload Foto Galeri", href: "/admin/galeri", icon: "images", color: "#D9A93A" },
  { label: "Pengaturan Situs", href: "/admin/pengaturan", icon: "gear", color: "#4C5645" },
  { label: "Struktur Organisasi", href: "/admin/struktur", icon: "tree-structure", color: "#2E5237" },
  { label: "Perpustakaan Media", href: "/admin/media", icon: "folder-open", color: "#6E7B66" },
];

export default async function AdminDashboard() {
  let counts = { services: 0, stats: 0, programs: 0, events: 0, testimonials: 0, news: 0, gallery: 0, org: 0, media: 0 };
  try { counts = await getCounts(); } catch { /* DB not seeded yet */ }

  const statCards = [
    { label: "Berita & Kegiatan", value: counts.news, icon: "newspaper", href: "/admin/berita" },
    { label: "Foto Galeri", value: counts.gallery, icon: "images", href: "/admin/galeri" },
    { label: "Anggota Struktur", value: counts.org, icon: "tree-structure", href: "/admin/struktur" },
    { label: "File Media", value: counts.media, icon: "folder-open", href: "/admin/media" },
    { label: "Layanan Aktif", value: counts.services, icon: "squares-four", href: "/admin/services" },
    { label: "Program Pendidikan", value: counts.programs, icon: "books", href: "/admin/programs" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 28, color: "#1F3A27", margin: "0 0 6px" }}>Dashboard</h1>
        <p style={{ color: "#6E7B66", fontSize: 14, margin: 0 }}>Selamat datang di Panel Admin Pondok Pesantren Sukahideng.</p>
      </div>

      {/* Stat cards */}
      <div className="stat-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
        {statCards.map(c => (
          <Link key={c.label} href={c.href} style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid #E5EAE2", display: "flex", alignItems: "center", gap: 18, textDecoration: "none" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#E7EFE0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={`ph ph-${c.icon}`} style={{ fontSize: 24, color: "#2E5237" }} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1F3A27", lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 13, color: "#6E7B66", marginTop: 4 }}>{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "#1F3A27", margin: "0 0 16px" }}>Aksi Cepat</h2>
        <div className="quick-actions-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {quickLinks.map(l => (
            <Link key={l.label} href={l.href} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #E5EAE2", borderRadius: 14, padding: "16px 20px", textDecoration: "none", color: "#283325" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: l.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`ph ph-${l.icon}`} style={{ fontSize: 20, color: l.color }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{l.label}</span>
              <i className="ph ph-arrow-right" style={{ marginLeft: "auto", color: "#97A78D" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div style={{ marginTop: 32, padding: "16px 20px", background: "#FBF9F2", border: "1px solid #E5E0CA", borderRadius: 14 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <i className="ph ph-info" style={{ fontSize: 20, color: "#D9A93A", flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13.5, color: "#4C5645", lineHeight: 1.6 }}>
            Semua konten yang ditampilkan di website dapat dikelola dari panel ini. Gunakan menu di sebelah kiri untuk mengakses setiap bagian. Perubahan akan langsung terlihat di website setelah disimpan.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stat-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 550px) {
          .stat-cards-grid { grid-template-columns: 1fr !important; }
          .quick-actions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

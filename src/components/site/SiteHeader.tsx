"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  settings: Record<string, string>;
}

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Program", href: "/#program" },
  { label: "Berita", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
  { label: "Struktur", href: "/#struktur" },
  { label: "Kontak", href: "/#kontak" },
];

export default function SiteHeader({ settings }: Props) {
  const [open, setOpen] = useState(false);
  const ig = settings["social_instagram_url"] ?? "#";
  const yt = settings["social_youtube_url"] ?? "#";
  const igHandle = settings["social_instagram_handle"] ?? "@ppsukahideng";
  const phone = settings["contact_phone1"] ?? "(0265) 545 123";
  const lokasi = settings["contact_location_short"] ?? "Sukahideng, Sukarapih, Sukarame — Tasikmalaya";
  const logoKey = settings["logo_key"];

  return (
    <>
      {/* Utility bar */}
      <div style={{ background: "var(--util-bar)", color: "var(--util-text)", fontSize: 13 }}>
        <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "9px var(--pad-x)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <i className="ph ph-map-pin" style={{ color: "var(--gold)", fontSize: 15 }} />
              {lokasi}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, opacity: 0.82 }}>
              <i className="ph ph-phone" style={{ color: "var(--gold)", fontSize: 15 }} />
              {phone}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <a href={ig} style={{ color: "var(--util-text)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i className="ph ph-instagram-logo" /> {igHandle}
            </a>
            <span style={{ width: 1, height: 14, background: "#3C5642" }} />
            <a href={yt} style={{ color: "var(--util-text)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i className="ph ph-youtube-logo" /> YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(248,245,236,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border-nav)" }}>
        <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "14px var(--pad-x)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 13 }}>
            {logoKey ? (
              <Image src={`/api/media/${logoKey}`} alt="Logo" width={52} height={52} style={{ height: 52, width: "auto", objectFit: "contain" }} />
            ) : (
              <div style={{ width: 52, height: 52, background: "var(--green-soft)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)" }}>
                <i className="ph ph-mosque" style={{ fontSize: 28 }} />
              </div>
            )}
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, gap: 2 }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>Lembaga Pendidikan</span>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17, color: "var(--green-deep)", letterSpacing: "0.02em", textTransform: "uppercase", lineHeight: 1.05 }}>
                {settings["nama_lembaga"] ?? "Pondok Pesantren Sukahideng"}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-faint)", fontWeight: 500, letterSpacing: "0.02em" }}>
                {settings["sub_lokasi"] ?? "Kab. Tasikmalaya · Jawa Barat"}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="site-desktop-nav">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="site-nav-link">{l.label}</Link>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/#layanan" className="site-cta-btn">
              Daftar PSB <i className="ph ph-arrow-up-right" />
            </Link>
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
              className="site-mobile-btn"
            >
              <i className={`ph ph-${open ? "x" : "list"}`} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div style={{ borderTop: "1px solid var(--border-nav)", background: "var(--card)", padding: "12px var(--pad-x) 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {NAV_LINKS.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{ padding: "12px 8px", color: "var(--text-muted)", borderBottom: i < NAV_LINKS.length - 1 ? "1px solid #ECE6D6" : undefined, fontWeight: 500 }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <style>{`
        .site-desktop-nav { display: flex; }
        .site-mobile-btn { display: none; }
        .site-nav-link { padding: 9px 14px; border-radius: var(--radius-sm); font-size: 14.5px; font-weight: 500; color: var(--text-muted); transition: background .15s; }
        .site-nav-link:hover { background: #E8E2D0; }
        .site-cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 10px; background: var(--green); color: var(--bg); font-weight: 600; font-size: 14px; transition: background .15s; }
        .site-cta-btn:hover { background: var(--green-hover); }
        .site-mobile-btn { display: none; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 10px; border: 1px solid #D8D0BC; background: var(--card); cursor: pointer; color: var(--green-deep); font-size: 22px; }
        @media (max-width: 900px) {
          .site-desktop-nav { display: none !important; }
          .site-mobile-btn { display: flex !important; }
          .site-cta-btn { display: none; }
        }
      `}</style>
    </>
  );
}

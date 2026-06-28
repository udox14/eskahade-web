"use client";
import Link from "next/link";
import { Logo } from "@/components/psb/Logo";
import { useContent } from "@/lib/psb/use-content";
import { waLink } from "@/lib/psb/format";

const NAV = [
  { href: "/psb", label: "Beranda" },
  { href: "/psb/panduan", label: "Panduan" },
  { href: "/psb/persyaratan", label: "Persyaratan" },
  { href: "/psb/biaya", label: "Biaya" },
  { href: "/psb/agenda", label: "Agenda" },
  { href: "/psb/pendaftaran", label: "Daftar" },
];

export function Footer() {
  const c = useContent();
  return (
    <footer data-screen className="mt-20" style={{ background: "#1d2b22", color: "#c9d8cb" }}>
      <div className="mx-auto grid max-w-[1200px] gap-10 px-[clamp(16px,4vw,32px)] py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={48} />
            <span className="text-[15px] font-extrabold text-white">Pondok Pesantren Sukahideng</span>
          </div>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed">
            Penerimaan Santri Baru Tahun Pelajaran {c.tahunPelajaran}. {c.alamat}
          </p>
        </div>

        <div>
          <h4 className="text-[13px] font-bold uppercase tracking-[1.5px] text-white/70">Navigasi</h4>
          <ul className="mt-4 space-y-2 text-[14px]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[13px] font-bold uppercase tracking-[1.5px] text-white/70">Kontak</h4>
          <p className="mt-4 text-[14px] leading-relaxed">{c.alamat}</p>
          <a
            href={waLink(c.waBendahara)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-[14px] font-semibold text-[#9fd6a3] hover:underline"
          >
            Hubungi Bendahara via WhatsApp
          </a>
          <div className="mt-3">
            <Link href="/admin/login" className="text-[13px] text-white/50 hover:text-white/80">
              Login Admin
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[13px] text-white/50">
        © {new Date().getFullYear()} Pondok Pesantren Sukahideng. Hak cipta dilindungi.
      </div>
    </footer>
  );
}

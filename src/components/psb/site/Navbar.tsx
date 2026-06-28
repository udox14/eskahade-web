"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { List, SignIn, ArrowRight, X } from "@phosphor-icons/react";
import { Logo } from "@/components/psb/Logo";
import { cn } from "@/lib/psb/utils";

const LINKS = [
  { href: "/psb", label: "Beranda" },
  { href: "/psb/panduan", label: "Panduan" },
  { href: "/psb/persyaratan", label: "Persyaratan" },
  { href: "/psb/biaya", label: "Biaya" },
  { href: "/psb/agenda", label: "Agenda" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      data-screen
      className="sticky top-0 z-40 border-b border-[var(--border-nav,#e7ddcd)] backdrop-blur-md"
      style={{ background: "rgba(243,247,239,.88)", borderColor: "#dfe9d6" }}
    >
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-[clamp(16px,4vw,32px)] py-3">
        <Link href="/psb" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo size={44} />
          <span className="leading-tight">
            <span className="block text-[15.5px] font-extrabold text-ink whitespace-nowrap">
              Pondok Pesantren Sukahideng
            </span>
            <span className="block text-[11.5px] text-muted-foreground">
              Penerimaan Santri Baru · 2026/2027
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 min-[1016px]:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-[14px] font-semibold text-text transition-colors hover:bg-band",
                pathname === l.href && "text-brand",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/psb/login"
            className="ml-2 inline-flex items-center gap-2 rounded-[11px] border border-[#cfe0c4] px-4 py-2 text-[14px] font-semibold text-text transition-colors hover:border-brand"
          >
            <SignIn size={17} /> Masuk
          </Link>
          <Link
            href="/psb/pendaftaran"
            className="inline-flex items-center gap-2 rounded-[11px] bg-brand px-4 py-2 text-[14px] font-semibold text-white shadow-[0_2px_9px_rgba(63,143,90,.3)] transition-colors hover:bg-brand-hover"
          >
            Daftar <ArrowRight size={17} weight="bold" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[11px] border border-[#cfe0c4] text-ink min-[1016px]:hidden"
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#dfe9d6] px-[clamp(16px,4vw,32px)] py-3 min-[1016px]:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-semibold text-text hover:bg-band"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/psb/login"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-[11px] border border-[#cfe0c4] px-4 py-3 font-semibold text-text"
            >
              <SignIn size={18} /> Masuk
            </Link>
            <Link
              href="/psb/pendaftaran"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-[11px] bg-brand px-4 py-3 font-semibold text-white"
            >
              Daftar Sekarang <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";
import { CheckCircle, WhatsappLogo } from "@phosphor-icons/react";
import { useContent } from "@/lib/psb/use-content";
import { waLink } from "@/lib/psb/format";
import { PageHeader } from "@/components/psb/site/PageHeader";

export default function PanduanPage() {
  const c = useContent();
  return (
    <div data-screen className="mx-auto max-w-[820px] px-[clamp(16px,4vw,32px)] py-12">
      <PageHeader
        eyebrow="Informasi"
        title="Panduan Pendaftaran"
        desc="Ikuti langkah-langkah berikut untuk mendaftar sebagai santri baru."
      />

      <div className="rounded-[18px] border border-border bg-surface p-6">
        <h3 className="text-[17px] font-extrabold text-ink">A. Tata Cara Pendaftaran</h3>
        <ol className="mt-4 space-y-3">
          {c.panduanDaftar.map((step, i) => (
            <li key={i} className="flex gap-3 text-[14px] text-text">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tint text-[13px] font-bold text-brand-deep">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-5 rounded-[18px] border border-border bg-surface p-6">
        <h3 className="text-[17px] font-extrabold text-ink">B. Daftar Ulang</h3>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {(c.requirements.find((r) => r.title === "Berkas Daftar Ulang")?.items ?? []).map((it) => (
            <div key={it} className="flex items-start gap-2.5 text-[14px] text-text">
              <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-brand" />
              {it}
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-5 rounded-[18px] p-6 text-white"
        style={{ background: "linear-gradient(160deg,var(--brand-deep),var(--brand-deepest))" }}
      >
        <h3 className="text-[17px] font-extrabold">C. Narahubung</h3>
        <p className="mt-2 text-[14px] text-[#cfe0c4]">Klik nama untuk menghubungi via WhatsApp.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {c.contacts.slice(0, 4).map((k, i) => (
            <a
              key={i}
              href={waLink(k.wa)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-[12px] bg-white/5 px-4 py-3 transition hover:bg-white/10"
            >
              <WhatsappLogo size={18} weight="fill" className="text-[#9fd6a3]" />
              <span className="text-[14px] font-semibold">{k.nama}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

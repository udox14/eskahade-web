"use client";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  SealCheck,
  Mosque,
  CalendarDots,
  CalendarX,
  HouseLine,
  WhatsappLogo,
  IdentificationCard,
  Camera,
  UsersThree,
  CaretRight,
} from "@phosphor-icons/react";
import { useContent } from "@/lib/psb/use-content";
import { rupiah, waLink } from "@/lib/psb/format";

const DATE_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "calendar-dots": CalendarDots,
  "calendar-x": CalendarX,
  "seal-check": SealCheck,
  "house-line": HouseLine,
};

export default function LandingPage() {
  const c = useContent();

  return (
    <div data-screen>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        className="px-[clamp(16px,4vw,32px)] py-[clamp(40px,7vw,80px)]"
        style={{ background: "linear-gradient(160deg,#fbfdf8,#e9f2e0)" }}
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-[clamp(28px,5vw,56px)] lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-tint px-4 py-1.5 text-[12.5px] font-bold uppercase tracking-[1.5px] text-brand-deep">
              Tahun Pelajaran {c.tahunPelajaran}
            </span>
            <p className="mt-5 text-[13.5px] font-semibold text-brand" dir="rtl" style={{ fontSize: 18 }}>
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <h1 className="mt-3 text-[clamp(32px,5.5vw,52px)] font-extrabold leading-[1.08] tracking-[-1px] text-ink">
              Penerimaan Santri Baru
              <span className="block text-brand">Pondok Pesantren Sukahideng</span>
            </h1>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-text-soft">
              Bergabunglah bersama ribuan santri menimba ilmu agama dan umum di lingkungan pesantren
              yang Islami, disiplin, dan penuh keberkahan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/psb/pendaftaran"
                className="inline-flex items-center gap-2 rounded-[13px] bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_2px_9px_rgba(63,143,90,.3)] transition hover:bg-brand-hover"
              >
                Daftar Sekarang <ArrowRight size={18} weight="bold" />
              </Link>
              <Link
                href="/psb/panduan"
                className="inline-flex items-center gap-2 rounded-[13px] border border-[#cfe0c4] px-6 py-3.5 text-[15px] font-bold text-text transition hover:border-brand hover:bg-cream"
              >
                Panduan Pendaftaran
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { v: "25 Mar", l: "Dibuka" },
                { v: "30 Jun", l: "Ditutup" },
                { v: "Online", l: "Pendaftaran" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-[20px] font-extrabold text-ink">{s.v}</div>
                  <div className="text-[13px] text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className="flex aspect-[4/5] w-full items-center justify-center rounded-[22px] border border-border"
              style={{
                background:
                  "repeating-linear-gradient(45deg,#e9f2e0,#e9f2e0 12px,#eef4e8 12px,#eef4e8 24px)",
                boxShadow: "0 10px 30px rgba(40,80,40,.18)",
              }}
            >
              <div className="text-center text-muted-foreground">
                <Mosque size={64} />
                <p className="mt-2 font-mono text-[12px]">foto / suasana pesantren</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 shadow-[0_10px_30px_rgba(40,80,40,.18)]">
              <SealCheck size={26} className="text-brand" weight="fill" />
              <span className="text-[13px] font-bold text-ink">Terakreditasi</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tanggal Penting ────────────────────────────────────────────── */}
      <Section title="Tanggal Penting">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.importantDates.map((d) => {
            const Icon = DATE_ICONS[d.icon] ?? CalendarDots;
            return (
              <div
                key={d.fase}
                className="rounded-[18px] border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(40,80,40,.08)]"
              >
                <Icon size={26} />
                <div className="mt-3 text-[19px] font-extrabold text-ink">{d.tanggal}</div>
                <div className="text-[14px] font-semibold text-brand-deep">{d.fase}</div>
                <div className="mt-1 text-[13px] text-muted-foreground">{d.catatan}</div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Persyaratan ringkas ────────────────────────────────────────── */}
      <section className="px-[clamp(16px,4vw,32px)] py-12">
        <div
          className="mx-auto grid max-w-[1200px] gap-8 rounded-[22px] p-[clamp(24px,4vw,48px)] lg:grid-cols-2"
          style={{ background: "var(--band)" }}
        >
          <div>
            <h2 className="text-[clamp(24px,4vw,32px)] font-extrabold text-ink">Persyaratan Ringkas</h2>
            <p className="mt-3 text-[15px] text-text-soft">
              Siapkan berkas berikut sebelum mendaftar. Lihat daftar lengkap untuk detailnya.
            </p>
            <Link
              href="/psb/persyaratan"
              className="mt-5 inline-flex items-center gap-2 rounded-[11px] bg-brand px-5 py-3 text-[14px] font-bold text-white transition hover:bg-brand-hover"
            >
              Lihat Persyaratan Lengkap <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <div className="grid gap-3">
            {[
              { Icon: IdentificationCard, t: "FC Kartu Keluarga & KTP Orang Tua" },
              { Icon: BookOpen, t: "FC Akte Kelahiran" },
              { Icon: Camera, t: "Pas Foto latar biru" },
              { Icon: UsersThree, t: "Beragama Islam & sehat jasmani rohani" },
            ].map((r) => (
              <div key={r.t} className="flex items-center gap-3 rounded-[12px] bg-surface/70 px-4 py-3">
                <r.Icon size={22} className="text-brand" />
                <span className="text-[14px] font-medium text-text">{r.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Biaya ringkas ──────────────────────────────────────────────── */}
      <Section title="Rincian Biaya">
        <div className="grid gap-4 md:grid-cols-3">
          {c.feeGroups.map((g) => (
            <div key={g.title} className="rounded-[18px] border border-border bg-surface p-6">
              <h3 className="text-[17px] font-extrabold text-ink">{g.title}</h3>
              <div className="mt-4 text-[26px] font-extrabold text-brand">{rupiah(g.total)}</div>
              <p className="mt-1 text-[13px] text-muted-foreground">Total perkiraan</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/psb/biaya" className="inline-flex items-center gap-2 text-[14px] font-bold text-brand hover:underline">
            Lihat Rincian Lengkap <CaretRight size={15} weight="bold" />
          </Link>
        </div>
      </Section>

      {/* ── Galeri ─────────────────────────────────────────────────────── */}
      <Section title="Galeri">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {["Asrama", "Masjid", "Belajar", "Kegiatan"].map((g) => (
            <div
              key={g}
              className="flex aspect-square items-center justify-center rounded-[16px] border border-border text-muted-foreground"
              style={{
                background:
                  "repeating-linear-gradient(45deg,#eef4e8,#eef4e8 10px,#e9f2e0 10px,#e9f2e0 20px)",
              }}
            >
              <span className="font-mono text-[12px]">{g.toLowerCase()}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Kontak ─────────────────────────────────────────────────────── */}
      <section
        className="mt-12 px-[clamp(16px,4vw,32px)] py-[clamp(40px,6vw,72px)]"
        style={{ background: "linear-gradient(160deg,var(--brand-deep),var(--brand-deepest))" }}
      >
        <div className="mx-auto max-w-[1200px] text-center">
          <h2 className="text-[clamp(25px,4vw,38px)] font-extrabold text-white">Hubungi Panitia PSB</h2>
          <p className="mt-3 text-[15px] text-[#cfe0c4]">
            Ada pertanyaan? Hubungi panitia melalui WhatsApp.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.contacts.map((k, i) => (
              <a
                key={i}
                href={waLink(k.wa)}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[18px] border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10"
              >
                <div className="text-[16px] font-bold text-white">{k.nama}</div>
                <div className="text-[13px] text-[#cfe0c4]">{k.role}</div>
                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[rgba(72,180,97,.18)] px-3 py-1.5 text-[12.5px] font-semibold text-[#9fd6a3]">
                  <WhatsappLogo size={15} weight="fill" /> Hubungi via WhatsApp
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-[clamp(16px,4vw,32px)] py-12">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-6 text-[clamp(25px,4vw,38px)] font-extrabold text-ink">{title}</h2>
        {children}
      </div>
    </section>
  );
}

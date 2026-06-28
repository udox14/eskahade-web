"use client";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { useContent } from "@/lib/psb/use-content";
import { PageHeader } from "@/components/psb/site/PageHeader";

export default function PersyaratanPage() {
  const c = useContent();
  return (
    <div data-screen className="mx-auto max-w-[980px] px-[clamp(16px,4vw,32px)] py-12">
      <PageHeader
        eyebrow="Informasi"
        title="Persyaratan Pendaftaran"
        desc="Pastikan seluruh persyaratan berikut terpenuhi sebelum mendaftar."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {c.requirements.map((g) => (
          <div key={g.title} className="rounded-[18px] border border-border bg-surface p-6">
            <h3 className="text-[17px] font-extrabold text-ink">{g.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {g.items.map((it) => (
                <li key={it} className="flex items-start gap-2.5 text-[14px] text-text">
                  <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-brand" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/psb/pendaftaran"
          className="inline-flex items-center gap-2 rounded-[13px] bg-brand px-6 py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-hover"
        >
          Saya Siap, Daftar Sekarang <ArrowRight size={18} weight="bold" />
        </Link>
      </div>
    </div>
  );
}

"use client";
import { useContent } from "@/lib/psb/use-content";
import { PageHeader } from "@/components/psb/site/PageHeader";

export default function AgendaPage() {
  const c = useContent();
  return (
    <div data-screen className="mx-auto max-w-[760px] px-[clamp(16px,4vw,32px)] py-12">
      <PageHeader eyebrow="Informasi" title="Agenda PSB" desc="Rangkaian kegiatan penerimaan santri baru." />
      <ol className="relative ml-3 border-l-2 border-border">
        {c.agenda.map((a) => (
          <li key={a.judul} className="relative mb-8 pl-7">
            <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-surface bg-brand" />
            <div className="text-[13px] font-bold uppercase tracking-wide text-brand">{a.tanggal}</div>
            <div className="mt-1 rounded-[16px] border border-border bg-surface p-5">
              <h3 className="text-[16px] font-extrabold text-ink">{a.judul}</h3>
              <p className="mt-1 text-[14px] text-text-soft">{a.deskripsi}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

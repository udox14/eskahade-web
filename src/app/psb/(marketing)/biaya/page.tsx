"use client";
import { Info } from "@phosphor-icons/react";
import { useContent } from "@/lib/psb/use-content";
import { rupiah } from "@/lib/psb/format";
import { PageHeader } from "@/components/psb/site/PageHeader";

export default function BiayaPage() {
  const c = useContent();
  return (
    <div data-screen className="mx-auto max-w-[980px] px-[clamp(16px,4vw,32px)] py-12">
      <PageHeader
        eyebrow="Informasi"
        title="Rincian Biaya"
        desc="Berikut rincian biaya pendaftaran dan daftar ulang. Nominal dapat berubah sesuai ketentuan panitia."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {c.feeGroups.map((g) => (
          <div key={g.title} className="overflow-hidden rounded-[18px] border border-border bg-surface">
            <div className="bg-surface-alt px-5 py-4">
              <h3 className="text-[16px] font-extrabold text-ink">{g.title}</h3>
            </div>
            <div className="divide-y divide-border px-5">
              {g.items.map((it) => (
                <div key={it.label} className="flex items-center justify-between py-3 text-[14px]">
                  <span className="text-text">{it.label}</span>
                  <span className="font-semibold text-ink">{rupiah(it.nominal)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between bg-tint py-3 text-[14px] font-extrabold">
                <span className="text-ink">Total</span>
                <span className="text-brand">{rupiah(g.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-[14px] border border-border bg-surface-alt p-5">
        <Info size={22} className="mt-0.5 text-brand" />
        <div className="text-[14px] text-text">
          Pembayaran dapat dittransfer ke rekening <b>{c.rekening.bank}</b> No.{" "}
          <b>{c.rekening.nomor}</b> a.n. <b>{c.rekening.atasNama}</b>. Simpan bukti transfer untuk
          verifikasi panitia.
        </div>
      </div>
    </div>
  );
}

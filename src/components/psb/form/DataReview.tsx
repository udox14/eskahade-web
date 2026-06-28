"use client";
import { STEP_IDENTITAS, STEP_ORTU, STEP_KELENGKAPAN, BERKAS, type Field } from "@/lib/psb/fields";

type Section = { title: string; fields: Field[] };

const SECTIONS: Section[] = [
  { title: "Identitas Santri", fields: STEP_IDENTITAS },
  { title: "Orang Tua / Wali & Pendaftaran", fields: STEP_ORTU },
  { title: "Kelengkapan Mondok", fields: STEP_KELENGKAPAN },
];

// Section -> rows table. Used in form review, santri dashboard, and admin modal.
export function DataReview({
  data,
  berkas,
}: {
  data: Record<string, string | number | null | undefined>;
  berkas?: { jenis: string; url: string }[];
}) {
  const berkasMap = new Map((berkas ?? []).map((b) => [b.jenis, b.url]));

  return (
    <div className="space-y-6">
      {SECTIONS.map((sec) => {
        const rows = sec.fields.filter((f) => f.type !== "header" && f.type !== "file");
        return (
          <div key={sec.title} className="overflow-hidden rounded-[14px] border border-border">
            <div className="bg-surface-alt px-4 py-2.5 text-[14px] font-extrabold text-ink">
              {sec.title}
            </div>
            <dl className="divide-y divide-border">
              {rows.map((f) => {
                const v = data[f.name];
                if (v === undefined || v === null || v === "") return null;
                return (
                  <div key={f.name} className="grid grid-cols-2 gap-2 px-4 py-2.5 text-[13.5px]">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="font-medium text-ink">{String(v)}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        );
      })}

      {berkas && (
        <div className="overflow-hidden rounded-[14px] border border-border">
          <div className="bg-surface-alt px-4 py-2.5 text-[14px] font-extrabold text-ink">Berkas</div>
          <dl className="divide-y divide-border">
            {BERKAS.map((b) => {
              const url = berkasMap.get(b.name);
              return (
                <div key={b.name} className="grid grid-cols-2 gap-2 px-4 py-2.5 text-[13.5px]">
                  <dt className="text-muted-foreground">{b.label}</dt>
                  <dd>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
                        Lihat berkas
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
    </div>
  );
}

"use client";
import { WarningCircle } from "@phosphor-icons/react";
import type { Field } from "@/lib/psb/fields";
import type { Region } from "@/lib/psb/regions";
import { SegmentControl } from "@/components/psb/form/SegmentControl";
import { cn } from "@/lib/psb/utils";

type Props = {
  field: Field;
  value: string;
  onChange: (value: string, regionId?: string) => void;
  error?: string;
  /** wilayah options (overrides field.options; value = id, label = name) */
  regions?: Region[];
  disabled?: boolean;
};

const inputCls =
  "w-full rounded-[11px] border border-input bg-surface px-3.5 py-2.5 text-[14px] text-ink outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-[3px] focus:ring-[rgba(63,143,90,.12)] disabled:opacity-60";

export function FieldRenderer({ field: f, value, onChange, error, regions, disabled }: Props) {
  const isRegion = !!regions;

  return (
    <div className={cn(f.span === "full" ? "sm:col-span-2" : "")}>
      <label className="mb-1.5 block text-[13px] font-bold text-text">
        {f.label}
        {f.required && <span className="text-error"> *</span>}
      </label>

      {f.type === "segment" && f.options ? (
        <SegmentControl options={f.options} value={value} onChange={(v) => onChange(v)} />
      ) : f.type === "textarea" ? (
        <textarea
          rows={3}
          className={inputCls}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : isRegion ? (
        <select
          className={inputCls}
          value={value}
          disabled={disabled || regions.length === 0}
          onChange={(e) => {
            const opt = regions.find((r) => r.name === e.target.value);
            onChange(e.target.value, opt?.id);
          }}
        >
          <option value="">— Pilih —</option>
          {regions.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      ) : f.type === "select" && f.options ? (
        <select
          className={inputCls}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">— Pilih —</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={f.type === "number" ? "text" : f.type}
          inputMode={f.type === "number" || f.type === "tel" ? "numeric" : undefined}
          className={inputCls}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[12.5px] font-medium text-error">
          <WarningCircle size={14} weight="fill" /> {error}
        </p>
      )}
    </div>
  );
}

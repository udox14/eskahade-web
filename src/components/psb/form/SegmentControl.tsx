"use client";
import { cn } from "@/lib/psb/utils";

export function SegmentControl({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-[11px] border px-4 py-2.5 text-[14px] font-semibold transition",
            value === opt
              ? "border-brand bg-brand text-white"
              : "border-input bg-surface text-text hover:border-brand",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

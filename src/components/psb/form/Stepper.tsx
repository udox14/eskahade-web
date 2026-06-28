"use client";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/psb/utils";

export function Stepper({ steps, current }: { steps: readonly { title: string }[]; current: number }) {
  return (
    <div>
      {/* Desktop: pills */}
      <ol className="hidden items-center gap-2 min-[760px]:flex">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s.title} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-2 text-[14px] font-bold transition",
                  done && "border-brand bg-brand text-white",
                  active && "border-brand bg-tint text-brand-deep ring-4 ring-[rgba(63,143,90,.12)]",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check size={16} weight="bold" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[13.5px] font-semibold",
                  active ? "text-ink" : "text-muted-foreground",
                )}
              >
                {s.title}
              </span>
              {i < steps.length - 1 && <span className="ml-1 h-px flex-1 bg-border" />}
            </li>
          );
        })}
      </ol>

      {/* Mobile: progress bar */}
      <div className="min-[760px]:hidden">
        <div className="flex items-center justify-between text-[13px] font-semibold text-text">
          <span>
            Langkah {current + 1} dari {steps.length}
          </span>
          <span className="text-brand">{steps[current].title}</span>
        </div>
        <div className="mt-2 h-[7px] overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

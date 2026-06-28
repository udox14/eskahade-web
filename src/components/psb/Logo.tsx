"use client";
import { useState } from "react";
import { cn } from "@/lib/psb/utils";

// Renders the Sukahideng seal from /public/logo-sukahideng.png. Falls back to a
// green "PS" monogram if the asset is missing so the UI never looks broken.
export function Logo({ size = 44, className }: { size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[13px] font-extrabold text-white",
          className,
        )}
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, var(--brand), var(--brand-deep))",
          fontSize: size * 0.4,
        }}
      >
        PS
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo-sukahideng.png"
      alt="Logo Pondok Pesantren Sukahideng"
      width={size}
      height={size}
      className={cn("rounded-[12px] object-contain", className)}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}

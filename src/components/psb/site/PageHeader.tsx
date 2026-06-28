export function PageHeader({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <span className="text-[13px] font-bold uppercase tracking-[1.5px] text-brand">{eyebrow}</span>
      )}
      <h1 className="mt-2 text-[clamp(24px,4.5vw,40px)] font-extrabold tracking-[-.5px] text-ink">{title}</h1>
      {desc && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-soft">{desc}</p>}
    </div>
  );
}

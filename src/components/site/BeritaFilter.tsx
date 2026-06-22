"use client";
import { useRouter } from "next/navigation";

interface Category { id: number; name: string; slug: string; }

export default function BeritaFilter({ categories, activeCat }: { categories: Category[]; activeCat: string }) {
  const router = useRouter();

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {categories.map(c => (
        <button
          key={c.slug}
          onClick={() => router.push(`/berita?cat=${c.slug}`)}
          style={{
            padding: "9px 18px", borderRadius: 99, fontSize: "13.5px", fontWeight: 600, cursor: "pointer",
            border: `1px solid ${activeCat === c.slug ? "var(--green)" : "#D8D0BC"}`,
            background: activeCat === c.slug ? "var(--green)" : "var(--card)",
            color: activeCat === c.slug ? "#F4F0E6" : "var(--text-muted)",
          }}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

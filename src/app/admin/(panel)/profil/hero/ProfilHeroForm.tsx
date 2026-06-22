"use client";
import { useState } from "react";
import AdminFormField, { inputStyle, textareaStyle } from "@/components/admin/AdminFormField";
import ImageUpload from "@/components/admin/ImageUpload";

type HeroData = { eyebrow?: string; title?: string; paragraph?: string; imageKey?: string | null } | null;

export default function ProfilHeroForm({ initialData }: { initialData: HeroData }) {
  const [form, setForm] = useState({
    eyebrow: initialData?.eyebrow ?? "Tentang Kami",
    title: initialData?.title ?? "",
    paragraph: initialData?.paragraph ?? "",
    imageKey: initialData?.imageKey ?? null as string | null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string | null) { setForm(f => ({ ...f, [k]: v })); setSaved(false); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/profil/hero", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setSaved(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={save}>
      {error && <div style={{ padding: "10px 14px", background: "#FEE2E2", color: "#991B1B", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {saved && <div style={{ padding: "10px 14px", background: "#D1FAE5", color: "#065F46", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>Tersimpan!</div>}
      <AdminFormField label="Eyebrow (teks kecil di atas judul)">
        <input style={inputStyle} value={form.eyebrow} onChange={e => set("eyebrow", e.target.value)} placeholder="Tentang Kami" />
      </AdminFormField>
      <AdminFormField label="Judul Halaman" required>
        <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} required placeholder="Mengenal Lebih Dekat Pondok..." />
      </AdminFormField>
      <AdminFormField label="Paragraf / Deskripsi">
        <textarea style={textareaStyle} value={form.paragraph} onChange={e => set("paragraph", e.target.value)} placeholder="Deskripsi singkat..." />
      </AdminFormField>
      <div style={{ marginBottom: 28 }}>
        <ImageUpload label="Gambar Banner" value={form.imageKey} onChange={v => set("imageKey", v)} />
      </div>
      <button type="submit" disabled={saving} style={{ padding: "12px 28px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}

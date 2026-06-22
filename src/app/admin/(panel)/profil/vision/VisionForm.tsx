"use client";
import { useState } from "react";
import AdminFormField, { textareaStyle } from "@/components/admin/AdminFormField";

type VisionData = { visionText?: string; quoteText?: string } | null;

export default function VisionForm({ initialData }: { initialData: VisionData }) {
  const [form, setForm] = useState({
    vision_text: initialData?.visionText ?? "",
    quote_text: initialData?.quoteText ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); setSaved(false); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/profil/vision", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setSaved(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={save}>
      {error && <div style={{ padding: "10px 14px", background: "#FEE2E2", color: "#991B1B", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {saved && <div style={{ padding: "10px 14px", background: "#D1FAE5", color: "#065F46", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>Tersimpan!</div>}
      <AdminFormField label="Teks Visi">
        <textarea style={{ ...textareaStyle, minHeight: 100 }} value={form.vision_text} onChange={e => set("vision_text", e.target.value)} placeholder="Menjadi lembaga pendidikan Islam yang..." />
      </AdminFormField>
      <AdminFormField label="Kutipan Inspiratif (Quote)">
        <textarea style={{ ...textareaStyle, minHeight: 100 }} value={form.quote_text} onChange={e => set("quote_text", e.target.value)} placeholder="Hadits atau kata inspiratif..." />
      </AdminFormField>
      <button type="submit" disabled={saving} style={{ padding: "12px 28px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}

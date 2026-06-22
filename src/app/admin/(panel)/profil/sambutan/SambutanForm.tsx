"use client";
import { useState } from "react";
import AdminFormField, { inputStyle, textareaStyle } from "@/components/admin/AdminFormField";
import ImageUpload from "@/components/admin/ImageUpload";

type SambutanData = { arabic?: string; name?: string; role?: string; imageKey?: string | null; paragraph1?: string; paragraph2?: string } | null;

export default function SambutanForm({ initialData }: { initialData: SambutanData }) {
  const [form, setForm] = useState({
    arabic: initialData?.arabic ?? "",
    name: initialData?.name ?? "",
    role: initialData?.role ?? "",
    imageKey: initialData?.imageKey ?? null as string | null,
    paragraph1: initialData?.paragraph1 ?? "",
    paragraph2: initialData?.paragraph2 ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string | null) { setForm(f => ({ ...f, [k]: v })); setSaved(false); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/profil/sambutan", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setSaved(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={save}>
      {error && <div style={{ padding: "10px 14px", background: "#FEE2E2", color: "#991B1B", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {saved && <div style={{ padding: "10px 14px", background: "#D1FAE5", color: "#065F46", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>Tersimpan!</div>}
      <AdminFormField label="Teks Arab / Kaligrafi" hint="Isi dengan teks Arab (ayat / hadits / salam)">
        <textarea style={{ ...textareaStyle, direction: "rtl", fontSize: 18 }} value={form.arabic} onChange={e => set("arabic", e.target.value)} />
      </AdminFormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Nama Pengasuh">
          <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="KH. Ahmad ..." />
        </AdminFormField>
        <AdminFormField label="Jabatan">
          <input style={inputStyle} value={form.role} onChange={e => set("role", e.target.value)} placeholder="Pengasuh Pondok Pesantren" />
        </AdminFormField>
      </div>
      <AdminFormField label="Paragraf Pertama">
        <textarea style={textareaStyle} value={form.paragraph1} onChange={e => set("paragraph1", e.target.value)} placeholder="Assalamu'alaikum..." />
      </AdminFormField>
      <AdminFormField label="Paragraf Kedua">
        <textarea style={textareaStyle} value={form.paragraph2} onChange={e => set("paragraph2", e.target.value)} />
      </AdminFormField>
      <div style={{ marginBottom: 28 }}>
        <ImageUpload label="Foto Pengasuh" value={form.imageKey} onChange={v => set("imageKey", v)} />
      </div>
      <button type="submit" disabled={saving} style={{ padding: "12px 28px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}

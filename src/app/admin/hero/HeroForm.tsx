"use client";
import { useState } from "react";
import AdminFormField, { inputStyle, textareaStyle } from "@/components/admin/AdminFormField";
import ImageUpload from "@/components/admin/ImageUpload";

type HeroData = {
  badgeText?: string; headingPre?: string; headingHighlight?: string; headingPost?: string;
  subheading?: string; cta1Label?: string; cta1Href?: string; cta2Label?: string; cta2Href?: string;
  imageKey?: string | null; floatNumber?: string; floatLabel?: string; accentNumber?: string; accentLabel?: string;
} | null;

export default function HeroForm({ initialData }: { initialData: HeroData }) {
  const [form, setForm] = useState({
    badgeText: initialData?.badgeText ?? "",
    headingPre: initialData?.headingPre ?? "",
    headingHighlight: initialData?.headingHighlight ?? "",
    headingPost: initialData?.headingPost ?? "",
    subheading: initialData?.subheading ?? "",
    cta1Label: initialData?.cta1Label ?? "",
    cta1Href: initialData?.cta1Href ?? "",
    cta2Label: initialData?.cta2Label ?? "",
    cta2Href: initialData?.cta2Href ?? "",
    imageKey: initialData?.imageKey ?? null as string | null,
    floatNumber: initialData?.floatNumber ?? "",
    floatLabel: initialData?.floatLabel ?? "",
    accentNumber: initialData?.accentNumber ?? "",
    accentLabel: initialData?.accentLabel ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string | null) {
    setForm(f => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/hero", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setSaved(true);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={save}>
      {error && <div style={{ padding: "10px 14px", background: "#FEE2E2", color: "#991B1B", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {saved && <div style={{ padding: "10px 14px", background: "#D1FAE5", color: "#065F46", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>Tersimpan!</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Badge Text" hint='Contoh: "Lembaga Pendidikan Islam Terpercaya"'>
          <input style={inputStyle} value={form.badgeText} onChange={e => set("badgeText", e.target.value)} />
        </AdminFormField>
        <div />
        <AdminFormField label="Heading (sebelum highlight)" required>
          <input style={inputStyle} value={form.headingPre} onChange={e => set("headingPre", e.target.value)} placeholder='Contoh: "Membentuk"' />
        </AdminFormField>
        <AdminFormField label="Kata Highlight (berwarna)" required>
          <input style={inputStyle} value={form.headingHighlight} onChange={e => set("headingHighlight", e.target.value)} placeholder='Contoh: "Generasi"' />
        </AdminFormField>
        <AdminFormField label="Heading (setelah highlight)">
          <input style={inputStyle} value={form.headingPost} onChange={e => set("headingPost", e.target.value)} placeholder='Contoh: "Berakhlak Mulia"' />
        </AdminFormField>
      </div>

      <AdminFormField label="Sub-heading">
        <textarea style={textareaStyle} value={form.subheading} onChange={e => set("subheading", e.target.value)} />
      </AdminFormField>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="CTA 1 — Label"><input style={inputStyle} value={form.cta1Label} onChange={e => set("cta1Label", e.target.value)} /></AdminFormField>
        <AdminFormField label="CTA 1 — Link"><input style={inputStyle} value={form.cta1Href} onChange={e => set("cta1Href", e.target.value)} /></AdminFormField>
        <AdminFormField label="CTA 2 — Label"><input style={inputStyle} value={form.cta2Label} onChange={e => set("cta2Label", e.target.value)} /></AdminFormField>
        <AdminFormField label="CTA 2 — Link"><input style={inputStyle} value={form.cta2Href} onChange={e => set("cta2Href", e.target.value)} /></AdminFormField>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Stat Melayang — Angka"><input style={inputStyle} value={form.floatNumber} onChange={e => set("floatNumber", e.target.value)} placeholder="500+" /></AdminFormField>
        <AdminFormField label="Stat Melayang — Keterangan"><input style={inputStyle} value={form.floatLabel} onChange={e => set("floatLabel", e.target.value)} placeholder="Santri Aktif" /></AdminFormField>
        <AdminFormField label="Aksen Badge — Angka"><input style={inputStyle} value={form.accentNumber} onChange={e => set("accentNumber", e.target.value)} placeholder="25+" /></AdminFormField>
        <AdminFormField label="Aksen Badge — Keterangan"><input style={inputStyle} value={form.accentLabel} onChange={e => set("accentLabel", e.target.value)} placeholder="Tahun Berdiri" /></AdminFormField>
      </div>

      <div style={{ marginBottom: 28 }}>
        <ImageUpload label="Gambar Hero" value={form.imageKey} onChange={v => set("imageKey", v)} />
      </div>

      <button type="submit" disabled={saving} style={{ padding: "12px 28px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}

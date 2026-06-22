"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle, textareaStyle, selectStyle } from "@/components/admin/AdminFormField";

type Service = { id: number; title: string; description: string; cta: string; icon: string; href: string; scheme: string; sortOrder: number };

function ServiceForm({ item, onSave, onCancel }: { item: Service | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({ title: item?.title ?? "", description: item?.description ?? "", cta: item?.cta ?? "", icon: item?.icon ?? "squares-four", href: item?.href ?? "#", scheme: item?.scheme ?? "light" });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/services/${item.id}` : "/api/admin/services";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <AdminFormField label="Nama Layanan" required><input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} required /></AdminFormField>
      <AdminFormField label="Deskripsi"><textarea style={textareaStyle} value={form.description} onChange={e => set("description", e.target.value)} /></AdminFormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Label Tombol CTA"><input style={inputStyle} value={form.cta} onChange={e => set("cta", e.target.value)} /></AdminFormField>
        <AdminFormField label="Link Tombol"><input style={inputStyle} value={form.href} onChange={e => set("href", e.target.value)} /></AdminFormField>
        <AdminFormField label="Ikon (Phosphor)" hint="Contoh: mosque, book-open, graduation-cap"><input style={inputStyle} value={form.icon} onChange={e => set("icon", e.target.value)} /></AdminFormField>
        <AdminFormField label="Warna Kartu">
          <select style={selectStyle} value={form.scheme} onChange={e => set("scheme", e.target.value)}>
            <option value="green">Hijau (Green)</option>
            <option value="gold">Emas (Gold)</option>
            <option value="light">Terang (Light)</option>
          </select>
        </AdminFormField>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={{ padding: "11px 24px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>{saving ? "Menyimpan..." : "Simpan"}</button>
        <button type="button" onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #D0D9CA", background: "transparent", fontSize: 14, cursor: "pointer" }}>Batal</button>
      </div>
    </form>
  );
}

export default function ServicesClient({ initialItems }: { initialItems: Service[] }) {
  const [items, setItems] = useState(initialItems);

  const columns = [
    { key: "icon", label: "Ikon", render: (r: Service) => <i className={`ph ph-${r.icon}`} style={{ fontSize: 20, color: "#2E5237" }} /> },
    { key: "title", label: "Nama Layanan" },
    { key: "scheme", label: "Warna", render: (r: Service) => <span style={{ padding: "2px 10px", borderRadius: 20, background: r.scheme === "green" ? "#D1FAE5" : r.scheme === "gold" ? "#FEF3C7" : "#F3F4F6", fontSize: 12, fontWeight: 600, color: "#4C5645" }}>{r.scheme}</span> },
    { key: "cta", label: "CTA" },
  ];

  return (
    <AdminListPage
      title="Layanan (Kartu Beranda)"
      subtitle="Kartu layanan yang tampil di bagian Beranda."
      rows={items}
      columns={columns}
      formComponent={(p) => <ServiceForm {...p} />}
      apiBase="/api/admin/services"
      onRefresh={() => fetch("/api/admin/services").then(r => r.json()).then((d) => setItems(d as typeof items)).catch(() => {})}
      canReorder
    />
  );
}

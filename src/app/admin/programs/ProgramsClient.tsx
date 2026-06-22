"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle, textareaStyle } from "@/components/admin/AdminFormField";

type Program = { id: number; title: string; description: string; tag: string; icon: string; sortOrder: number };

function ProgramForm({ item, onSave, onCancel }: { item: Program | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: item?.title ?? "",
    description: item?.description ?? "",
    tag: item?.tag ?? "",
    icon: item?.icon ?? "book-open-text",
  });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/programs/${item.id}` : "/api/admin/programs";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <AdminFormField label="Judul Program" required>
        <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} required placeholder="Contoh: Tahfidz Al-Quran" />
      </AdminFormField>
      <AdminFormField label="Deskripsi">
        <textarea style={textareaStyle} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Deskripsi singkat program..." />
      </AdminFormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Tag / Jenjang" hint='Contoh: Formal, Non-Formal, Unggulan'>
          <input style={inputStyle} value={form.tag} onChange={e => set("tag", e.target.value)} placeholder="Formal" />
        </AdminFormField>
        <AdminFormField label="Ikon (Phosphor)" hint='Contoh: book-open-text, mosque, graduation-cap'>
          <input style={inputStyle} value={form.icon} onChange={e => set("icon", e.target.value)} placeholder="book-open-text" />
        </AdminFormField>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={{ padding: "11px 24px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>{saving ? "Menyimpan..." : "Simpan"}</button>
        <button type="button" onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #D0D9CA", background: "transparent", fontSize: 14, cursor: "pointer" }}>Batal</button>
      </div>
    </form>
  );
}

export default function ProgramsClient({ initialItems }: { initialItems: Program[] }) {
  const [items, setItems] = useState(initialItems);

  const columns = [
    { key: "icon", label: "Ikon", render: (r: Program) => <i className={`ph ph-${r.icon}`} style={{ fontSize: 20, color: "#2E5237" }} /> },
    { key: "title", label: "Judul Program" },
    { key: "tag", label: "Tag", render: (r: Program) => r.tag ? <span style={{ padding: "2px 10px", borderRadius: 20, background: "#D1FAE5", fontSize: 12, fontWeight: 600, color: "#2E5237" }}>{r.tag}</span> : null },
  ];

  return (
    <AdminListPage
      title="Program"
      subtitle="Kartu program / jenjang pendidikan yang tampil di beranda."
      rows={items}
      columns={columns}
      formComponent={(p) => <ProgramForm {...p} />}
      apiBase="/api/admin/programs"
      onRefresh={() => fetch("/api/admin/programs").then(r => r.json()).then((d) => setItems(d as typeof items)).catch(() => {})}
      canReorder
    />
  );
}

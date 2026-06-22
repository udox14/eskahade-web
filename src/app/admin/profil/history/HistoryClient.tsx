"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle, textareaStyle } from "@/components/admin/AdminFormField";

type HistoryItem = { id: number; year: string; title: string; description: string; sortOrder: number };

function HistoryForm({ item, onSave, onCancel }: { item: HistoryItem | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({ year: item?.year ?? "", title: item?.title ?? "", description: item?.description ?? "" });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/profil/history/${item.id}` : "/api/admin/profil/history";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0 24px" }}>
        <AdminFormField label="Tahun">
          <input style={inputStyle} value={form.year} onChange={e => set("year", e.target.value)} placeholder="1998" />
        </AdminFormField>
        <AdminFormField label="Judul Peristiwa" required>
          <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} required placeholder="Berdirinya Pondok Pesantren" />
        </AdminFormField>
      </div>
      <AdminFormField label="Deskripsi">
        <textarea style={textareaStyle} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Uraian singkat peristiwa..." />
      </AdminFormField>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={{ padding: "11px 24px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>{saving ? "Menyimpan..." : "Simpan"}</button>
        <button type="button" onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #D0D9CA", background: "transparent", fontSize: 14, cursor: "pointer" }}>Batal</button>
      </div>
    </form>
  );
}

export default function HistoryClient({ initialItems }: { initialItems: HistoryItem[] }) {
  const [items, setItems] = useState(initialItems);

  const columns = [
    { key: "year", label: "Tahun", render: (r: HistoryItem) => <span style={{ fontWeight: 700, color: "#2E5237" }}>{r.year}</span> },
    { key: "title", label: "Peristiwa" },
    { key: "description", label: "Deskripsi", render: (r: HistoryItem) => <span style={{ color: "#6E7B66" }}>{r.description.length > 60 ? r.description.slice(0, 60) + "…" : r.description}</span> },
  ];

  return (
    <AdminListPage
      title="Sejarah / Timeline"
      subtitle="Kronologi perkembangan pondok yang tampil di halaman Profil."
      rows={items}
      columns={columns}
      formComponent={(p) => <HistoryForm {...p} />}
      apiBase="/api/admin/profil/history"
      onRefresh={() => fetch("/api/admin/profil/history").then(r => r.json()).then((d) => setItems(d as typeof items)).catch(() => {})}
      canReorder
    />
  );
}

"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle } from "@/components/admin/AdminFormField";

type Stat = { id: number; number: string; label: string; icon: string; sortOrder: number };

function StatForm({ item, onSave, onCancel }: { item: Stat | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({ number: item?.number ?? "", label: item?.label ?? "", icon: item?.icon ?? "star" });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/stats/${item.id}` : "/api/admin/stats";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Angka / Nilai" required>
          <input style={inputStyle} value={form.number} onChange={e => set("number", e.target.value)} required placeholder="Contoh: 500+" />
        </AdminFormField>
        <AdminFormField label="Keterangan (Label)" required>
          <input style={inputStyle} value={form.label} onChange={e => set("label", e.target.value)} required placeholder="Contoh: Santri Aktif" />
        </AdminFormField>
        <AdminFormField label="Ikon (Phosphor)" hint='Contoh: student, book-open, mosque, graduation-cap'>
          <input style={inputStyle} value={form.icon} onChange={e => set("icon", e.target.value)} placeholder="star" />
        </AdminFormField>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={{ padding: "11px 24px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>{saving ? "Menyimpan..." : "Simpan"}</button>
        <button type="button" onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #D0D9CA", background: "transparent", fontSize: 14, cursor: "pointer" }}>Batal</button>
      </div>
    </form>
  );
}

export default function StatsClient({ initialItems }: { initialItems: Stat[] }) {
  const [items, setItems] = useState(initialItems);

  const columns = [
    { key: "icon", label: "Ikon", render: (r: Stat) => <i className={`ph ph-${r.icon}`} style={{ fontSize: 20, color: "#2E5237" }} /> },
    { key: "number", label: "Angka" },
    { key: "label", label: "Keterangan" },
  ];

  return (
    <AdminListPage
      title="Statistik"
      subtitle="Angka statistik yang ditampilkan di bagian strip beranda."
      rows={items}
      columns={columns}
      formComponent={(p) => <StatForm {...p} />}
      apiBase="/api/admin/stats"
      onRefresh={() => fetch("/api/admin/stats").then(r => r.json()).then((d) => setItems(d as typeof items)).catch(() => {})}
      canReorder
    />
  );
}

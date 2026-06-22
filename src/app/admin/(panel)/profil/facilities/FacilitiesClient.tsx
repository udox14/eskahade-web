"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle } from "@/components/admin/AdminFormField";

type Facility = { id: number; name: string; icon: string; sortOrder: number };

function FacilityForm({ item, onSave, onCancel }: { item: Facility | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({ name: item?.name ?? "", icon: item?.icon ?? "buildings" });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/profil/facilities/${item.id}` : "/api/admin/profil/facilities";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <AdminFormField label="Nama Fasilitas" required>
        <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} required placeholder="Contoh: Masjid, Asrama, Lab Komputer" />
      </AdminFormField>
      <AdminFormField label="Ikon (Phosphor)" hint='Contoh: buildings, mosque, computer-tower, book-open'>
        <input style={inputStyle} value={form.icon} onChange={e => set("icon", e.target.value)} placeholder="buildings" />
      </AdminFormField>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={{ padding: "11px 24px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>{saving ? "Menyimpan..." : "Simpan"}</button>
        <button type="button" onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #D0D9CA", background: "transparent", fontSize: 14, cursor: "pointer" }}>Batal</button>
      </div>
    </form>
  );
}

export default function FacilitiesClient({ initialItems }: { initialItems: Facility[] }) {
  const [items, setItems] = useState(initialItems);

  const columns = [
    { key: "icon", label: "Ikon", render: (r: Facility) => <i className={`ph ph-${r.icon}`} style={{ fontSize: 20, color: "#2E5237" }} /> },
    { key: "name", label: "Nama Fasilitas" },
  ];

  return (
    <AdminListPage
      title="Fasilitas"
      subtitle="Daftar fasilitas pondok yang tampil di halaman Profil."
      rows={items}
      columns={columns}
      formComponent={(p) => <FacilityForm {...p} />}
      apiBase="/api/admin/profil/facilities"
      onRefresh={() => fetch("/api/admin/profil/facilities").then(r => r.json()).then((d) => setItems(d as typeof items)).catch(() => {})}
      canReorder
    />
  );
}

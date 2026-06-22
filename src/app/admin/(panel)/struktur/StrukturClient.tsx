"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle, selectStyle } from "@/components/admin/AdminFormField";
import ImageUpload from "@/components/admin/ImageUpload";

type OrgMember = { id: number; role: string; name: string; level: string; icon: string; imageKey: string | null; sortOrder: number };

const levelLabel: Record<string, string> = { pimpinan: "Pimpinan", atas: "Atas", bawah: "Bawah" };
const levelColor: Record<string, { bg: string; color: string }> = {
  pimpinan: { bg: "#FEF3C7", color: "#92400E" },
  atas: { bg: "#D1FAE5", color: "#065F46" },
  bawah: { bg: "#E0E7FF", color: "#3730A3" },
};

function OrgForm({ item, onSave, onCancel }: { item: OrgMember | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    role: item?.role ?? "",
    name: item?.name ?? "",
    level: item?.level ?? "bawah",
    icon: item?.icon ?? "user-circle",
    imageKey: item?.imageKey ?? null as string | null,
  });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string | null) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/org/${item.id}` : "/api/admin/org";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Jabatan / Peran" required>
          <input style={inputStyle} value={form.role} onChange={e => set("role", e.target.value)} required placeholder="Contoh: Pengasuh Pondok" />
        </AdminFormField>
        <AdminFormField label="Nama Lengkap" required>
          <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} required placeholder="Nama lengkap" />
        </AdminFormField>
        <AdminFormField label="Level / Tingkat">
          <select style={selectStyle} value={form.level} onChange={e => set("level", e.target.value)}>
            <option value="pimpinan">Pimpinan (Teratas)</option>
            <option value="atas">Atas (Tengah)</option>
            <option value="bawah">Bawah (Dasar)</option>
          </select>
        </AdminFormField>
        <AdminFormField label="Ikon (Phosphor)" hint='Contoh: user-circle, star, mosque'>
          <input style={inputStyle} value={form.icon} onChange={e => set("icon", e.target.value)} placeholder="user-circle" />
        </AdminFormField>
      </div>
      <div style={{ marginBottom: 20 }}>
        <ImageUpload label="Foto (opsional)" value={form.imageKey} onChange={v => set("imageKey", v)} />
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={{ padding: "11px 24px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>{saving ? "Menyimpan..." : "Simpan"}</button>
        <button type="button" onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #D0D9CA", background: "transparent", fontSize: 14, cursor: "pointer" }}>Batal</button>
      </div>
    </form>
  );
}

export default function StrukturClient({ initialItems }: { initialItems: OrgMember[] }) {
  const [items, setItems] = useState(initialItems);

  const columns = [
    { key: "level", label: "Level", render: (r: OrgMember) => {
      const c = levelColor[r.level] ?? { bg: "#F3F4F6", color: "#374151" };
      return <span style={{ padding: "2px 10px", borderRadius: 20, background: c.bg, fontSize: 12, fontWeight: 600, color: c.color }}>{levelLabel[r.level] ?? r.level}</span>;
    }},
    { key: "role", label: "Jabatan" },
    { key: "name", label: "Nama" },
  ];

  return (
    <AdminListPage
      title="Struktur Organisasi"
      subtitle="Daftar anggota struktur kepengurusan pondok."
      rows={items}
      columns={columns}
      formComponent={(p) => <OrgForm {...p} />}
      apiBase="/api/admin/org"
      onRefresh={() => fetch("/api/admin/org").then(r => r.json()).then((d) => setItems(d as typeof items)).catch(() => {})}
      canReorder
    />
  );
}

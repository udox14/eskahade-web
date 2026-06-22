"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle, textareaStyle } from "@/components/admin/AdminFormField";
import ImageUpload from "@/components/admin/ImageUpload";

type Testimonial = { id: number; quote: string; name: string; role: string; initials: string; avatarColor: string; imageKey: string | null; sortOrder: number };

function TestimonialForm({ item, onSave, onCancel }: { item: Testimonial | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    quote: item?.quote ?? "",
    name: item?.name ?? "",
    role: item?.role ?? "",
    initials: item?.initials ?? "",
    avatarColor: item?.avatarColor ?? "#DCE6D5",
    imageKey: item?.imageKey ?? null as string | null,
  });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string | null) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/testimonials/${item.id}` : "/api/admin/testimonials";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <AdminFormField label="Kutipan (Quote)" required>
        <textarea style={textareaStyle} value={form.quote} onChange={e => set("quote", e.target.value)} required placeholder="Isi testimoni..." />
      </AdminFormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Nama" required>
          <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} required placeholder="Nama lengkap" />
        </AdminFormField>
        <AdminFormField label="Jabatan / Peran">
          <input style={inputStyle} value={form.role} onChange={e => set("role", e.target.value)} placeholder="Contoh: Wali Santri" />
        </AdminFormField>
        <AdminFormField label="Inisial (2 huruf)" hint="Dipakai jika tidak ada foto">
          <input style={inputStyle} value={form.initials} onChange={e => set("initials", e.target.value)} maxLength={2} placeholder="AB" />
        </AdminFormField>
        <AdminFormField label="Warna Avatar" hint='Contoh: #2E5237'>
          <input style={inputStyle} value={form.avatarColor} onChange={e => set("avatarColor", e.target.value)} placeholder="#DCE6D5" />
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

export default function TestimonialsClient({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState(initialItems);

  const columns = [
    { key: "name", label: "Nama" },
    { key: "role", label: "Jabatan" },
    { key: "quote", label: "Kutipan", render: (r: Testimonial) => (
      <span style={{ color: "#6E7B66" }}>{r.quote.length > 60 ? r.quote.slice(0, 60) + "…" : r.quote}</span>
    )},
  ];

  return (
    <AdminListPage
      title="Testimoni"
      subtitle="Kutipan dari wali santri, alumni, dan tokoh yang tampil di beranda."
      rows={items}
      columns={columns}
      formComponent={(p) => <TestimonialForm {...p} />}
      apiBase="/api/admin/testimonials"
      onRefresh={() => fetch("/api/admin/testimonials").then(r => r.json()).then((d) => setItems(d as typeof items)).catch(() => {})}
      canReorder
    />
  );
}

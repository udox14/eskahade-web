"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle } from "@/components/admin/AdminFormField";

type Category = { id: number; name: string; slug: string };

function toSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function CatForm({ item, onSave, onCancel }: { item: Category | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({ name: item?.name ?? "", slug: item?.slug ?? "" });
  const [saving, setSaving] = useState(false);

  function handleName(v: string) {
    setForm(f => ({ ...f, name: v, slug: f.slug === "" || f.slug === toSlug(f.name) ? toSlug(v) : f.slug }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/news/categories/${item.id}` : "/api/admin/news/categories";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <AdminFormField label="Nama Kategori" required>
        <input style={inputStyle} value={form.name} onChange={e => handleName(e.target.value)} required placeholder="Contoh: Pengumuman" />
      </AdminFormField>
      <AdminFormField label="Slug URL" hint="Diisi otomatis, bisa diedit">
        <input style={inputStyle} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))} placeholder="pengumuman" />
      </AdminFormField>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={{ padding: "11px 24px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>{saving ? "Menyimpan..." : "Simpan"}</button>
        <button type="button" onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #D0D9CA", background: "transparent", fontSize: 14, cursor: "pointer" }}>Batal</button>
      </div>
    </form>
  );
}

export default function KategoriBeritaClient({ initialItems }: { initialItems: Category[] }) {
  const [items, setItems] = useState(initialItems);

  const columns = [
    { key: "name", label: "Nama Kategori" },
    { key: "slug", label: "Slug" },
  ];

  return (
    <AdminListPage
      title="Kategori Berita"
      subtitle="Kategori untuk mengelompokkan postingan berita."
      rows={items}
      columns={columns}
      formComponent={(p) => <CatForm {...p} />}
      apiBase="/api/admin/news/categories"
      onRefresh={() => fetch("/api/admin/news/categories").then(r => r.json()).then((d) => setItems(d as typeof items)).catch(() => {})}
    />
  );
}

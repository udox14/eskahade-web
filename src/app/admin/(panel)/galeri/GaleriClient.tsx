"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle, selectStyle } from "@/components/admin/AdminFormField";
import ImageUpload from "@/components/admin/ImageUpload";

type Photo = { id: number; caption: string; categoryId: number | null; imageKey: string | null; colSpan: number; rowSpan: number; sortOrder: number };
type Category = { id: number; name: string; slug: string };

function PhotoForm({ item, onSave, onCancel, categories }: { item: Photo | null; onSave: () => void; onCancel: () => void; categories: Category[] }) {
  const [form, setForm] = useState({
    caption: item?.caption ?? "",
    categoryId: item?.categoryId ?? (null as number | null),
    imageKey: item?.imageKey ?? null as string | null,
    colSpan: item?.colSpan ?? 1,
    rowSpan: item?.rowSpan ?? 1,
  });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string | number | null) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/gallery/photos/${item.id}` : "/api/admin/gallery/photos";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <div style={{ marginBottom: 20 }}>
        <ImageUpload label="Foto (wajib)" value={form.imageKey} onChange={v => set("imageKey", v)} />
      </div>
      <AdminFormField label="Keterangan (Caption)">
        <input style={inputStyle} value={form.caption} onChange={e => set("caption", e.target.value)} placeholder="Deskripsi singkat foto..." />
      </AdminFormField>
      <AdminFormField label="Kategori">
        <select style={selectStyle} value={form.categoryId ?? ""} onChange={e => set("categoryId", e.target.value ? +e.target.value : null)}>
          <option value="">— Tanpa Kategori —</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </AdminFormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Lebar Kolom (Col Span)" hint="1 = normal, 2 = lebar">
          <select style={selectStyle} value={form.colSpan} onChange={e => set("colSpan", +e.target.value)}>
            <option value={1}>1 – Normal</option>
            <option value={2}>2 – Lebar</option>
          </select>
        </AdminFormField>
        <AdminFormField label="Tinggi Baris (Row Span)" hint="1 = normal, 2 = tinggi">
          <select style={selectStyle} value={form.rowSpan} onChange={e => set("rowSpan", +e.target.value)}>
            <option value={1}>1 – Normal</option>
            <option value={2}>2 – Tinggi</option>
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

export default function GaleriClient({ initialPhotos, initialCategories }: { initialPhotos: Photo[]; initialCategories: Category[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const categories = initialCategories;
  const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  const columns = [
    { key: "thumbnail", label: "Foto", render: (r: Photo) => r.imageKey
      ? <img src={`/api/media/${encodeURIComponent(r.imageKey)}`} alt={r.caption} style={{ width: 60, height: 44, objectFit: "cover", borderRadius: 8, display: "block" }} />
      : <div style={{ width: 60, height: 44, borderRadius: 8, background: "#E5EAE2", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="ph ph-image" style={{ color: "#97A78D" }} /></div>
    },
    { key: "caption", label: "Keterangan", render: (r: Photo) => r.caption || <span style={{ color: "#97A78D" }}>–</span> },
    { key: "category", label: "Kategori", render: (r: Photo) => r.categoryId ? <span style={{ padding: "2px 10px", borderRadius: 20, background: "#E0F2FE", fontSize: 12, fontWeight: 600, color: "#0369A1" }}>{catMap[r.categoryId] ?? "–"}</span> : <span style={{ color: "#97A78D" }}>–</span> },
    { key: "span", label: "Span", render: (r: Photo) => <span style={{ fontSize: 12, color: "#6E7B66" }}>{r.colSpan}×{r.rowSpan}</span> },
  ];

  const FormWithCats = (p: { item: Photo | null; onSave: () => void; onCancel: () => void }) =>
    <PhotoForm {...p} categories={categories} />;

  return (
    <AdminListPage
      title="Galeri Foto"
      subtitle="Foto-foto yang tampil di halaman galeri. Seret untuk mengurutkan."
      rows={photos}
      columns={columns}
      formComponent={FormWithCats}
      apiBase="/api/admin/gallery/photos"
      onRefresh={() => fetch("/api/admin/gallery/photos").then(r => r.json()).then((d) => setPhotos(d as typeof photos)).catch(() => {})}
      canReorder
    />
  );
}

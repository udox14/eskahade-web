"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle, textareaStyle, selectStyle } from "@/components/admin/AdminFormField";
import ImageUpload from "@/components/admin/ImageUpload";

type Post = {
  id: number; title: string; slug: string; categoryId: number | null;
  date: string; publishedAt: string; excerpt: string; body: string;
  coverKey: string | null; featured: number; published: number;
  createdAt: string; updatedAt: string;
};
type Category = { id: number; name: string; slug: string };

function toSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function PostForm({ item, onSave, onCancel, categories }: { item: Post | null; onSave: () => void; onCancel: () => void; categories: Category[] }) {
  const [form, setForm] = useState({
    title: item?.title ?? "",
    slug: item?.slug ?? "",
    categoryId: item?.categoryId ?? (null as number | null),
    date: item?.date ?? "",
    publishedAt: item?.publishedAt ?? "",
    excerpt: item?.excerpt ?? "",
    body: item?.body ?? "",
    coverKey: item?.coverKey ?? null as string | null,
    featured: item?.featured ?? 0,
    published: item?.published ?? 1,
  });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string | number | null) { setForm(f => ({ ...f, [k]: v })); }

  function handleTitle(v: string) {
    setForm(f => ({ ...f, title: v, slug: f.slug === "" || f.slug === toSlug(f.title) ? toSlug(v) : f.slug }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/news/posts/${item.id}` : "/api/admin/news/posts";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <AdminFormField label="Judul" required>
        <input style={inputStyle} value={form.title} onChange={e => handleTitle(e.target.value)} required placeholder="Judul berita..." />
      </AdminFormField>
      <AdminFormField label="Slug URL" hint="Diisi otomatis dari judul, bisa diedit">
        <input style={inputStyle} value={form.slug} onChange={e => set("slug", toSlug(e.target.value))} placeholder="judul-berita" />
      </AdminFormField>
      <AdminFormField label="Ringkasan (Excerpt)">
        <textarea style={textareaStyle} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} placeholder="Ringkasan singkat artikel..." />
      </AdminFormField>
      <AdminFormField label="Konten (Body)">
        <textarea style={{ ...textareaStyle, minHeight: 200 }} value={form.body} onChange={e => set("body", e.target.value)} placeholder="Isi artikel lengkap..." />
      </AdminFormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Tanggal Tampil" hint='Contoh: "12 Juni 2026"'>
          <input style={inputStyle} value={form.date} onChange={e => set("date", e.target.value)} placeholder="12 Juni 2026" />
        </AdminFormField>
        <AdminFormField label="Tanggal Terbit (untuk urutan)">
          <input style={inputStyle} type="date" value={form.publishedAt} onChange={e => set("publishedAt", e.target.value)} />
        </AdminFormField>
        <AdminFormField label="Kategori">
          <select style={selectStyle} value={form.categoryId ?? ""} onChange={e => set("categoryId", e.target.value ? +e.target.value : null)}>
            <option value="">— Tanpa Kategori —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </AdminFormField>
      </div>
      <div style={{ marginBottom: 20 }}>
        <ImageUpload label="Foto Cover" value={form.coverKey} onChange={v => set("coverKey", v)} />
      </div>
      <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={form.featured === 1} onChange={e => set("featured", e.target.checked ? 1 : 0)} />
          Tampilkan sebagai Unggulan (Featured)
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={form.published === 1} onChange={e => set("published", e.target.checked ? 1 : 0)} />
          Publikasikan
        </label>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button type="submit" disabled={saving} style={{ padding: "11px 24px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>{saving ? "Menyimpan..." : "Simpan"}</button>
        <button type="button" onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #D0D9CA", background: "transparent", fontSize: 14, cursor: "pointer" }}>Batal</button>
      </div>
    </form>
  );
}

export default function BeritaClient({ initialPosts, initialCategories }: { initialPosts: Post[]; initialCategories: Category[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const categories = initialCategories;

  const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  const columns = [
    { key: "title", label: "Judul" },
    { key: "category", label: "Kategori", render: (r: Post) => r.categoryId ? <span style={{ padding: "2px 10px", borderRadius: 20, background: "#E0F2FE", fontSize: 12, fontWeight: 600, color: "#0369A1" }}>{catMap[r.categoryId] ?? "–"}</span> : <span style={{ color: "#97A78D" }}>–</span> },
    { key: "date", label: "Tanggal" },
    { key: "published", label: "Status", render: (r: Post) => (
      <span style={{ padding: "2px 10px", borderRadius: 20, background: r.published ? "#D1FAE5" : "#F3F4F6", fontSize: 12, fontWeight: 600, color: r.published ? "#065F46" : "#6E7B66" }}>
        {r.published ? "Terbit" : "Draft"}
      </span>
    )},
    { key: "featured", label: "Unggulan", render: (r: Post) => r.featured ? <i className="ph ph-star-fill" style={{ color: "#D97706", fontSize: 16 }} /> : null },
  ];

  const FormWithCats = (p: { item: Post | null; onSave: () => void; onCancel: () => void }) =>
    <PostForm {...p} categories={categories} />;

  return (
    <AdminListPage
      title="Berita & Artikel"
      subtitle="Kelola semua postingan berita dan artikel."
      rows={posts}
      columns={columns}
      formComponent={FormWithCats}
      apiBase="/api/admin/news/posts"
      onRefresh={() => fetch("/api/admin/news/posts").then(r => r.json()).then((d) => setPosts(d as typeof posts)).catch(() => {})}
    />
  );
}

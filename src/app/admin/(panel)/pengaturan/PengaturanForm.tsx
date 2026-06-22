"use client";
import { useState } from "react";
import AdminFormField, { inputStyle, textareaStyle } from "@/components/admin/AdminFormField";
import ImageUpload from "@/components/admin/ImageUpload";

type Settings = Record<string, string>;

const sectionStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 18, border: "1px solid #E5EAE2", padding: 32, marginBottom: 24,
};
const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, color: "#1F3A27", margin: "0 0 20px",
  paddingBottom: 12, borderBottom: "1px solid #F0F3EE",
};
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" };

export default function PengaturanForm({ initialSettings }: { initialSettings: Settings }) {
  const [form, setForm] = useState<Settings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })); setSaved(false); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  const g = (key: string) => form[key] ?? "";

  return (
    <form onSubmit={save}>
      {error && <div style={{ padding: "10px 14px", background: "#FEE2E2", color: "#991B1B", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {saved && <div style={{ padding: "10px 14px", background: "#D1FAE5", color: "#065F46", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>Pengaturan berhasil disimpan!</div>}

      {/* Identitas Lembaga */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>Identitas Lembaga</h2>
        <div style={grid2}>
          <AdminFormField label="Nama Lembaga">
            <input style={inputStyle} value={g("nama_lembaga")} onChange={e => set("nama_lembaga", e.target.value)} placeholder="Pondok Pesantren ..." />
          </AdminFormField>
          <AdminFormField label="Sub Lembaga / Tagline">
            <input style={inputStyle} value={g("sub_lembaga")} onChange={e => set("sub_lembaga", e.target.value)} placeholder="Lembaga Pendidikan Islam" />
          </AdminFormField>
          <AdminFormField label="Sub Lokasi">
            <input style={inputStyle} value={g("sub_lokasi")} onChange={e => set("sub_lokasi", e.target.value)} placeholder="Kab. ... · Provinsi ..." />
          </AdminFormField>
        </div>
        <AdminFormField label="Bismillah / Kaligrafi (Arab)" hint="Teks Arab yang tampil di bagian tertentu halaman">
          <textarea style={textareaStyle} value={g("bismillah_arabic")} onChange={e => set("bismillah_arabic", e.target.value)} dir="rtl" />
        </AdminFormField>
      </div>

      {/* Kontak */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>Kontak</h2>
        <div style={grid2}>
          <AdminFormField label="Nomor Telepon / WA 1">
            <input style={inputStyle} value={g("contact_phone1")} onChange={e => set("contact_phone1", e.target.value)} placeholder="+62 8xx-xxxx-xxxx" />
          </AdminFormField>
          <AdminFormField label="Nomor Telepon / WA 2 (opsional)">
            <input style={inputStyle} value={g("contact_phone2")} onChange={e => set("contact_phone2", e.target.value)} placeholder="+62 8xx-xxxx-xxxx" />
          </AdminFormField>
          <AdminFormField label="Email">
            <input style={inputStyle} type="email" value={g("contact_email")} onChange={e => set("contact_email", e.target.value)} placeholder="info@pondok.ac.id" />
          </AdminFormField>
          <AdminFormField label="Lokasi Singkat">
            <input style={inputStyle} value={g("contact_location_short")} onChange={e => set("contact_location_short", e.target.value)} placeholder="Kab. Bondowoso, Jawa Timur" />
          </AdminFormField>
        </div>
        <AdminFormField label="Alamat Lengkap">
          <textarea style={textareaStyle} value={g("contact_address")} onChange={e => set("contact_address", e.target.value)} placeholder="Jl. ..." />
        </AdminFormField>
      </div>

      {/* Sosial Media */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>Sosial Media</h2>
        <div style={grid2}>
          <AdminFormField label="Instagram — Handle" hint='Contoh: "@pondokpesantren"'>
            <input style={inputStyle} value={g("social_instagram_handle")} onChange={e => set("social_instagram_handle", e.target.value)} placeholder="@pondokpesantren" />
          </AdminFormField>
          <AdminFormField label="Instagram — URL">
            <input style={inputStyle} value={g("social_instagram_url")} onChange={e => set("social_instagram_url", e.target.value)} placeholder="https://instagram.com/..." />
          </AdminFormField>
          <AdminFormField label="YouTube — URL">
            <input style={inputStyle} value={g("social_youtube_url")} onChange={e => set("social_youtube_url", e.target.value)} placeholder="https://youtube.com/@..." />
          </AdminFormField>
          <AdminFormField label="Facebook — URL">
            <input style={inputStyle} value={g("social_facebook_url")} onChange={e => set("social_facebook_url", e.target.value)} placeholder="https://facebook.com/..." />
          </AdminFormField>
        </div>
      </div>

      {/* Maps */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>Peta Lokasi (Google Maps)</h2>
        <AdminFormField label="Embed URL Maps" hint='Paste URL dari src="..." pada kode embed Google Maps'>
          <textarea style={textareaStyle} value={g("maps_embed_url")} onChange={e => set("maps_embed_url", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
        </AdminFormField>
        <AdminFormField label="Link ke Google Maps">
          <input style={inputStyle} value={g("maps_link")} onChange={e => set("maps_link", e.target.value)} placeholder="https://maps.google.com/?q=..." />
        </AdminFormField>
      </div>

      {/* Logo */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>Logo</h2>
        <ImageUpload label="Logo Pondok" value={g("logo_key") || null} onChange={v => set("logo_key", v ?? "")} />
      </div>

      {/* Footer */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>Footer</h2>
        <div style={grid2}>
          <AdminFormField label="Teks Copyright">
            <input style={inputStyle} value={g("footer_copyright")} onChange={e => set("footer_copyright", e.target.value)} placeholder={`© ${new Date().getFullYear()} Nama Pondok`} />
          </AdminFormField>
          <AdminFormField label="Dikelola Oleh">
            <input style={inputStyle} value={g("footer_managed_by")} onChange={e => set("footer_managed_by", e.target.value)} placeholder="Tim IT Pondok" />
          </AdminFormField>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, paddingBottom: 16 }}>
        <button type="submit" disabled={saving} style={{ padding: "12px 28px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>
          {saving ? "Menyimpan..." : "Simpan Semua Pengaturan"}
        </button>
      </div>
    </form>
  );
}

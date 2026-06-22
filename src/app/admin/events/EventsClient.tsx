"use client";
import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import AdminFormField, { inputStyle } from "@/components/admin/AdminFormField";

type Event = { id: number; day: string; month: string; fullDate: string; title: string; time: string; location: string; sortOrder: number };

function EventForm({ item, onSave, onCancel }: { item: Event | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    day: item?.day ?? "",
    month: item?.month ?? "",
    fullDate: item?.fullDate ?? "",
    title: item?.title ?? "",
    time: item?.time ?? "",
    location: item?.location ?? "",
  });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = item ? `/api/admin/events/${item.id}` : "/api/admin/events";
    await fetch(url, { method: item ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSave();
  }

  return (
    <form onSubmit={save}>
      <AdminFormField label="Judul Acara" required>
        <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} required placeholder="Contoh: Wisuda Santri Angkatan XII" />
      </AdminFormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Tanggal (Angka)" hint='Contoh: "15"'>
          <input style={inputStyle} value={form.day} onChange={e => set("day", e.target.value)} placeholder="15" />
        </AdminFormField>
        <AdminFormField label="Bulan" hint='Contoh: "Juni"'>
          <input style={inputStyle} value={form.month} onChange={e => set("month", e.target.value)} placeholder="Juni" />
        </AdminFormField>
        <AdminFormField label="Tanggal Lengkap" hint='Contoh: "15 Juni 2026"'>
          <input style={inputStyle} value={form.fullDate} onChange={e => set("fullDate", e.target.value)} placeholder="15 Juni 2026" />
        </AdminFormField>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <AdminFormField label="Jam" hint='Contoh: "08.00 WIB"'>
          <input style={inputStyle} value={form.time} onChange={e => set("time", e.target.value)} placeholder="08.00 WIB" />
        </AdminFormField>
        <AdminFormField label="Lokasi">
          <input style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)} placeholder="Aula Utama Pondok" />
        </AdminFormField>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={{ padding: "11px 24px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "default" : "pointer" }}>{saving ? "Menyimpan..." : "Simpan"}</button>
        <button type="button" onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #D0D9CA", background: "transparent", fontSize: 14, cursor: "pointer" }}>Batal</button>
      </div>
    </form>
  );
}

export default function EventsClient({ initialItems }: { initialItems: Event[] }) {
  const [items, setItems] = useState(initialItems);

  const columns = [
    { key: "date", label: "Tanggal", render: (r: Event) => (
      <span style={{ fontWeight: 700, color: "#2E5237" }}>{r.day} {r.month}</span>
    )},
    { key: "title", label: "Judul Acara" },
    { key: "time", label: "Jam" },
    { key: "location", label: "Lokasi" },
  ];

  return (
    <AdminListPage
      title="Agenda / Events"
      subtitle="Jadwal kegiatan mendatang yang tampil di beranda."
      rows={items}
      columns={columns}
      formComponent={(p) => <EventForm {...p} />}
      apiBase="/api/admin/events"
      onRefresh={() => fetch("/api/admin/events").then(r => r.json()).then((d) => setItems(d as typeof items)).catch(() => {})}
      canReorder
    />
  );
}

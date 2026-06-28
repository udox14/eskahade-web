"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CONTENT_KEY,
  DEFAULT_CONTENT,
  type SiteContent,
  type FeeGroup,
  type DateItem,
  type AgendaItem,
  type ReqGroup,
  type Contact,
} from "@/lib/psb/content";

// PSB editable content — restyled to the eskahade-web admin look. Reads/writes
// /api/psb/admin/settings (key psb_site_content in the unified settings table).

const GREEN = "#2E5237";
const GREEN_DEEP = "#1F3A27";

const inputCls: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1px solid #D0D9CA", borderRadius: 10,
  fontSize: 14, background: "#fff", color: "#283325", outline: "none", boxSizing: "border-box",
};

async function apiGet<T>(path: string): Promise<T> {
  const r = await fetch(path, { credentials: "include" });
  if (!r.ok) throw Object.assign(new Error("err"), { status: r.status });
  return r.json();
}
async function apiPut(path: string, body: unknown) {
  const r = await fetch(path, {
    method: "PUT", credentials: "include",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  if (!r.ok) throw Object.assign(new Error("err"), { status: r.status });
  return r.json();
}

export default function PsbKontenPage() {
  const router = useRouter();
  const [c, setC] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Record<string, unknown>>("/api/psb/admin/settings")
      .then((res) => setC({ ...DEFAULT_CONTENT, ...((res[CONTENT_KEY] as Partial<SiteContent>) ?? {}) }))
      .catch((e) => {
        if ((e as { status?: number }).status === 401) router.replace("/admin/login");
        else setMsg("Gagal memuat konten");
      });
  }, [router]);

  async function save() {
    if (!c) return;
    setSaving(true);
    try {
      await apiPut("/api/psb/admin/settings", { [CONTENT_KEY]: c });
      setMsg("Konten tersimpan.");
    } catch {
      setMsg("Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (!c) {
    return <div style={{ padding: "64px 0", textAlign: "center", color: "#6E7B66" }}>Memuat…</div>;
  }

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => setC({ ...c, [key]: value });

  const saveBtn = (
    <button onClick={save} disabled={saving} style={{
      display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10,
      background: GREEN, color: "#fff", fontSize: 14, fontWeight: 700, border: "none",
      cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1,
    }}>
      <i className="ph ph-floppy-disk" /> {saving ? "Menyimpan…" : "Simpan"}
    </button>
  );

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: GREEN_DEEP, margin: "0 0 6px" }}>Konten PSB</h1>
          <p style={{ color: "#6E7B66", fontSize: 14, margin: 0 }}>Ubah teks & data yang tampil di situs publik /psb. Tersimpan langsung tanpa rebuild.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { setC(structuredClone(DEFAULT_CONTENT)); setMsg("Direset ke default (belum disimpan)."); }} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10,
            border: "1px solid #E6DFCC", background: "#fff", color: "#4C5645", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            <i className="ph ph-arrow-counter-clockwise" /> Reset
          </button>
          {saveBtn}
        </div>
      </div>

      {msg && (
        <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "#E7EFE0", color: GREEN, fontSize: 13 }}>{msg}</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Section title="Umum">
          <Field label="Tahun Pelajaran" value={c.tahunPelajaran} onChange={(v) => set("tahunPelajaran", v)} />
          <Field label="Alamat" value={c.alamat} onChange={(v) => set("alamat", v)} textarea />
          <Field label="WhatsApp Bendahara" value={c.waBendahara} onChange={(v) => set("waBendahara", v)} />
        </Section>

        <Section title="Rekening">
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <Field label="Bank" value={c.rekening.bank} onChange={(v) => set("rekening", { ...c.rekening, bank: v })} />
            <Field label="Nomor" value={c.rekening.nomor} onChange={(v) => set("rekening", { ...c.rekening, nomor: v })} />
            <Field label="Atas Nama" value={c.rekening.atasNama} onChange={(v) => set("rekening", { ...c.rekening, atasNama: v })} />
          </div>
        </Section>

        <Section title="Tanggal Penting">
          <List items={c.importantDates} onChange={(items) => set("importantDates", items)}
            blank={{ tanggal: "", fase: "", catatan: "", icon: "calendar-dots" } as DateItem}
            render={(it, upd) => (
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                <Field label="Tanggal" value={it.tanggal} onChange={(v) => upd({ ...it, tanggal: v })} />
                <Field label="Fase" value={it.fase} onChange={(v) => upd({ ...it, fase: v })} />
                <Field label="Catatan" value={it.catatan} onChange={(v) => upd({ ...it, catatan: v })} />
                <Field label="Icon (Phosphor)" value={it.icon} onChange={(v) => upd({ ...it, icon: v })} />
              </div>
            )} />
        </Section>

        <Section title="Biaya">
          <List items={c.feeGroups} onChange={(items) => set("feeGroups", items)}
            blank={{ title: "", items: [], total: 0 } as FeeGroup}
            render={(g, upd) => (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="Judul Grup" value={g.title} onChange={(v) => upd({ ...g, title: v })} />
                <div>
                  <span style={labelStyle}>Rincian</span>
                  <List items={g.items} onChange={(items) => upd({ ...g, items })} blank={{ label: "", nominal: 0 }} compact
                    render={(item, updItem) => (
                      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 160px" }}>
                        <Field label="Label" value={item.label} onChange={(v) => updItem({ ...item, label: v })} />
                        <NumField label="Nominal" value={item.nominal} onChange={(v) => updItem({ ...item, nominal: v })} />
                      </div>
                    )} />
                </div>
                <NumField label="Total" value={g.total} onChange={(v) => upd({ ...g, total: v })} />
              </div>
            )} />
        </Section>

        <Section title="Persyaratan">
          <List items={c.requirements} onChange={(items) => set("requirements", items)}
            blank={{ title: "", items: [] } as ReqGroup}
            render={(g, upd) => (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="Judul Grup" value={g.title} onChange={(v) => upd({ ...g, title: v })} />
                <StringList label="Item" items={g.items} onChange={(items) => upd({ ...g, items })} />
              </div>
            )} />
        </Section>

        <Section title="Agenda">
          <List items={c.agenda} onChange={(items) => set("agenda", items)}
            blank={{ tanggal: "", judul: "", deskripsi: "" } as AgendaItem}
            render={(it, upd) => (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                  <Field label="Tanggal" value={it.tanggal} onChange={(v) => upd({ ...it, tanggal: v })} />
                  <Field label="Judul" value={it.judul} onChange={(v) => upd({ ...it, judul: v })} />
                </div>
                <Field label="Deskripsi" value={it.deskripsi} onChange={(v) => upd({ ...it, deskripsi: v })} textarea />
              </div>
            )} />
        </Section>

        <Section title="Panduan Daftar">
          <StringList label="Langkah" items={c.panduanDaftar} onChange={(items) => set("panduanDaftar", items)} />
        </Section>

        <Section title="Kontak Panitia">
          <List items={c.contacts} onChange={(items) => set("contacts", items)}
            blank={{ nama: "", role: "", wa: "" } as Contact}
            render={(it, upd) => (
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
                <Field label="Nama" value={it.nama} onChange={(v) => upd({ ...it, nama: v })} />
                <Field label="Peran" value={it.role} onChange={(v) => upd({ ...it, role: v })} />
                <Field label="WhatsApp" value={it.wa} onChange={(v) => upd({ ...it, wa: v })} />
              </div>
            )} />
        </Section>
      </div>

      <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>{saveBtn}</div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#6E7B66", marginBottom: 6 };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ borderRadius: 16, border: "1px solid #E6DFCC", background: "#fff", padding: 20 }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: GREEN_DEEP, margin: "0 0 14px" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}</span>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} style={{ ...inputCls, minHeight: 60, resize: "vertical" }} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} style={inputCls} />}
    </label>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}</span>
      <input type="number" value={Number.isFinite(value) ? value : 0} onChange={(e) => onChange(Number(e.target.value) || 0)} style={inputCls} />
    </label>
  );
}

function List<T>({ items, onChange, blank, render, compact }: {
  items: T[]; onChange: (items: T[]) => void; blank: T;
  render: (item: T, update: (next: T) => void) => React.ReactNode; compact?: boolean;
}) {
  const update = (i: number, next: T) => onChange(items.map((it, idx) => (idx === i ? next : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, structuredClone(blank)]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((it, i) => (
        <div key={i} style={{ position: "relative", borderRadius: 12, border: "1px solid #EFEAD9", background: "#FBF9F2", padding: compact ? 12 : 16, paddingRight: 44 }}>
          {render(it, (next) => update(i, next))}
          <button onClick={() => remove(i)} title="Hapus" style={{
            position: "absolute", right: 10, top: 10, height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 8, border: "none", background: "transparent", color: "#8A9380", cursor: "pointer",
          }}>
            <i className="ph ph-trash" style={{ fontSize: 15 }} />
          </button>
        </div>
      ))}
      <button onClick={add} style={{
        display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start", padding: "8px 14px", borderRadius: 10,
        border: "1px dashed #C9CFBC", background: "transparent", color: "#4C5645", fontSize: 13, fontWeight: 600, cursor: "pointer",
      }}>
        <i className="ph ph-plus" /> Tambah
      </button>
    </div>
  );
}

function StringList({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const update = (i: number, v: string) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input value={it} onChange={(e) => update(i, e.target.value)} style={inputCls} />
            <button onClick={() => remove(i)} title="Hapus" style={{
              height: 38, width: 38, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 9, border: "1px solid #E6DFCC", background: "#fff", color: "#8A9380", cursor: "pointer",
            }}>
              <i className="ph ph-trash" style={{ fontSize: 15 }} />
            </button>
          </div>
        ))}
        <button onClick={() => onChange([...items, ""])} style={{
          display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start", padding: "8px 14px", borderRadius: 10,
          border: "1px dashed #C9CFBC", background: "transparent", color: "#4C5645", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>
          <i className="ph ph-plus" /> Tambah
        </button>
      </div>
    </div>
  );
}

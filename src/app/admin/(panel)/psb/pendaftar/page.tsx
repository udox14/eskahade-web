"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_FIELDS, colOf, BERKAS } from "@/lib/psb/fields";

// PSB registrant management — restyled to the eskahade-web admin look (inline
// styles + Phosphor web icons), data from /api/psb/admin/* (eskahade-db).

type Row = Record<string, string | number | null>;
type Stats = { total: number; verifiedBerkas: number; paid: number };
type Detail = { santri: Row; berkas: { jenis: string; url: string }[] };

const GREEN = "#2E5237";
const GREEN_DEEP = "#1F3A27";

async function apiGet<T>(path: string): Promise<T> {
  const r = await fetch(path, { credentials: "include" });
  if (!r.ok) throw Object.assign(new Error("err"), { status: r.status });
  return r.json();
}
async function apiPatch(path: string, body: unknown) {
  const r = await fetch(path, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw Object.assign(new Error("err"), { status: r.status });
  return r.json();
}

export default function PsbPendaftarPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, verifiedBerkas: 0, paid: 0 });
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(
    async (query = "") => {
      try {
        const res = await apiGet<{ rows: Row[]; stats: Stats }>(
          `/api/psb/admin/pendaftar${query ? `?q=${encodeURIComponent(query)}` : ""}`,
        );
        setRows(res.rows);
        setStats(res.stats);
      } catch (e) {
        if ((e as { status?: number }).status === 401) router.replace("/admin/login");
        else setMsg("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => { load(); }, [load]);

  async function toggleVerify(id: string, kind: "berkas" | "bayar", value: boolean) {
    try {
      await apiPatch(`/api/psb/admin/pendaftar/${id}/verify`, { kind, value });
      load(q);
    } catch { setMsg("Gagal memperbarui status"); }
  }

  async function setFlag(id: string, flag: "editAllowed" | "uploadAllowed", value: boolean) {
    try {
      await apiPatch(`/api/psb/admin/pendaftar/${id}/flags`, { [flag]: value });
      if (detail) openDetail(id);
    } catch { setMsg("Gagal memperbarui izin"); }
  }

  async function openDetail(id: string) {
    try {
      const res = await apiGet<Detail>(`/api/psb/admin/pendaftar/${id}`);
      setDetail(res);
    } catch { setMsg("Gagal memuat detail"); }
  }

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: GREEN_DEEP, margin: "0 0 6px" }}>
        Pendaftar PSB
      </h1>
      <p style={{ color: "#6E7B66", fontSize: 14, margin: "0 0 24px" }}>
        Data calon santri (Penerimaan Santri Baru) — tersimpan di eskahade-db.
      </p>

      {msg && (
        <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "#FBEEE9", color: "#C0533A", fontSize: 13 }}>
          {msg}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginBottom: 24 }}>
        <StatCard icon="users-three" label="Total Pendaftar" value={stats.total} />
        <StatCard icon="seal-check" label="Berkas Terverifikasi" value={stats.verifiedBerkas} />
        <StatCard icon="money" label="Pembayaran Lunas" value={stats.paid} />
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(q)}
          placeholder="Cari nama / nomor pendaftaran…  (Enter)"
          style={{ width: "100%", maxWidth: 380, padding: "10px 14px", border: "1px solid #D0D9CA", borderRadius: 10, fontSize: 14, background: "#fff", color: "#283325", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid #E6DFCC", background: "#fff" }}>
        <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DFCC", background: "#F6F3EA", textAlign: "left", color: "#6E7B66" }}>
              <Th>No. Daftar</Th><Th>Nama</Th><Th>Sekolah</Th><Th>Berkas</Th><Th>Bayar</Th>
              <Th style={{ textAlign: "right" }}>Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "#6E7B66" }}>Memuat…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "#6E7B66" }}>Belum ada pendaftar.</td></tr>
            ) : (
              rows.map((r) => {
                const id = String(r.id);
                const berkasOk = Number(r.berkas_verified) === 1;
                const bayarOk = Number(r.bayar_verified) === 1;
                return (
                  <tr key={id} style={{ borderBottom: "1px solid #EFEAD9" }}>
                    <Td><span style={{ fontFamily: "monospace", fontSize: 12.5 }}>{String(r.no_reg)}</span></Td>
                    <Td><span style={{ fontWeight: 600, color: GREEN_DEEP }}>{String(r.nama_lengkap)}</span></Td>
                    <Td>{String(r.sekolah_santri ?? "-")}</Td>
                    <Td><Badge ok={berkasOk} /></Td>
                    <Td><Badge ok={bayarOk} /></Td>
                    <Td>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        <IconBtn title="Verifikasi berkas" active={berkasOk} icon="seal-check" onClick={() => toggleVerify(id, "berkas", !berkasOk)} />
                        <IconBtn title="Verifikasi bayar" active={bayarOk} icon="money" onClick={() => toggleVerify(id, "bayar", !bayarOk)} />
                        <IconBtn title="Detail" icon="eye" onClick={() => openDetail(id)} />
                      </div>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {detail && (
        <DetailModal
          detail={detail}
          onClose={() => setDetail(null)}
          onToggleVerify={toggleVerify}
          onSetFlag={setFlag}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, borderRadius: 16, border: "1px solid #E6DFCC", background: "#fff", padding: 20 }}>
      <div style={{ display: "flex", height: 48, width: 48, alignItems: "center", justifyContent: "center", borderRadius: 12, background: "#E7EFE0", color: GREEN }}>
        <i className={`ph ph-${icon}`} style={{ fontSize: 24 }} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: GREEN_DEEP }}>{value}</div>
        <div style={{ fontSize: 13, color: "#6E7B66" }}>{label}</div>
      </div>
    </div>
  );
}

function Th({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <th style={{ padding: "12px 16px", fontWeight: 600, ...style }}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px 16px", color: "#4C5645" }}>{children}</td>;
}

function Badge({ ok }: { ok: boolean }) {
  return (
    <span style={{
      display: "inline-block", borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600,
      background: ok ? "#E7EFE0" : "#F4EEDD", color: ok ? GREEN : "#8A6A2C",
    }}>
      {ok ? "Terverifikasi" : "Menunggu"}
    </span>
  );
}

function IconBtn({ icon, title, active, onClick }: { icon: string; title: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: "flex", height: 32, width: 32, alignItems: "center", justifyContent: "center",
        borderRadius: 9, cursor: "pointer",
        border: `1px solid ${active ? GREEN : "#E6DFCC"}`,
        background: active ? "#E7EFE0" : "#fff",
        color: active ? GREEN : "#4C5645",
      }}
    >
      <i className={`ph ph-${icon}`} style={{ fontSize: 16 }} />
    </button>
  );
}

function DetailModal({
  detail, onClose, onToggleVerify, onSetFlag,
}: {
  detail: Detail;
  onClose: () => void;
  onToggleVerify: (id: string, kind: "berkas" | "bayar", value: boolean) => void;
  onSetFlag: (id: string, flag: "editAllowed" | "uploadAllowed", value: boolean) => void;
}) {
  const s = detail.santri;
  const id = String(s.id);
  const berkasOk = Number(s.berkas_verified) === 1;
  const bayarOk = Number(s.bayar_verified) === 1;
  const editAllowed = Number(s.edit_allowed) === 1;
  const uploadAllowed = Number(s.upload_allowed) === 1;
  const berkasByJenis = Object.fromEntries(detail.berkas.map((b) => [b.jenis, b.url]));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, overflow: "auto", background: "rgba(31,58,39,0.45)", padding: 24 }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ margin: "0 auto", maxWidth: 880, borderRadius: 18, background: "#fff", padding: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: GREEN_DEEP, margin: 0 }}>
            {String(s.nama_lengkap)}
          </h2>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 8, color: "#6E7B66" }}>
            <i className="ph ph-x" style={{ fontSize: 20 }} />
          </button>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: "#6E7B66", marginBottom: 20 }}>{String(s.no_reg)}</div>

        {/* Verify + flags controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
          <Toggle label="Berkas terverifikasi" on={berkasOk} onClick={() => onToggleVerify(id, "berkas", !berkasOk)} />
          <Toggle label="Pembayaran lunas" on={bayarOk} onClick={() => onToggleVerify(id, "bayar", !bayarOk)} />
          <Toggle label="Izin edit data" on={editAllowed} onClick={() => onSetFlag(id, "editAllowed", !editAllowed)} />
          <Toggle label="Izin upload ulang" on={uploadAllowed} onClick={() => onSetFlag(id, "uploadAllowed", !uploadAllowed)} />
        </div>

        {/* Data fields */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {ALL_FIELDS.map((f) => {
            const v = s[colOf(f)];
            if (v === null || v === undefined || v === "") return null;
            return (
              <div key={f.name} style={{ borderRadius: 10, border: "1px solid #EFEAD9", background: "#FBF9F2", padding: "10px 12px" }}>
                <div style={{ fontSize: 11.5, color: "#8A9380", marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontSize: 13.5, color: "#283325", fontWeight: 500 }}>{String(v)}</div>
              </div>
            );
          })}
        </div>

        {/* Berkas */}
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: GREEN_DEEP, margin: "24px 0 10px" }}>Berkas</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {BERKAS.map((b) => {
            const url = berkasByJenis[b.name];
            return (
              <a
                key={b.name}
                href={url || undefined}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10,
                  border: "1px solid #E6DFCC", fontSize: 13, fontWeight: 600,
                  color: url ? GREEN : "#B0B7A6", pointerEvents: url ? "auto" : "none",
                  background: url ? "#fff" : "#F6F3EA",
                }}
              >
                <i className={`ph ph-${url ? "file-text" : "file-x"}`} /> {b.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, cursor: "pointer",
        border: `1px solid ${on ? GREEN : "#E6DFCC"}`,
        background: on ? "#E7EFE0" : "#fff",
        color: on ? GREEN : "#4C5645", fontSize: 13, fontWeight: 600,
      }}
    >
      <i className={`ph ph-${on ? "check-circle" : "circle"}`} style={{ fontSize: 16 }} /> {label}
    </button>
  );
}

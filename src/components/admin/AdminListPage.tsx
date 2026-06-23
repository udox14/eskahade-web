"use client";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T extends { id: number }> {
  title: string;
  subtitle?: string;
  rows: T[];
  columns: ColumnDef<T>[];
  formComponent: (props: { item: T | null; onSave: () => void; onCancel: () => void }) => React.ReactNode;
  apiBase: string;
  onRefresh: () => void;
  canReorder?: boolean;
}

export default function AdminListPage<T extends { id: number; sortOrder?: number }>({
  title, subtitle, rows: initialRows, columns, formComponent: Form, apiBase, onRefresh, canReorder,
}: Props<T>) {
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<T | null | "new">(null);
  const [delTarget, setDelTarget] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function doDelete() {
    if (!delTarget) return;
    setDeleting(true);
    await fetch(`${apiBase}/${delTarget.id}`, { method: "DELETE" });
    setRows(r => r.filter(x => x.id !== delTarget.id));
    setDelTarget(null); setDeleting(false);
  }

  async function moveUp(i: number) {
    if (i === 0) return;
    const next = [...rows];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setRows(next);
    await fetch(`${apiBase}/reorder`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: next.map(r => r.id) }) });
  }

  async function moveDown(i: number) {
    if (i === rows.length - 1) return;
    const next = [...rows];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setRows(next);
    await fetch(`${apiBase}/reorder`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: next.map(r => r.id) }) });
  }

  function afterSave() {
    setEditing(null);
    onRefresh();
  }

  if (editing !== null) {
    return (
      <div>
        <button onClick={() => setEditing(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6E7B66", fontSize: 14, marginBottom: 20, padding: 0 }}>
          <i className="ph ph-arrow-left" /> Kembali ke daftar
        </button>
        <div className="admin-form-container" style={{ background: "#fff", borderRadius: 18, border: "1px solid #E5EAE2", padding: 32, maxWidth: 720 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, color: "#1F3A27", margin: "0 0 24px" }}>
            {editing === "new" ? `Tambah ${title}` : `Edit ${title}`}
          </h2>
          <Form item={editing === "new" ? null : editing} onSave={afterSave} onCancel={() => setEditing(null)} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header-row" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: "#1F3A27", margin: "0 0 6px" }}>{title}</h1>
          {subtitle && <p style={{ color: "#6E7B66", fontSize: 14, margin: 0 }}>{subtitle}</p>}
        </div>
        <button onClick={() => setEditing("new")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          <i className="ph ph-plus" /> Tambah
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E5EAE2", overflowX: "auto" }}>
        {rows.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#97A78D", fontSize: 14 }}>
            <i className="ph ph-inbox" style={{ fontSize: 40, display: "block", marginBottom: 8 }} />
            Belum ada data. Klik "Tambah" untuk membuat yang pertama.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5EAE2" }}>
                {canReorder && <th style={{ width: 72, padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#6E7B66", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Urut</th>}
                {columns.map(c => (
                  <th key={c.key} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#6E7B66", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</th>
                ))}
                <th style={{ width: 120 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid #F0F3EE" : undefined }}>
                  {canReorder && (
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <button onClick={() => moveUp(i)} disabled={i === 0} style={reorderBtn}><i className="ph ph-caret-up" /></button>
                        <button onClick={() => moveDown(i)} disabled={i === rows.length - 1} style={reorderBtn}><i className="ph ph-caret-down" /></button>
                      </div>
                    </td>
                  )}
                  {columns.map(c => (
                    <td key={c.key} style={{ padding: "12px 14px", color: "#283325", verticalAlign: "middle" }}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                    </td>
                  ))}
                  <td style={{ padding: "12px 14px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <button onClick={() => setEditing(row)} style={editBtn}><i className="ph ph-pencil-simple" /> Edit</button>
                    <button onClick={() => setDelTarget(row)} style={{ ...editBtn, background: "#C0392B15", color: "#C0392B", marginLeft: 6 }}><i className="ph ph-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!delTarget}
        message={`Hapus item ini? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={doDelete}
        onCancel={() => setDelTarget(null)}
        loading={deleting}
      />
      <style>{`
        @media (max-width: 600px) {
          .admin-header-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .admin-header-row button {
            align-self: flex-start !important;
          }
          .admin-form-container {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

const reorderBtn: React.CSSProperties = { width: 26, height: 22, border: "1px solid #D0D9CA", borderRadius: 5, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6E7B66" };
const editBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "#2E523715", color: "#2E5237", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 };

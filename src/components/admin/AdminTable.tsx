"use client";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: number | string;
}

interface Props<T extends { id: number }> {
  columns: Column<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyMessage?: string;
}

export default function AdminTable<T extends { id: number }>({ columns, rows, onEdit, onDelete, emptyMessage = "Belum ada data." }: Props<T>) {
  if (!rows.length) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: "#97A78D", fontSize: 14 }}>
        <i className="ph ph-inbox" style={{ fontSize: 40, display: "block", marginBottom: 8 }} />
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #E5EAE2" }}>
            {columns.map(c => (
              <th key={String(c.key)} style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: "#6E7B66", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", width: c.width }}>
                {c.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th style={{ width: 110 }} />}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} style={{ borderBottom: "1px solid #F0F3EE" }}>
              {columns.map(c => (
                <td key={String(c.key)} style={{ padding: "12px 14px", color: "#283325", verticalAlign: "middle" }}>
                  {c.render ? c.render(row) : String((row as Record<string, unknown>)[String(c.key)] ?? "")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={{ padding: "12px 14px", textAlign: "right", whiteSpace: "nowrap" }}>
                  {onEdit && (
                    <button onClick={() => onEdit(row)} style={btnStyle("#2E5237")}>
                      <i className="ph ph-pencil-simple" /> Edit
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} style={{ ...btnStyle("#C0392B"), marginLeft: 6 }}>
                      <i className="ph ph-trash" />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function btnStyle(color: string): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8,
    background: color + "15", color, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
  };
}

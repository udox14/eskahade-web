"use client";
import { useEffect } from "react";

interface Props {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({ open, message, onConfirm, onCancel, loading }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", maxWidth: 420, width: "90%", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <i className="ph ph-warning" style={{ fontSize: 28, color: "#C0392B" }} />
        </div>
        <p style={{ fontSize: 15, color: "#283325", margin: "0 0 28px", lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onCancel} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid #D0D9CA", background: "transparent", cursor: "pointer", fontSize: 14, color: "#4C5645" }}>Batal</button>
          <button onClick={onConfirm} disabled={loading} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#C0392B", color: "#fff", cursor: loading ? "default" : "pointer", fontSize: 14, fontWeight: 600 }}>
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

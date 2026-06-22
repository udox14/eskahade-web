"use client";
import { useRef, useState } from "react";

interface Props {
  value?: string | null;
  onChange: (key: string | null) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Gambar" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload gagal");
      const { key } = await res.json() as { key: string };
      onChange(key);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#6E7B66", marginBottom: 8 }}>{label}</label>
      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/media/${encodeURIComponent(value)}`} alt="" style={{ width: 140, height: 96, objectFit: "cover", borderRadius: 10, border: "1px solid #E5EAE2", display: "block" }} />
          <button
            type="button" onClick={() => onChange(null)}
            style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "#C0392B", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}
          >
            <i className="ph ph-x" />
          </button>
        </div>
      ) : (
        <button
          type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          style={{ width: 140, height: 96, borderRadius: 10, border: "2px dashed #C7D2BC", background: "#F4F6F2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", color: "#6E7B66", fontSize: 13 }}
        >
          {uploading ? <><i className="ph ph-spinner" style={{ fontSize: 22 }} /> Mengunggah...</> : <><i className="ph ph-upload-simple" style={{ fontSize: 22 }} /> Pilih Gambar</>}
        </button>
      )}
      {error && <div style={{ color: "#C0392B", fontSize: 12, marginTop: 4 }}>{error}</div>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
    </div>
  );
}

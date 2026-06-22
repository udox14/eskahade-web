"use client";
import { useRef, useState } from "react";

type MediaItem = { id: number; key: string; filename: string; mime: string; size: number; alt: string; createdAt: string };

export default function MediaClient({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true); setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload gagal");
      }
      const fresh = await fetch("/api/admin/media").then(r => r.json());
      setItems(fresh as MediaItem[]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Hapus "${item.filename}"?`)) return;
    setDeletingId(item.id);
    await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
    setItems(prev => prev.filter(x => x.id !== item.id));
    setDeletingId(null);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: "#1F3A27", margin: "0 0 6px" }}>Pustaka Media</h1>
          <p style={{ color: "#6E7B66", fontSize: 14, margin: 0 }}>Semua gambar yang telah diunggah ke R2.</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, background: "#2E5237", color: "#F4F0E6", border: "none", fontWeight: 700, fontSize: 14, cursor: uploading ? "default" : "pointer" }}
        >
          <i className="ph ph-upload-simple" />
          {uploading ? "Mengunggah..." : "Upload Gambar"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleUpload(e.target.files)} />
      </div>

      {error && <div style={{ padding: "10px 14px", background: "#FEE2E2", color: "#991B1B", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>{error}</div>}

      {items.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E5EAE2", padding: "64px 0", textAlign: "center", color: "#97A78D", fontSize: 14 }}>
          <i className="ph ph-images" style={{ fontSize: 48, display: "block", marginBottom: 12 }} />
          Belum ada media. Klik "Upload Gambar" untuk menambahkan.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5EAE2", overflow: "hidden" }}>
              <div style={{ position: "relative", paddingBottom: "66%", background: "#F4F6F2" }}>
                {item.mime.startsWith("image/") ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`/api/media/${encodeURIComponent(item.key)}`}
                    alt={item.alt || item.filename}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ph ph-file" style={{ fontSize: 40, color: "#97A78D" }} />
                  </div>
                )}
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#283325", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{item.filename}</div>
                <div style={{ fontSize: 11, color: "#97A78D" }}>{(item.size / 1024).toFixed(1)} KB</div>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 8, background: "#C0392B15", color: "#C0392B", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500 }}
                >
                  <i className="ph ph-trash" />
                  {deletingId === item.id ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation";

interface Props { user: { name: string; email: string } }

export default function AdminTopbar({ user }: Props) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header style={{ height: 60, background: "#fff", borderBottom: "1px solid #E5EAE2", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", flexShrink: 0 }}>
      <div style={{ fontSize: 13, color: "#6E7B66" }}>
        Panel Admin & CMS — <span style={{ color: "#1F3A27", fontWeight: 600 }}>PP Sukahideng</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1F3A27" }}>{user.name}</div>
          <div style={{ fontSize: 11.5, color: "#97A78D" }}>{user.email}</div>
        </div>
        <button
          onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid #D0D9CA", background: "transparent", color: "#4C5645", fontSize: 13, cursor: "pointer" }}
        >
          <i className="ph ph-sign-out" style={{ fontSize: 16 }} /> Keluar
        </button>
      </div>
    </header>
  );
}

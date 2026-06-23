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
    <header style={{ height: 60, background: "#fff", borderBottom: "1px solid #E5EAE2", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }} className="admin-header">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <label
          htmlFor="admin-sidebar-toggle"
          className="admin-sidebar-toggle-btn"
          style={{ display: "none", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 8, border: "1px solid #D0D9CA", cursor: "pointer", color: "#4C5645" }}
        >
          <i className="ph ph-list" style={{ fontSize: 20 }} />
        </label>
        <div className="admin-topbar-title" style={{ fontSize: 13, color: "#6E7B66" }}>
          Panel Admin & CMS — <span style={{ color: "#1F3A27", fontWeight: 600 }}>PP Sukahideng</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "right" }} className="admin-user-info">
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1F3A27" }}>{user.name}</div>
          <div style={{ fontSize: 11.5, color: "#97A78D" }}>{user.email}</div>
        </div>
        <button
          onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid #D0D9CA", background: "transparent", color: "#4C5645", fontSize: 13, cursor: "pointer" }}
          className="admin-logout-btn"
        >
          <i className="ph ph-sign-out" style={{ fontSize: 16 }} /> <span className="admin-logout-text">Keluar</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar-toggle-btn { display: flex !important; }
          .admin-topbar-title { display: none !important; }
          .admin-header { padding: 0 16px !important; }
        }
        @media (max-width: 500px) {
          .admin-user-info { display: none !important; }
          .admin-logout-btn { padding: 8px 10px !important; }
          .admin-logout-text { display: none !important; }
        }
      `}</style>
    </header>
  );
}

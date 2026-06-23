import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

interface Props { children: React.ReactNode }

// Auth-guarded chrome for the admin panel. Login lives outside this group so it
// is never guarded (avoids a redirect loop).
export default async function PanelLayout({ children }: Props) {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin/login");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }} className="admin-panel-container">
      <input type="checkbox" id="admin-sidebar-toggle" style={{ display: "none" }} className="admin-sidebar-checkbox" />
      <label htmlFor="admin-sidebar-toggle" className="admin-sidebar-overlay" />
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="admin-main-wrapper">
        <AdminTopbar user={session.user} />
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }} className="admin-main-content">
          {children}
        </main>
      </div>

      <style>{`
        .admin-sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(31, 58, 39, 0.4);
          z-index: 90;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        @media (max-width: 900px) {
          .admin-sidebar-checkbox:checked ~ .admin-sidebar-overlay {
            display: block;
            opacity: 1;
            pointer-events: auto;
          }
          .admin-main-content {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

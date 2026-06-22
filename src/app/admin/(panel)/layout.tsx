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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AdminTopbar user={session.user} />
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

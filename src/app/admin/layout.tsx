import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import "@/app/globals.css";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--loaded-plus-jakarta", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--loaded-bricolage", display: "swap", axes: ["opsz"] });

interface Props { children: React.ReactNode }

export default async function AdminLayout({ children }: Props) {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin/login");

  return (
    <html lang="id" className={`${plusJakarta.variable} ${bricolage.variable}`}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" />
      </head>
      <body style={{ margin: 0, background: "#F1F5F0", fontFamily: "var(--font-body)" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <AdminSidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <AdminTopbar user={session.user} />
            <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

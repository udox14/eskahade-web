"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getGroupedModules } from "@/lib/module-registry";

const groups = getGroupedModules();

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside style={{ width: 256, background: "var(--green-deep)", color: "#C7D2BC", display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", position: "sticky", top: 0, overflow: "auto" }}>
      {/* Brand */}
      <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, color: "#F4F0E6", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.2 }}>
          PP Sukahideng
        </div>
        <div style={{ fontSize: 11, color: "#97A78D", marginTop: 3 }}>Panel Admin & CMS</div>
      </div>

      {/* Dashboard link */}
      <div style={{ padding: "8px 10px" }}>
        <SidebarLink href="/admin" label="Dashboard" icon="house" active={path === "/admin"} />
      </div>

      {/* Module groups */}
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} style={{ padding: "4px 10px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6E8C66", padding: "10px 10px 4px" }}>{group}</div>
          {items.map(m => (
            <SidebarLink
              key={m.key}
              href={`/admin/${m.href}`}
              label={m.label}
              icon={m.icon}
              active={path.startsWith(`/admin/${m.href}`)}
            />
          ))}
        </div>
      ))}

      <div style={{ flex: 1 }} />
      <div style={{ padding: "12px 10px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, color: "#97A78D", fontSize: "13.5px" }}>
          <i className="ph ph-arrow-square-out" /> Lihat Website
        </Link>
      </div>
    </aside>
  );
}

function SidebarLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9,
        background: active ? "rgba(255,255,255,0.1)" : "transparent",
        color: active ? "#F4F0E6" : "#97A78D",
        fontSize: "13.5px", fontWeight: active ? 600 : 400,
        transition: "background .15s, color .15s",
      }}
      className="sidebar-link"
    >
      <i className={`ph ph-${icon}`} style={{ fontSize: 16, flexShrink: 0 }} /> {label}
      <style>{`.sidebar-link:hover { background: rgba(255,255,255,0.07); color: #C7D2BC; }`}</style>
    </Link>
  );
}

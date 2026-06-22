import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#F4F0E6", fontSize: 28 }}>
            <i className="ph ph-mosque" />
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26, color: "var(--green-deep)", margin: "0 0 6px" }}>Panel Admin</h1>
          <p style={{ color: "var(--text-placeholder)", fontSize: 14, margin: 0 }}>Pondok Pesantren Sukahideng CMS</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}

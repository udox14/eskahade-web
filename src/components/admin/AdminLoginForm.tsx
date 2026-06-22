"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? "Login gagal");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ background: "var(--card)", borderRadius: 20, padding: 32, border: "1px solid var(--border)" }}>
      {error && (
        <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "12px 16px", borderRadius: 10, fontSize: 14, marginBottom: 20 }}>{error}</div>
      )}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Email</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
          style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 10, fontSize: 15, background: "var(--bg)", color: "var(--text)", outline: "none" }}
          placeholder="admin@ppsukahideng.sch.id"
        />
      </div>
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Password</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)} required
          style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 10, fontSize: 15, background: "var(--bg)", color: "var(--text)", outline: "none" }}
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit" disabled={loading}
        style={{ width: "100%", padding: "13px", borderRadius: 12, background: loading ? "var(--text-placeholder)" : "var(--green)", color: "#F4F0E6", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "default" : "pointer" }}
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}

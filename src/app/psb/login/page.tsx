"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Student, WarningCircle } from "@phosphor-icons/react";
import { api, ApiError } from "@/lib/psb/api";

export default function LoginSantriPage() {
  const router = useRouter();
  const [noReg, setNoReg] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/api/psb/auth/santri", { noReg, tanggalLahir });
      router.push("/psb/santri");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal masuk");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded-[11px] border border-input bg-surface px-3.5 py-2.5 text-[14px] text-ink outline-none transition focus:border-brand focus:ring-[3px] focus:ring-[rgba(63,143,90,.12)]";

  return (
    <div data-screen className="mx-auto max-w-[460px] px-[clamp(16px,4vw,32px)] py-16">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-tint">
        <Student size={32} className="text-brand" />
      </div>
      <h1 className="text-center text-[26px] font-extrabold text-ink">Masuk Halaman Santri</h1>
      <p className="mt-2 text-center text-[14px] text-text-soft">
        Gunakan Nomor Pendaftaran dan Tanggal Lahir Anda.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-[20px] border border-border bg-surface p-6">
        {error && (
          <div className="flex items-center gap-2 rounded-[11px] bg-[var(--error-bg)] px-4 py-3 text-[13.5px] font-medium text-error">
            <WarningCircle size={18} weight="fill" /> {error}
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-text">Nomor Pendaftaran</label>
          <input className={inputCls} value={noReg} onChange={(e) => setNoReg(e.target.value)} placeholder="PSB-2026-0001" />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-text">Tanggal Lahir</label>
          <input type="date" className={inputCls} value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-[11px] bg-brand px-5 py-3 text-[15px] font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
        >
          {busy ? "Memproses…" : "Masuk"}
        </button>
        <p className="text-center text-[13.5px] text-muted-foreground">
          Belum mendaftar?{" "}
          <Link href="/psb/pendaftaran" className="font-semibold text-brand hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>

      <div className="mt-4 text-center">
        <Link href="/admin/login" className="text-[13px] text-muted-foreground hover:text-text">
          Login Admin
        </Link>
      </div>
    </div>
  );
}

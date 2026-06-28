"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, SignIn, House } from "@phosphor-icons/react";

type Cred = { noReg: string; password: string; nama: string };

const STEPS = [
  "Catat Nomor Pendaftaran dan kata sandi Anda.",
  "Lakukan pembayaran biaya pendaftaran ke rekening panitia.",
  "Login ke Halaman Santri untuk memantau status.",
  "Tunggu verifikasi berkas oleh panitia.",
  "Lakukan daftar ulang bila dinyatakan diterima.",
];

export default function SelesaiPage() {
  const [cred, setCred] = useState<Cred | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("psb_selesai");
    if (raw) setCred(JSON.parse(raw));
  }, []);

  return (
    <div data-screen className="mx-auto max-w-[680px] px-[clamp(16px,4vw,32px)] py-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success-bg)]">
        <CheckCircle size={48} weight="fill" className="text-success" />
      </div>
      <h1 className="mt-6 text-[clamp(24px,4vw,34px)] font-extrabold text-ink">
        Alhamdulillah, Pendaftaran Berhasil!
      </h1>
      {cred?.nama && <p className="mt-2 text-[15px] text-text-soft">Terima kasih, {cred.nama}.</p>}

      <div
        className="mt-8 rounded-[20px] p-6 text-left text-white"
        style={{ background: "linear-gradient(160deg,var(--brand),var(--brand-deep))" }}
      >
        <p className="text-[13px] uppercase tracking-[1.5px] text-white/70">Simpan kredensial Anda</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-[12.5px] text-white/70">Nomor Pendaftaran</div>
            <div className="mt-1 text-[22px] font-extrabold">{cred?.noReg ?? "—"}</div>
          </div>
          <div>
            <div className="text-[12.5px] text-white/70">Kata Sandi (Tanggal Lahir)</div>
            <div className="mt-1 text-[22px] font-extrabold">{cred?.password ?? "—"}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[18px] border border-border bg-surface p-6 text-left">
        <h2 className="text-[16px] font-extrabold text-ink">Langkah Selanjutnya</h2>
        <ol className="mt-4 space-y-3">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3 text-[14px] text-text">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tint text-[13px] font-bold text-brand-deep">
                {i + 1}
              </span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/psb/login"
          className="inline-flex items-center gap-2 rounded-[12px] bg-brand px-6 py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-hover"
        >
          <SignIn size={18} /> Masuk ke Halaman Santri
        </Link>
        <Link
          href="/psb"
          className="inline-flex items-center gap-2 rounded-[12px] border border-[#cfe0c4] px-6 py-3.5 text-[15px] font-bold text-text transition hover:border-brand"
        >
          <House size={18} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

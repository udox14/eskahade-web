"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PencilSimpleLine,
  UploadSimple,
  Printer,
  FileText,
  SignOut,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/psb/api";
import { initials } from "@/lib/psb/format";
import { DataReview } from "@/components/psb/form/DataReview";
import { PrintOverlay, type PrintKind } from "@/components/psb/print/PrintOverlay";

type Row = Record<string, string | number | null>;
type Me = {
  santri: Row;
  berkas: { jenis: string; url: string }[];
  status: string;
  editAllowed: boolean;
  uploadAllowed: boolean;
};

const STATUS_LABEL: Record<string, string> = {
  menunggu: "Menunggu Verifikasi",
  verifikasi_berkas: "Berkas Terverifikasi",
  lunas: "Pembayaran Lunas",
  diterima: "Diterima",
  ditolak: "Tidak Diterima",
};

export default function SantriDashboard() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [print, setPrint] = useState<PrintKind | null>(null);

  useEffect(() => {
    api
      .get<Me>("/api/psb/santri/me")
      .then(setMe)
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) router.replace("/psb/login");
        else toast.error("Gagal memuat data");
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    await api.post("/api/psb/auth/logout").catch(() => {});
    router.replace("/psb/login");
  }

  if (loading) return <div className="p-16 text-center text-muted-foreground">Memuat…</div>;
  if (!me) return null;

  const nama = String(me.santri.nama_lengkap ?? "");
  const actions = [
    { icon: PencilSimpleLine, label: "Edit Data", onClick: () => router.push("/psb/pendaftaran?edit=1"), show: me.editAllowed },
    { icon: UploadSimple, label: "Upload Ulang Berkas", onClick: () => router.push("/psb/pendaftaran?edit=1"), show: me.uploadAllowed },
    { icon: Printer, label: "Cetak Bukti Daftar", onClick: () => setPrint("bukti"), show: true },
    { icon: FileText, label: "Surat Pernyataan Ortu", onClick: () => setPrint("ortu"), show: true },
    { icon: FileText, label: "Surat Pernyataan Santri", onClick: () => setPrint("santri"), show: true },
  ].filter((a) => a.show);

  return (
    <div data-screen className="mx-auto max-w-[1000px] px-[clamp(16px,4vw,32px)] py-10">
      {/* Header profil */}
      <div
        className="flex flex-wrap items-center gap-5 rounded-[22px] p-6 text-white"
        style={{ background: "linear-gradient(160deg,var(--brand),var(--brand-deep))" }}
      >
        <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-white/15 text-[30px] font-extrabold">
          {initials(nama)}
        </div>
        <div className="flex-1">
          <p className="text-[14px] text-white/70">Assalamu&apos;alaikum,</p>
          <h1 className="text-[24px] font-extrabold">{nama}</h1>
          <p className="mt-1 text-[13.5px] text-white/80">
            {String(me.santri.no_reg ?? "")} · {String(me.santri.sekolah_santri ?? "-")} ·{" "}
            {String(me.santri.kelas ?? "-")}
          </p>
          <span className="mt-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[12.5px] font-semibold">
            {STATUS_LABEL[me.status] ?? me.status}
          </span>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-[11px] bg-white/15 px-4 py-2.5 text-[14px] font-semibold transition hover:bg-white/25"
        >
          <SignOut size={17} /> Keluar
        </button>
      </div>

      {/* Aksi */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className="flex items-center gap-3 rounded-[14px] border border-border bg-surface px-4 py-4 text-left transition hover:border-brand hover:shadow-[0_6px_18px_rgba(40,80,40,.07)]"
          >
            <a.icon size={22} className="text-brand" />
            <span className="text-[14px] font-semibold text-ink">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Data Pendaftaran */}
      <h2 className="mb-4 mt-10 text-[20px] font-extrabold text-ink">Data Pendaftaran</h2>
      <DataReview data={me.santri} berkas={me.berkas} />

      {print && <PrintOverlay kind={print} data={me.santri} onClose={() => setPrint(null)} />}
    </div>
  );
}

"use client";
import { Printer, X } from "@phosphor-icons/react";
import { Logo } from "@/components/psb/Logo";
import { fmtDate } from "@/lib/psb/format";

export type PrintKind = "bukti" | "ortu" | "santri";
type Row = Record<string, string | number | null | undefined>;

const g = (r: Row, k: string) => (r[k] == null || r[k] === "" ? "-" : String(r[k]));

export function PrintOverlay({ kind, data, onClose }: { kind: PrintKind; data: Row; onClose: () => void }) {
  const title =
    kind === "bukti" ? "Bukti Pendaftaran" : kind === "ortu" ? "Surat Pernyataan Orang Tua" : "Surat Pernyataan Santri";

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/60 p-4 sm:p-8 print:static print:bg-transparent print:p-0">
      <div className="mx-auto max-w-[820px]">
        <div className="no-print mb-4 flex justify-end gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-[10px] bg-brand px-4 py-2.5 text-[14px] font-bold text-white hover:bg-brand-hover"
          >
            <Printer size={17} /> Cetak / Simpan PDF
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-2.5 text-[14px] font-bold text-ink"
          >
            <X size={17} /> Tutup
          </button>
        </div>

        <div className="print-sheet rounded-md bg-white p-[clamp(24px,5vw,56px)] text-[13px] leading-relaxed text-black shadow-xl">
          {/* Kop surat */}
          <div className="flex items-center gap-4 border-b-2 border-black pb-4">
            <Logo size={64} />
            <div className="text-center flex-1">
              <div className="text-[15px] font-extrabold">PANITIA PENERIMAAN SANTRI BARU</div>
              <div className="text-[17px] font-extrabold">PONDOK PESANTREN SUKAHIDENG</div>
              <div className="text-[11px]">Tanjungkerta, Sukarapih, Sukaratu, Tasikmalaya, Jawa Barat</div>
            </div>
          </div>

          <h2 className="mt-6 text-center text-[15px] font-extrabold underline">{title}</h2>

          {kind === "bukti" && (
            <div className="mt-6">
              <div className="mb-4 inline-block rounded border border-black px-4 py-2">
                <div>No. Pendaftaran: <b>{g(data, "no_reg")}</b></div>
                <div>Nama: <b>{g(data, "nama_lengkap")}</b></div>
              </div>
              <table className="w-full border-collapse">
                <tbody>
                  {[
                    ["Tempat, Tgl Lahir", `${g(data, "tempat_lahir")}, ${fmtDate(g(data, "tanggal_lahir"))}`],
                    ["Jenis Kelamin", g(data, "jenis_kelamin")],
                    ["NIK / NISN", `${g(data, "nik")} / ${g(data, "nisn")}`],
                    ["Asal Sekolah", g(data, "asal_sd")],
                    ["Nama Ayah", g(data, "nama_ayah")],
                    ["Nama Ibu", g(data, "nama_ibu")],
                    ["Alamat", g(data, "alamat_lengkap")],
                    ["Sekolah Dituju", `${g(data, "sekolah_santri")} · ${g(data, "kelas")}`],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="w-48 border border-black px-2 py-1 align-top">{k}</td>
                      <td className="border border-black px-2 py-1">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {kind === "ortu" && (
            <PernyataanOrtu data={data} />
          )}
          {kind === "santri" && (
            <PernyataanSantri data={data} />
          )}

          <div className="mt-12 flex justify-end">
            <div className="text-center">
              <div>Tasikmalaya, {fmtDate(new Date().toISOString())}</div>
              <div className="mt-1">{kind === "ortu" ? "Orang Tua/Wali," : kind === "santri" ? "Calon Santri," : "Panitia PSB,"}</div>
              <div className="mt-16 font-bold underline">
                {kind === "ortu" ? g(data, "nama_ayah") : g(data, "nama_lengkap")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PernyataanOrtu({ data }: { data: Row }) {
  return (
    <div className="mt-6">
      <p>Yang bertanda tangan di bawah ini, orang tua/wali dari:</p>
      <table className="my-3">
        <tbody>
          <tr><td className="w-40 align-top">Nama Santri</td><td>: {g(data, "nama_lengkap")}</td></tr>
          <tr><td className="align-top">No. Pendaftaran</td><td>: {g(data, "no_reg")}</td></tr>
          <tr><td className="align-top">Nama Ayah</td><td>: {g(data, "nama_ayah")}</td></tr>
          <tr><td className="align-top">Nama Ibu</td><td>: {g(data, "nama_ibu")}</td></tr>
          <tr><td className="align-top">Alamat</td><td>: {g(data, "alamat_lengkap")}</td></tr>
        </tbody>
      </table>
      <p>Dengan ini menyatakan:</p>
      <ol className="ml-5 mt-2 list-decimal space-y-1">
        <li>Mendukung penuh putra/putri kami untuk mondok di Pondok Pesantren Sukahideng.</li>
        <li>Bersedia menaati seluruh peraturan dan tata tertib pesantren.</li>
        <li>Bersedia memenuhi kewajiban administrasi tepat waktu.</li>
        <li>Data yang diberikan adalah benar dan dapat dipertanggungjawabkan.</li>
      </ol>
    </div>
  );
}

function PernyataanSantri({ data }: { data: Row }) {
  return (
    <div className="mt-6">
      <p>Yang bertanda tangan di bawah ini:</p>
      <table className="my-3">
        <tbody>
          <tr><td className="w-40 align-top">Nama</td><td>: {g(data, "nama_lengkap")}</td></tr>
          <tr><td className="align-top">No. Pendaftaran</td><td>: {g(data, "no_reg")}</td></tr>
          <tr><td className="align-top">Tempat, Tgl Lahir</td><td>: {g(data, "tempat_lahir")}, {fmtDate(g(data, "tanggal_lahir"))}</td></tr>
        </tbody>
      </table>
      <p>Dengan ini menyatakan:</p>
      <ol className="ml-5 mt-2 list-decimal space-y-1">
        <li>Bersungguh-sungguh menuntut ilmu di Pondok Pesantren Sukahideng.</li>
        <li>Menaati seluruh peraturan dan tata tertib pesantren.</li>
        <li>Menjaga nama baik diri, keluarga, dan pesantren.</li>
        <li>Bersedia menerima sanksi bila melanggar peraturan.</li>
      </ol>
    </div>
  );
}

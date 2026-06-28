"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, PaperPlaneTilt, Info } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Stepper } from "@/components/psb/form/Stepper";
import { FieldRenderer } from "@/components/psb/form/FieldRenderer";
import { FileUpload } from "@/components/psb/form/FileUpload";
import { DataReview } from "@/components/psb/form/DataReview";
import { STEPS, BERKAS, type Field } from "@/lib/psb/fields";
import { stepSchema } from "@/lib/psb/validation";
import { fetchProvinsi, fetchKabupaten, fetchKecamatan, fetchDesa, type Region } from "@/lib/psb/regions";
import { api, ApiError } from "@/lib/psb/api";

type FileRef = { name: string; url: string };

const REGION_FIELDS = ["provinsi", "kabupaten", "kecamatan", "desa"];

export default function PendaftaranPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Memuat…</div>}>
      <PendaftaranInner />
    </Suspense>
  );
}

function PendaftaranInner() {
  const router = useRouter();
  const params = useSearchParams();
  const editMode = params.get("edit") === "1";

  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, FileRef>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // wilayah cascade
  const [provOpts, setProvOpts] = useState<Region[]>([]);
  const [kabOpts, setKabOpts] = useState<Region[]>([]);
  const [kecOpts, setKecOpts] = useState<Region[]>([]);
  const [desaOpts, setDesaOpts] = useState<Region[]>([]);
  const [ids, setIds] = useState<{ prov?: string; kab?: string; kec?: string }>({});

  // Prefill in edit mode.
  useEffect(() => {
    if (!editMode) return;
    api
      .get<{ santri: Record<string, unknown>; berkas: { jenis: string; url: string }[] }>("/api/psb/santri/me")
      .then((res) => {
        // map snake_case db row back to camelCase via field config
        const next: Record<string, string> = {};
        for (const f of [...STEPS[0].fields, ...STEPS[1].fields, ...STEPS[2].fields]) {
          if (f.type === "header") continue;
          const col = f.col ?? f.name.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
          const v = res.santri[col];
          if (v != null) next[f.name] = String(v);
        }
        setData(next);
        const fr: Record<string, FileRef> = {};
        for (const b of res.berkas ?? []) fr[b.jenis] = { name: "Berkas tersimpan", url: b.url };
        setFiles(fr);
      })
      .catch(() => toast.error("Gagal memuat data untuk diedit"));
  }, [editMode]);

  useEffect(() => {
    fetchProvinsi().then(setProvOpts).catch(() => {});
  }, []);

  const set = useCallback((name: string, value: string, regionId?: string) => {
    setData((d) => ({ ...d, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));

    if (name === "provinsi") {
      setIds({ prov: regionId });
      setData((d) => ({ ...d, kabupaten: "", kecamatan: "", desa: "" }));
      setKabOpts([]); setKecOpts([]); setDesaOpts([]);
      if (regionId) fetchKabupaten(regionId).then(setKabOpts).catch(() => {});
    } else if (name === "kabupaten") {
      setIds((p) => ({ ...p, kab: regionId, kec: undefined }));
      setData((d) => ({ ...d, kecamatan: "", desa: "" }));
      setKecOpts([]); setDesaOpts([]);
      if (regionId) fetchKecamatan(regionId).then(setKecOpts).catch(() => {});
    } else if (name === "kecamatan") {
      setIds((p) => ({ ...p, kec: regionId }));
      setData((d) => ({ ...d, desa: "" }));
      setDesaOpts([]);
      if (regionId) fetchDesa(regionId).then(setDesaOpts).catch(() => {});
    }
  }, []);

  function regionsFor(name: string): Region[] | undefined {
    if (name === "provinsi") return provOpts;
    if (name === "kabupaten") return kabOpts;
    if (name === "kecamatan") return kecOpts;
    if (name === "desa") return desaOpts;
    return undefined;
  }

  function validateStep(): boolean {
    if (step === 3) {
      if (!agree) {
        toast.error("Centang pernyataan kebenaran data terlebih dahulu");
        return false;
      }
      return true;
    }
    const schema = stepSchema(step);
    const result = schema.safeParse(data);
    const nextErr: Record<string, string> = {};
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      for (const [k, v] of Object.entries(fe)) if (v?.[0]) nextErr[k] = v[0];
    }
    // berkas required on step 2 (Kelengkapan)
    if (step === 2) {
      for (const b of BERKAS) if (!files[b.name]) nextErr[b.name] = "Berkas wajib diunggah";
    }
    setErrors(nextErr);
    if (Object.keys(nextErr).length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const firstBerkas = BERKAS.find((b) => nextErr[b.name]);
      if (firstBerkas) toast.error("Lengkapi semua berkas wajib");
      return false;
    }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const berkas: Record<string, string> = {};
      for (const [k, v] of Object.entries(files)) berkas[k] = v.url;

      if (editMode) {
        await api.patch("/api/psb/santri/me", data);
        toast.success("Data berhasil diperbarui");
        router.push("/psb/santri");
        return;
      }
      const res = await api.post<{ noReg: string; password: string }>("/api/psb/pendaftaran", { ...data, berkas });
      sessionStorage.setItem(
        "psb_selesai",
        JSON.stringify({ noReg: res.noReg, password: res.password, nama: data.namaLengkap }),
      );
      router.push("/psb/selesai");
    } catch (e) {
      if (e instanceof ApiError && e.issues) {
        const nextErr: Record<string, string> = {};
        for (const [k, v] of Object.entries(e.issues)) if (v?.[0]) nextErr[k] = v[0];
        setErrors(nextErr);
      }
      toast.error(e instanceof ApiError ? e.message : "Gagal mengirim pendaftaran");
    } finally {
      setSubmitting(false);
    }
  }

  const current = STEPS[step];

  return (
    <div data-screen className="mx-auto max-w-[880px] px-[clamp(16px,4vw,32px)] py-10">
      <h1 className="text-[clamp(24px,4vw,32px)] font-extrabold tracking-[-.5px] text-ink">
        {editMode ? "Edit Data Pendaftaran" : "Formulir Pendaftaran"}
      </h1>
      <p className="mt-2 text-[15px] text-text-soft">
        Lengkapi data dengan benar. Tanda <span className="text-error">*</span> wajib diisi.
      </p>

      <div className="mt-8">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="mt-6 rounded-[20px] border border-border bg-surface p-[clamp(20px,3vw,32px)]">
        <h2 className="text-[19px] font-extrabold text-ink">{current.title}</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">{current.desc}</p>

        {step < 3 ? (
          <div className="mt-6 grid gap-[18px] sm:grid-cols-2">
            {current.fields.map((f: Field) =>
              f.type === "header" ? (
                <h3
                  key={f.name}
                  className="sm:col-span-2 mt-2 border-b border-border pb-2 text-[14px] font-extrabold uppercase tracking-wide text-brand-deep"
                >
                  {f.label}
                </h3>
              ) : (
                <FieldRenderer
                  key={f.name}
                  field={f}
                  value={data[f.name] ?? ""}
                  error={errors[f.name]}
                  regions={regionsFor(f.name)}
                  onChange={(v, id) => set(f.name, v, id)}
                />
              ),
            )}

            {step === 2 && (
              <>
                <h3 className="sm:col-span-2 mt-2 border-b border-border pb-2 text-[14px] font-extrabold uppercase tracking-wide text-brand-deep">
                  Berkas Unggahan
                </h3>
                {BERKAS.map((b) => (
                  <div key={b.name}>
                    <FileUpload
                      jenis={b.name}
                      label={b.label}
                      required
                      value={files[b.name]}
                      onUploaded={(jenis, file) => {
                        setFiles((p) => ({ ...p, [jenis]: file }));
                        setErrors((e) => ({ ...e, [jenis]: "" }));
                      }}
                    />
                    {errors[b.name] && (
                      <p className="mt-1.5 text-[12.5px] font-medium text-error">{errors[b.name]}</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-5 flex items-start gap-3 rounded-[12px] bg-surface-alt p-4 text-[13.5px] text-text">
              <Info size={20} className="mt-0.5 shrink-0 text-brand" />
              Periksa kembali seluruh data. Pastikan semua benar sebelum mengirim.
            </div>
            <DataReview data={data} berkas={BERKAS.map((b) => ({ jenis: b.name, url: files[b.name]?.url ?? "" })).filter((b) => b.url)} />
            {!editMode && (
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[12px] border border-border p-4">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--brand)]" />
                <span className="text-[13.5px] text-text">
                  Saya menyatakan bahwa seluruh data yang saya isi adalah benar dan dapat
                  dipertanggungjawabkan.
                </span>
              </label>
            )}
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 rounded-[11px] border border-[#cfe0c4] px-5 py-3 text-[14px] font-bold text-text transition hover:border-brand"
            >
              <ArrowLeft size={17} /> Kembali
            </button>
          ) : (
            <Link href="/psb" className="text-[14px] font-semibold text-muted-foreground hover:text-text">
              Batal
            </Link>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-[11px] bg-brand px-6 py-3 text-[14px] font-bold text-white transition hover:bg-brand-hover"
            >
              Lanjut <ArrowRight size={17} weight="bold" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-[11px] bg-brand px-6 py-3 text-[14px] font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
            >
              {submitting ? "Mengirim…" : editMode ? "Simpan Perubahan" : "Kirim Pendaftaran"}
              <PaperPlaneTilt size={17} weight="bold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

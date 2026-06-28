"use client";
import { useRef, useState } from "react";
import { UploadSimple, CheckCircle, Spinner } from "@phosphor-icons/react";
import { api, ApiError } from "@/lib/psb/api";
import { toast } from "sonner";

export function FileUpload({
  jenis,
  label,
  required,
  value,
  endpoint = "/api/psb/upload",
  onUploaded,
}: {
  jenis: string;
  label: string;
  required?: boolean;
  value?: { name: string; url: string };
  endpoint?: string;
  onUploaded: (jenis: string, file: { name: string; url: string }) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handle(file: File) {
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("jenis", jenis);
      const res = await api.upload<{ name: string; url: string; jenis?: string }>(endpoint, form);
      onUploaded(jenis, { name: res.name ?? file.name, url: res.url });
      toast.success(`${label} terunggah`);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Gagal mengunggah berkas");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-bold text-text">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex w-full items-center gap-3 rounded-[12px] border border-dashed border-input bg-surface-alt px-4 py-3.5 text-left transition hover:border-brand"
      >
        {busy ? (
          <Spinner size={22} className="animate-spin text-brand" />
        ) : value ? (
          <CheckCircle size={22} weight="fill" className="text-success" />
        ) : (
          <UploadSimple size={22} className="text-brand" />
        )}
        <span className="text-[13.5px] text-text">
          {value ? value.name : busy ? "Mengunggah…" : "Pilih berkas (JPG/PNG/PDF)"}
        </span>
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handle(file);
        }}
      />
    </div>
  );
}

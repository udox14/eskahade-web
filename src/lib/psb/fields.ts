// Single source of truth for the pendaftaran form: field config drives the UI
// (StepIdentitas/StepOrtu/StepKelengkapan), the Zod validation, the DataReview
// summary, and the column list written to eskahade-db.pendaftar.

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "tel"
  | "select"
  | "segment"
  | "textarea"
  | "file"
  | "header";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  span: "full" | "half";
  required?: boolean;
  options?: readonly string[];
  /** depends on another field's value (cascading wilayah) */
  dependsOn?: string;
  /** exact digit length validation when filled */
  digits?: number;
  hint?: string;
  /** explicit eskahade-db column override (else derived from name) */
  col?: string;
};

// ── Option sets ──────────────────────────────────────────────────────────
export const PENDIDIKAN = [
  "Tidak Sekolah", "SD", "SMP", "SMA/SMK", "D1–D3", "S1", "S2", "S3",
] as const;
export const PENGHASILAN = [
  "Tidak Berpenghasilan",
  "< Rp1.000.000",
  "Rp1.000.000 – Rp2.999.999",
  "Rp3.000.000 – Rp4.999.999",
  "Rp5.000.000 – Rp9.999.999",
  "≥ Rp10.000.000",
] as const;
export const SEKOLAH_SANTRI = [
  "MTs Sukahideng", "MA Sukahideng", "SMP Plus Sukahideng", "SMA Plus Sukahideng",
] as const;
export const KELAS = ["Kelas 7", "Kelas 8", "Kelas 9", "Kelas 10", "Kelas 11", "Kelas 12"] as const;
export const GOL_DARAH = ["A", "B", "AB", "O", "Tidak Tahu"] as const;
export const STATUS_ANAK = ["Anak Kandung", "Anak Tiri", "Anak Angkat"] as const;
export const JENIS_KELAMIN = ["Laki-laki", "Perempuan"] as const;
export const KEINGINAN = ["Sendiri", "Orang Tua", "Keluarga", "Lainnya"] as const;
export const KARTU_KESEHATAN = ["BPJS", "KIS", "Asuransi Lain", "Tidak Ada"] as const;
export const YA_TIDAK = ["Ya", "Tidak"] as const;

// ── Berkas (uploaded files) ──────────────────────────────────────────────
export const BERKAS: { name: string; label: string }[] = [
  { name: "fcKK", label: "FC Kartu Keluarga" },
  { name: "fcAkte", label: "FC Akte Kelahiran" },
  { name: "fcKtpAyah", label: "FC KTP Ayah" },
  { name: "fcKtpIbu", label: "FC KTP Ibu" },
  { name: "pasFoto", label: "Pas Foto (latar biru)" },
];
export const BERKAS_NAMES = BERKAS.map((b) => b.name);

// ── Steps ──────────────────────────────────────────────────────────────────
export const STEP_IDENTITAS: Field[] = [
  { name: "namaLengkap", label: "Nama Lengkap", type: "text", span: "full", required: true },
  { name: "namaPanggilan", label: "Nama Panggilan", type: "text", span: "half", required: true },
  { name: "jenisKelamin", label: "Jenis Kelamin", type: "segment", span: "half", required: true, options: JENIS_KELAMIN },
  { name: "tempatLahir", label: "Tempat Lahir", type: "text", span: "half", required: true },
  { name: "tanggalLahir", label: "Tanggal Lahir", type: "date", span: "half", required: true },
  { name: "nik", label: "NIK Santri", type: "number", span: "half", required: true, digits: 16 },
  { name: "nisn", label: "NISN Santri", type: "number", span: "half", required: true, digits: 10 },
  { name: "asalSD", label: "Asal Sekolah SD/MI", type: "text", span: "half", required: true, col: "asal_sd" },
  { name: "alamatSD", label: "Alamat Sekolah SD/MI", type: "text", span: "half", col: "alamat_sd" },
  { name: "asalSMP", label: "Asal Sekolah SMP/MTs", type: "text", span: "half", col: "asal_smp" },
  { name: "alamatSMP", label: "Alamat Sekolah SMP/MTs", type: "text", span: "half", col: "alamat_smp" },
  { name: "statusAnak", label: "Status Anak", type: "segment", span: "full", required: true, options: STATUS_ANAK },
  { name: "anakKe", label: "Anak Ke-", type: "number", span: "half", required: true },
  { name: "jumlahSaudara", label: "Jumlah Saudara", type: "number", span: "half", required: true },
  { name: "tinggiBadan", label: "Tinggi Badan (cm)", type: "number", span: "half" },
  { name: "beratBadan", label: "Berat Badan (kg)", type: "number", span: "half" },
  { name: "golonganDarah", label: "Golongan Darah", type: "segment", span: "full", options: GOL_DARAH },
  { name: "citaCita", label: "Cita-cita", type: "text", span: "half" },
  { name: "hobi", label: "Hobi", type: "text", span: "half" },
];

export const STEP_ORTU: Field[] = [
  { name: "_hAyah", label: "Data Ayah", type: "header", span: "full" },
  { name: "namaAyah", label: "Nama Ayah", type: "text", span: "full", required: true },
  { name: "nikAyah", label: "NIK Ayah (opsional)", type: "number", span: "half", digits: 16 },
  { name: "tglLahirAyah", label: "Tanggal Lahir Ayah", type: "date", span: "half" },
  { name: "usiaAyah", label: "Usia Ayah (tahun)", type: "number", span: "half" },
  { name: "pendidikanAyah", label: "Pendidikan Ayah", type: "select", span: "half", required: true, options: PENDIDIKAN },
  { name: "pekerjaanAyah", label: "Pekerjaan Ayah", type: "text", span: "half", required: true },
  { name: "waAyah", label: "No. WhatsApp Ayah", type: "tel", span: "half", required: true },
  { name: "penghasilanAyah", label: "Penghasilan Ayah", type: "select", span: "full", required: true, options: PENGHASILAN },

  { name: "_hIbu", label: "Data Ibu", type: "header", span: "full" },
  { name: "namaIbu", label: "Nama Ibu", type: "text", span: "full", required: true },
  { name: "nikIbu", label: "NIK Ibu (opsional)", type: "number", span: "half", digits: 16 },
  { name: "tglLahirIbu", label: "Tanggal Lahir Ibu", type: "date", span: "half" },
  { name: "usiaIbu", label: "Usia Ibu (tahun)", type: "number", span: "half" },
  { name: "pendidikanIbu", label: "Pendidikan Ibu", type: "select", span: "half", required: true, options: PENDIDIKAN },
  { name: "pekerjaanIbu", label: "Pekerjaan Ibu", type: "text", span: "half", required: true },
  { name: "waIbu", label: "No. WhatsApp Ibu", type: "tel", span: "half", required: true },
  { name: "penghasilanIbu", label: "Penghasilan Ibu", type: "select", span: "full", required: true, options: PENGHASILAN },

  { name: "_hAlamat", label: "Alamat Orang Tua / Wali", type: "header", span: "full" },
  { name: "alamatLengkap", label: "Alamat Lengkap", type: "textarea", span: "full", required: true },
  { name: "provinsi", label: "Provinsi", type: "select", span: "half", required: true },
  { name: "kabupaten", label: "Kabupaten/Kota", type: "select", span: "half", required: true, dependsOn: "provinsi" },
  { name: "kecamatan", label: "Kecamatan", type: "select", span: "half", required: true, dependsOn: "kabupaten" },
  { name: "desa", label: "Desa/Kelurahan", type: "select", span: "half", required: true, dependsOn: "kecamatan" },
  { name: "kodePos", label: "Kode Pos", type: "number", span: "half", digits: 5 },

  { name: "_hInfo", label: "Informasi Pendaftaran", type: "header", span: "full" },
  { name: "keinginan", label: "Masuk Pesantren Atas Keinginan", type: "segment", span: "full", required: true, options: KEINGINAN },
  { name: "sekolahSantri", label: "Sekolah Santri", type: "select", span: "half", required: true, options: SEKOLAH_SANTRI },
  { name: "kelas", label: "Kelas", type: "select", span: "half", required: true, options: KELAS },
];

export const STEP_KELENGKAPAN: Field[] = [
  { name: "lemari", label: "Membawa Lemari Sendiri?", type: "segment", span: "half", required: true, options: YA_TIDAK },
  { name: "kasur", label: "Membawa Kasur Sendiri?", type: "segment", span: "half", required: true, options: YA_TIDAK },
  { name: "kartuKesehatan", label: "Memiliki Kartu Kesehatan", type: "select", span: "full", required: true, options: KARTU_KESEHATAN },
  { name: "alasanPindah", label: "Alasan Pindah (bagi pindahan)", type: "textarea", span: "full" },
  { name: "kebiasaanKurangBaik", label: "Kebiasaan Yang Kurang Baik", type: "textarea", span: "full" },
  { name: "penyakit", label: "Penyakit Yang Pernah Diderita", type: "textarea", span: "full" },
];

export const STEPS = [
  { title: "Identitas Santri", desc: "Data diri calon santri.", fields: STEP_IDENTITAS },
  { title: "Orang Tua / Wali", desc: "Data ayah, ibu, alamat, dan informasi pendaftaran.", fields: STEP_ORTU },
  { title: "Kelengkapan & Berkas", desc: "Kelengkapan mondok dan unggahan berkas.", fields: STEP_KELENGKAPAN },
  { title: "Tinjau & Kirim", desc: "Periksa kembali data sebelum mengirim.", fields: [] as Field[] },
] as const;

// Every data field (excludes headers & files) — the columns we persist.
export const ALL_FIELDS: Field[] = [
  ...STEP_IDENTITAS,
  ...STEP_ORTU,
  ...STEP_KELENGKAPAN,
].filter((f) => f.type !== "header");

export const FIELD_NAMES = ALL_FIELDS.map((f) => f.name);

// camelCase -> snake_case column name in eskahade-db.pendaftar.
export function toColumn(name: string): string {
  return name.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
}

// Resolve a field's eskahade-db column (explicit override or derived).
export function colOf(f: Field): string {
  return f.col ?? toColumn(f.name);
}

// Ordered column list persisted to eskahade-db.pendaftar.
export const FIELD_COLUMNS = ALL_FIELDS.map(colOf);

export const FIELD_BY_NAME: Record<string, Field> = Object.fromEntries(
  ALL_FIELDS.map((f) => [f.name, f]),
);

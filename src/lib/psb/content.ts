// Default editable content for the PSB site. Seeded into the `settings` table
// (key = CONTENT_KEY) and overridable by admin. Public pages read the merged
// result from GET /api/psb/content. Numbers/dates follow the handoff prototype.

export type FeeItem = { label: string; nominal: number };
export type FeeGroup = { title: string; items: FeeItem[]; total: number };
export type DateItem = { tanggal: string; fase: string; catatan: string; icon: string };
export type AgendaItem = { tanggal: string; judul: string; deskripsi: string };
export type ReqGroup = { title: string; items: string[] };
export type Contact = { nama: string; role: string; wa: string };

export type SiteContent = {
  tahunPelajaran: string;
  importantDates: DateItem[];
  feeGroups: FeeGroup[];
  requirements: ReqGroup[];
  agenda: AgendaItem[];
  contacts: Contact[];
  rekening: { bank: string; nomor: string; atasNama: string };
  panduanDaftar: string[];
  alamat: string;
  waBendahara: string;
};

export const DEFAULT_CONTENT: SiteContent = {
  tahunPelajaran: "2026/2027",
  importantDates: [
    { tanggal: "25 Mar 2026", fase: "Pendaftaran Dibuka", catatan: "Gelombang 1", icon: "calendar-dots" },
    { tanggal: "30 Jun 2026", fase: "Pendaftaran Ditutup", catatan: "Batas akhir", icon: "calendar-x" },
    { tanggal: "05 Jul 2026", fase: "Verifikasi Berkas", catatan: "Oleh panitia", icon: "seal-check" },
    { tanggal: "12 Jul 2026", fase: "Daftar Ulang", catatan: "Santri diterima", icon: "house-line" },
  ],
  feeGroups: [
    {
      title: "Pendaftaran Online",
      items: [
        { label: "Formulir Pendaftaran", nominal: 150000 },
        { label: "Tes & Administrasi", nominal: 170000 },
      ],
      total: 320000,
    },
    {
      title: "Daftar Ulang",
      items: [
        { label: "Infaq Pembangunan", nominal: 800000 },
        { label: "Kegiatan & Ekstrakurikuler", nominal: 420000 },
        { label: "Seragam", nominal: 200000 },
      ],
      total: 1420000,
    },
    {
      title: "Perlengkapan / Cuci / Makan",
      items: [
        { label: "Perlengkapan Asrama", nominal: 500000 },
        { label: "Laundry (per semester)", nominal: 300000 },
        { label: "Makan (per bulan)", nominal: 600000 },
      ],
      total: 1400000,
    },
  ],
  requirements: [
    { title: "Umum", items: ["Beragama Islam", "Lulus SD/MI atau SMP/MTs sederajat", "Sehat jasmani dan rohani", "Bersedia mondok dan menaati peraturan pesantren"] },
    { title: "Administrasi", items: ["Mengisi formulir pendaftaran online", "Membayar biaya pendaftaran", "Mengikuti tes seleksi"] },
    { title: "Berkas Online", items: ["FC Kartu Keluarga", "FC Akte Kelahiran", "FC KTP Ayah & Ibu", "Pas foto latar biru"] },
    { title: "Berkas Daftar Ulang", items: ["Ijazah / SKL asli", "Rapor terakhir", "Kartu NISN", "Surat keterangan sehat"] },
    { title: "Ketentuan Tambahan", items: ["Membawa perlengkapan pribadi sesuai ketentuan", "Mengikuti masa orientasi santri baru"] },
  ],
  agenda: [
    { tanggal: "25 Maret 2026", judul: "Pembukaan Pendaftaran", deskripsi: "Pendaftaran online gelombang 1 dibuka." },
    { tanggal: "30 Juni 2026", judul: "Penutupan Pendaftaran", deskripsi: "Batas akhir pengisian formulir online." },
    { tanggal: "05 Juli 2026", judul: "Verifikasi Berkas", deskripsi: "Panitia memverifikasi kelengkapan berkas pendaftar." },
    { tanggal: "08 Juli 2026", judul: "Pengumuman Hasil", deskripsi: "Hasil seleksi diumumkan melalui halaman santri." },
    { tanggal: "12 Juli 2026", judul: "Daftar Ulang", deskripsi: "Santri yang diterima melakukan daftar ulang." },
  ],
  contacts: [
    { nama: "Panitia PSB 1", role: "Panitia PSB", wa: "082218602629" },
    { nama: "Panitia PSB 2", role: "Panitia PSB", wa: "082218602629" },
    { nama: "Panitia PSB 3", role: "Panitia PSB", wa: "082218602629" },
    { nama: "Panitia PSB 4", role: "Panitia PSB", wa: "082218602629" },
    { nama: "Panitia PSB 5", role: "Panitia PSB", wa: "082218602629" },
  ],
  rekening: { bank: "BRI", nomor: "0000-0000-0000-000", atasNama: "Panitia PSB Sukahideng" },
  panduanDaftar: [
    "Isi formulir pendaftaran online dengan data yang benar.",
    "Unggah berkas yang dipersyaratkan (KK, akte, KTP ortu, pas foto).",
    "Catat Nomor Pendaftaran dan kata sandi (tanggal lahir) yang muncul.",
    "Lakukan pembayaran biaya pendaftaran ke rekening panitia.",
    "Pantau status verifikasi melalui Halaman Santri.",
  ],
  alamat: "Pondok Pesantren Sukahideng, Tanjungkerta, Sukarapih, Sukaratu, Tasikmalaya, Jawa Barat",
  waBendahara: "082218602629",
};

// Prefixed so it never collides with eskahade-web's own site settings keys.
export const CONTENT_KEY = "psb_site_content";

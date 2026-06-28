// Central module registry — drives admin sidebar nav and dashboard quick links.
// Add entry here when adding a new content module.
export interface ModuleEntry {
  key: string;
  label: string;
  icon: string; // phosphor icon name
  href: string; // /admin/<href>
  group: string;
}

export const MODULE_REGISTRY: ModuleEntry[] = [
  // Beranda group
  { key: "hero", label: "Hero / Banner", icon: "layout", href: "hero", group: "Beranda" },
  { key: "services", label: "Layanan (Kartu)", icon: "squares-four", href: "services", group: "Beranda" },
  { key: "stats", label: "Statistik", icon: "chart-bar", href: "stats", group: "Beranda" },
  { key: "programs", label: "Program Pendidikan", icon: "books", href: "programs", group: "Beranda" },
  { key: "events", label: "Agenda", icon: "calendar-dots", href: "events", group: "Beranda" },
  { key: "testimonials", label: "Testimoni", icon: "quotes", href: "testimonials", group: "Beranda" },
  // Profil group
  { key: "profile-hero", label: "Profil Hero", icon: "image", href: "profil/hero", group: "Profil" },
  { key: "sambutan", label: "Sambutan Pimpinan", icon: "user-circle", href: "profil/sambutan", group: "Profil" },
  { key: "vision", label: "Visi & Misi", icon: "target", href: "profil/vision", group: "Profil" },
  { key: "history", label: "Sejarah / Timeline", icon: "clock-clockwise", href: "profil/history", group: "Profil" },
  { key: "facilities", label: "Fasilitas", icon: "buildings", href: "profil/facilities", group: "Profil" },
  // Berita
  { key: "news", label: "Berita & Kegiatan", icon: "newspaper", href: "berita", group: "Berita" },
  { key: "news-categories", label: "Kategori Berita", icon: "tag", href: "berita/kategori", group: "Berita" },
  // Galeri
  { key: "gallery", label: "Foto Galeri", icon: "images", href: "galeri", group: "Galeri" },
  { key: "gallery-categories", label: "Kategori Galeri", icon: "tag", href: "galeri/kategori", group: "Galeri" },
  // Struktur
  { key: "org", label: "Struktur Organisasi", icon: "tree-structure", href: "struktur", group: "Struktur" },
  // PSB (Penerimaan Santri Baru)
  { key: "psb-pendaftar", label: "Pendaftar PSB", icon: "users-three", href: "psb/pendaftar", group: "PSB" },
  { key: "psb-konten", label: "Konten PSB", icon: "sliders-horizontal", href: "psb/konten", group: "PSB" },
  // Pengaturan
  { key: "settings", label: "Pengaturan Situs", icon: "gear", href: "pengaturan", group: "Pengaturan" },
  { key: "media", label: "Perpustakaan Media", icon: "folder-open", href: "media", group: "Pengaturan" },
];

export function getGroupedModules() {
  const groups: Record<string, ModuleEntry[]> = {};
  for (const m of MODULE_REGISTRY) {
    if (!groups[m.group]) groups[m.group] = [];
    groups[m.group].push(m);
  }
  return groups;
}

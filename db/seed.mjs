/**
 * Seed script — generates db/seed.sql with hashed admin password, then runs it.
 * Usage: node db/seed.mjs [local|remote]
 * Default: local
 */
import { randomBytes, pbkdf2 as pbkdf2Node } from "node:crypto";
import { promisify } from "node:util";
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const pbkdf2 = promisify(pbkdf2Node);
const mode = process.argv[2] ?? "local";
const adminEmail = process.env.ADMIN_EMAIL ?? "admin@sukahideng.or.id";
const adminName = process.env.ADMIN_NAME ?? "Admin Sukahideng";
const adminPassword = process.env.ADMIN_PASSWORD ?? "Sukahideng2026!";

// Compute PBKDF2 hash identical to auth.ts implementation
const salt = randomBytes(16);
const key = await pbkdf2(adminPassword, salt, 100_000, 32, "sha256");
const passwordHash = `pbkdf2:${salt.toString("hex")}:${key.toString("hex")}`;
const now = new Date().toISOString();

function esc(s) {
  return String(s ?? "").replace(/'/g, "''");
}

const sql = `
-- ─── Settings ──────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO settings (key, value) VALUES ('nama_lembaga', 'Pondok Pesantren Sukahideng');
INSERT OR IGNORE INTO settings (key, value) VALUES ('sub_lembaga', 'Lembaga Pendidikan');
INSERT OR IGNORE INTO settings (key, value) VALUES ('sub_lokasi', 'Kab. Tasikmalaya · Jawa Barat');
INSERT OR IGNORE INTO settings (key, value) VALUES ('bismillah_arabic', 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_phone1', '(0265) 545 123');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_phone2', '0812 3456 7890');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_email', 'info@ppsukahideng.sch.id');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_address', 'Kp. Sukahideng, Ds. Sukarapih, Kec. Sukarame, Kab. Tasikmalaya, Jawa Barat 46461');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_location_short', 'Sukarame, Tasikmalaya');
INSERT OR IGNORE INTO settings (key, value) VALUES ('social_instagram_handle', '@ppsukahideng');
INSERT OR IGNORE INTO settings (key, value) VALUES ('social_instagram_url', 'https://instagram.com/ppsukahideng');
INSERT OR IGNORE INTO settings (key, value) VALUES ('social_youtube_url', 'https://youtube.com/@ppsukahideng');
INSERT OR IGNORE INTO settings (key, value) VALUES ('social_facebook_url', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('maps_embed_url', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('maps_link', 'https://maps.google.com/?q=Sukahideng+Tasikmalaya');
INSERT OR IGNORE INTO settings (key, value) VALUES ('logo_key', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('footer_copyright', '© 2026 Pondok Pesantren Sukahideng. Hak cipta dilindungi.');
INSERT OR IGNORE INTO settings (key, value) VALUES ('footer_managed_by', 'Dikelola oleh Tim Media Sukahideng');

-- ─── Hero ──────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO hero (id, badge_text, heading_pre, heading_highlight, heading_post, subheading, cta1_label, cta1_href, cta2_label, cta2_href, float_number, float_label, accent_number, accent_label)
VALUES (1, 'Berkhidmat sejak 1922', 'Menempa Generasi', 'Berilmu', '& Berakhlak Mulia',
  'Memadukan tradisi keilmuan pesantren salafiyah dengan pendidikan formal yang modern — membentuk santri yang mendalam ilmunya, kokoh imannya, dan bermanfaat bagi masyarakat.',
  'Penerimaan Santri Baru', '#layanan', 'Jelajahi Pesantren', '/profil',
  '2.400+', 'Santri Aktif', '100Th+', 'Pengabdian');

-- ─── Services ──────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO services (title, description, cta, icon, href, scheme, sort_order) VALUES
  ('ESKAHADE', 'Sistem manajemen pesantren — akademik, keuangan & administrasi santri dalam satu portal.', 'Masuk Portal', 'squares-four', '#', 'green', 0);
INSERT OR IGNORE INTO services (title, description, cta, icon, href, scheme, sort_order) VALUES
  ('PSB — Santri Baru', 'Pendaftaran Penerimaan Santri Baru secara daring. Cek alur, syarat & jadwal seleksi.', 'Daftar Sekarang', 'student', '#', 'gold', 1);
INSERT OR IGNORE INTO services (title, description, cta, icon, href, scheme, sort_order) VALUES
  ('Web IKHLASH', 'Ikatan Keluarga Harmonis Lintas Alumni Sukahideng — jejaring & kabar alumni.', 'Kunjungi', 'users-three', '#', 'light', 2);

-- ─── Stats ─────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO stats (number, label, icon, sort_order) VALUES ('2.400+', 'Santri Aktif', 'users-three', 0);
INSERT OR IGNORE INTO stats (number, label, icon, sort_order) VALUES ('100Th', 'Tahun Pengabdian', 'tree', 1);
INSERT OR IGNORE INTO stats (number, label, icon, sort_order) VALUES ('8', 'Jenjang Pendidikan', 'books', 2);
INSERT OR IGNORE INTO stats (number, label, icon, sort_order) VALUES ('12rb+', 'Alumni Tersebar', 'graduation-cap', 3);

-- ─── Programs ──────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO programs (title, description, tag, icon, sort_order) VALUES
  ('Madrasah Diniyah', 'Kajian kitab kuning, nahwu-sharaf, fiqih, dan tahfizh Al-Qur''an dengan metode salafiyah.', 'Salafiyah', 'book-open-text', 0);
INSERT OR IGNORE INTO programs (title, description, tag, icon, sort_order) VALUES
  ('MTs & MA', 'Jenjang formal terakreditasi yang memadukan kurikulum nasional dengan kepesantrenan.', 'Formal · Terakreditasi', 'graduation-cap', 1);
INSERT OR IGNORE INTO programs (title, description, tag, icon, sort_order) VALUES
  ('Tahfizh Al-Qur''an', 'Program menghafal Al-Qur''an 30 juz dengan bimbingan dan setoran rutin terstruktur.', '30 Juz', 'book-bookmark', 2);
INSERT OR IGNORE INTO programs (title, description, tag, icon, sort_order) VALUES
  ('Bahasa Arab & Inggris', 'Pembiasaan dua bahasa dalam keseharian santri untuk wawasan global.', 'Bilingual', 'translate', 3);
INSERT OR IGNORE INTO programs (title, description, tag, icon, sort_order) VALUES
  ('Keterampilan & Wirausaha', 'Pelatihan kecakapan hidup: pertanian, koperasi, dan kemandirian ekonomi santri.', 'Life Skill', 'plant', 4);
INSERT OR IGNORE INTO programs (title, description, tag, icon, sort_order) VALUES
  ('Kepengasuhan & Akhlak', 'Pembinaan karakter, ubudiyah, dan kepemimpinan melalui keteladanan asatidz.', 'Karakter', 'hand-heart', 5);

-- ─── Events ────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (day, month, full_date, title, time, location, sort_order) VALUES
  ('28', 'Jun', '28 Juni 2026', 'Pembukaan Pendaftaran Santri Baru 2026/2027', '08.00 WIB', 'Kantor PSB', 0);
INSERT OR IGNORE INTO events (day, month, full_date, title, time, location, sort_order) VALUES
  ('05', 'Jul', '5 Juli 2026', 'Pengajian Akbar & Haul Pendiri Pesantren', '19.30 WIB', 'Masjid Jami''', 1);
INSERT OR IGNORE INTO events (day, month, full_date, title, time, location, sort_order) VALUES
  ('14', 'Jul', '14 Juli 2026', 'Tes Seleksi Masuk Gelombang I', '07.30 WIB', 'Aula Utama', 2);
INSERT OR IGNORE INTO events (day, month, full_date, title, time, location, sort_order) VALUES
  ('20', 'Jul', '20 Juli 2026', 'Awal Tahun Ajaran & Masa Ta''aruf Santri', '08.00 WIB', 'Lapangan Pesantren', 3);

-- ─── Testimonials ──────────────────────────────────────────────────────────
INSERT OR IGNORE INTO testimonials (quote, name, role, initials, avatar_color, sort_order) VALUES
  ('Sukahideng menanamkan adab sebelum ilmu. Putra kami pulang dengan akhlak yang berubah nyata dan hafalan yang terjaga.', 'Hj. Siti Maryam', 'Wali Santri', 'SM', '#DCE6D5', 0);
INSERT OR IGNORE INTO testimonials (quote, name, role, initials, avatar_color, sort_order) VALUES
  ('Bekal kemandirian dan keilmuan di sini sangat membantu saya melanjutkan ke perguruan tinggi dan terjun di masyarakat.', 'Ust. Rahmat Hidayat', 'Alumni 2012', 'RH', '#E7EFE0', 1);
INSERT OR IGNORE INTO testimonials (quote, name, role, initials, avatar_color, sort_order) VALUES
  ('Lingkungan yang teduh, asatidz yang sabar, dan tradisi keilmuan yang kuat. Tempat terbaik menumbuhkan generasi Qur''ani.', 'Dr. Asep Saepudin', 'Tokoh Masyarakat', 'AS', '#DCE6D5', 2);

-- ─── News Categories ───────────────────────────────────────────────────────
INSERT OR IGNORE INTO news_categories (name, slug) VALUES ('Acara', 'acara');
INSERT OR IGNORE INTO news_categories (name, slug) VALUES ('Prestasi', 'prestasi');
INSERT OR IGNORE INTO news_categories (name, slug) VALUES ('Pengumuman', 'pengumuman');
INSERT OR IGNORE INTO news_categories (name, slug) VALUES ('Kegiatan', 'kegiatan');
INSERT OR IGNORE INTO news_categories (name, slug) VALUES ('Info', 'info');

-- ─── News Posts ────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Haflah Akhirussanah & Wisuda Tahfizh Angkatan ke-78',
  'haflah-akhirussanah-wisuda-tahfizh-angkatan-78',
  (SELECT id FROM news_categories WHERE slug='acara'),
  '12 Juni 2026', '2026-06-12',
  'Perayaan akhir tahun sekaligus wisuda program tahfizh angkatan ke-78 berlangsung khidmat dan meriah.',
  '<p>Perayaan akhir tahun sekaligus wisuda program tahfizh angkatan ke-78 berlangsung khidmat dan meriah di Masjid Jami'' Pesantren.</p>',
  1, 1, '${now}', '${now}');

INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Santri Sukahideng Raih Juara MQK Tingkat Provinsi',
  'santri-raih-juara-mqk-tingkat-provinsi',
  (SELECT id FROM news_categories WHERE slug='prestasi'),
  '3 Juni 2026', '2026-06-03',
  'Delegasi pesantren memboyong gelar pada Musabaqah Qiraatil Kutub se-Jawa Barat.',
  '<p>Delegasi Pondok Pesantren Sukahideng berhasil memboyong gelar pada Musabaqah Qiraatil Kutub (MQK) tingkat Provinsi Jawa Barat.</p>',
  0, 1, '${now}', '${now}');

INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Pembangunan Asrama Putri Tahap II Resmi Dimulai',
  'pembangunan-asrama-putri-tahap-2',
  (SELECT id FROM news_categories WHERE slug='pengumuman'),
  '28 Mei 2026', '2026-05-28',
  'Peletakan batu pertama menandai perluasan daya tampung santri putri.',
  '<p>Peletakan batu pertama pembangunan Asrama Putri Tahap II telah resmi dilaksanakan, menandai perluasan daya tampung santri putri.</p>',
  0, 1, '${now}', '${now}');

INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Tasyakuran Khataman Kitab Ihya Ulumuddin',
  'tasyakuran-khataman-ihya-ulumuddin',
  (SELECT id FROM news_categories WHERE slug='kegiatan'),
  '21 Mei 2026', '2026-05-21',
  'Pengajian rutin menuntaskan kajian kitab besar Imam Al-Ghazali.',
  '<p>Pengajian rutin berhasil menuntaskan kajian kitab besar Ihya Ulumuddin karya Imam Al-Ghazali dalam sebuah tasyakuran yang penuh khidmat.</p>',
  0, 1, '${now}', '${now}');

INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Peringatan Isra Mi''raj Bersama Masyarakat Sekitar',
  'peringatan-isra-miraj-bersama-masyarakat',
  (SELECT id FROM news_categories WHERE slug='acara'),
  '14 Mei 2026', '2026-05-14',
  'Tabligh akbar mempererat ukhuwah pesantren dan warga desa.',
  '<p>Peringatan Isra Mi''raj dilaksanakan bersama masyarakat sekitar dalam rangka mempererat ukhuwah islamiyah antara pesantren dan warga desa.</p>',
  0, 1, '${now}', '${now}');

INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Pelatihan Jurnalistik untuk Santri Media',
  'pelatihan-jurnalistik-santri-media',
  (SELECT id FROM news_categories WHERE slug='kegiatan'),
  '6 Mei 2026', '2026-05-06',
  'Membekali santri keterampilan menulis dan dokumentasi kegiatan.',
  '<p>Program pelatihan jurnalistik diselenggarakan untuk membekali santri dengan keterampilan menulis dan mendokumentasikan kegiatan pesantren secara profesional.</p>',
  0, 1, '${now}', '${now}');

INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Santri Sukahideng Ikuti Kemah Bakti Sosial',
  'santri-kemah-bakti-sosial',
  (SELECT id FROM news_categories WHERE slug='kegiatan'),
  '29 April 2026', '2026-04-29',
  'Pengabdian masyarakat melalui kegiatan bakti sosial di desa binaan.',
  '<p>Puluhan santri mengikuti Kemah Bakti Sosial di desa binaan pesantren, wujud nyata pengabdian kepada masyarakat.</p>',
  0, 1, '${now}', '${now}');

INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Pengumuman Hasil Seleksi Beasiswa Tahfizh',
  'pengumuman-beasiswa-tahfizh',
  (SELECT id FROM news_categories WHERE slug='pengumuman'),
  '20 April 2026', '2026-04-20',
  'Daftar penerima beasiswa program tahfizh tahun ini telah diumumkan.',
  '<p>Panitia beasiswa resmi mengumumkan daftar penerima beasiswa program tahfizh untuk tahun ajaran 2026/2027.</p>',
  0, 1, '${now}', '${now}');

INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Juara Umum Lomba Kaligrafi Antar Pesantren',
  'juara-lomba-kaligrafi-antar-pesantren',
  (SELECT id FROM news_categories WHERE slug='prestasi'),
  '11 April 2026', '2026-04-11',
  'Karya santri memukau dewan juri pada festival seni Islami.',
  '<p>Santri Pesantren Sukahideng berhasil meraih gelar Juara Umum pada Lomba Kaligrafi Antar Pesantren yang diikuti oleh puluhan lembaga se-Jawa Barat.</p>',
  0, 1, '${now}', '${now}');

INSERT OR IGNORE INTO news_posts (title, slug, category_id, date, published_at, excerpt, body, featured, published, created_at, updated_at)
VALUES ('Halal Bihalal Keluarga Besar Sukahideng',
  'halal-bihalal-keluarga-besar-sukahideng',
  (SELECT id FROM news_categories WHERE slug='acara'),
  '2 April 2026', '2026-04-02',
  'Silaturahmi alumni, asatidz, dan wali santri di awal Syawal.',
  '<p>Halal Bihalal keluarga besar Pondok Pesantren Sukahideng mempertemukan ribuan alumni, asatidz, dan wali santri dalam suasana penuh keakraban di awal Syawal.</p>',
  0, 1, '${now}', '${now}');

-- ─── Gallery Categories ─────────────────────────────────────────────────────
INSERT OR IGNORE INTO gallery_categories (name, slug) VALUES ('Ibadah', 'ibadah');
INSERT OR IGNORE INTO gallery_categories (name, slug) VALUES ('Pembelajaran', 'pembelajaran');
INSERT OR IGNORE INTO gallery_categories (name, slug) VALUES ('Kegiatan', 'kegiatan');
INSERT OR IGNORE INTO gallery_categories (name, slug) VALUES ('Lingkungan', 'lingkungan');

-- ─── Gallery Photos ─────────────────────────────────────────────────────────
INSERT OR IGNORE INTO gallery_photos (caption, category_id, col_span, row_span, sort_order)
VALUES ('Kegiatan Mengaji', (SELECT id FROM gallery_categories WHERE slug='ibadah'), 2, 2, 0);
INSERT OR IGNORE INTO gallery_photos (caption, category_id, col_span, row_span, sort_order)
VALUES ('Asrama Santri', (SELECT id FROM gallery_categories WHERE slug='lingkungan'), 1, 1, 1);
INSERT OR IGNORE INTO gallery_photos (caption, category_id, col_span, row_span, sort_order)
VALUES ('Olahraga', (SELECT id FROM gallery_categories WHERE slug='kegiatan'), 1, 1, 2);
INSERT OR IGNORE INTO gallery_photos (caption, category_id, col_span, row_span, sort_order)
VALUES ('Masjid Jami''', (SELECT id FROM gallery_categories WHERE slug='lingkungan'), 1, 1, 3);
INSERT OR IGNORE INTO gallery_photos (caption, category_id, col_span, row_span, sort_order)
VALUES ('Wisuda', (SELECT id FROM gallery_categories WHERE slug='kegiatan'), 1, 1, 4);
INSERT OR IGNORE INTO gallery_photos (caption, category_id, col_span, row_span, sort_order)
VALUES ('Kebun Santri', (SELECT id FROM gallery_categories WHERE slug='kegiatan'), 2, 1, 5);

-- ─── Org Members ───────────────────────────────────────────────────────────
INSERT OR IGNORE INTO org_members (role, name, level, icon, sort_order)
VALUES ('Pengasuh / Pimpinan', 'K.H. Ahmad Fauzi Sukahideng', 'pimpinan', 'user-circle', 0);
INSERT OR IGNORE INTO org_members (role, name, level, icon, sort_order)
VALUES ('Ketua Yayasan', 'K.H. Dadang Ridwan', 'atas', 'user-circle', 1);
INSERT OR IGNORE INTO org_members (role, name, level, icon, sort_order)
VALUES ('Mudir / Direktur', 'K.H. Endang Saputra', 'atas', 'user-circle', 2);
INSERT OR IGNORE INTO org_members (role, name, level, icon, sort_order)
VALUES ('Sekretaris', 'Ust. Hilman Fauzi', 'atas', 'user-circle', 3);
INSERT OR IGNORE INTO org_members (role, name, level, icon, sort_order)
VALUES ('Kepala Madrasah', 'Ust. Yusuf Maulana', 'bawah', 'user', 4);
INSERT OR IGNORE INTO org_members (role, name, level, icon, sort_order)
VALUES ('Lurah Pondok', 'Ust. Imam Sururi', 'bawah', 'user', 5);
INSERT OR IGNORE INTO org_members (role, name, level, icon, sort_order)
VALUES ('Bendahara', 'Ust. Nandang H.', 'bawah', 'user', 6);
INSERT OR IGNORE INTO org_members (role, name, level, icon, sort_order)
VALUES ('Humas', 'Ust. Fikri Aulia', 'bawah', 'user', 7);

-- ─── Profile Hero ──────────────────────────────────────────────────────────
INSERT OR IGNORE INTO profile_hero (id, eyebrow, title, paragraph)
VALUES (1, 'Tentang Kami', 'Satu Abad Menempa Generasi Berilmu & Berakhlak',
  'Pondok Pesantren Sukahideng telah berdiri sejak 1922, berkhidmat mendidik santri dengan memadukan tradisi keilmuan salafiyah dan pendidikan formal modern di bawah naungan Kabupaten Tasikmalaya.');

-- ─── Sambutan ──────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO sambutan (id, arabic, name, role, paragraph1, paragraph2)
VALUES (1, 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ', 'K.H. Ahmad Fauzi Sukahideng', 'Pengasuh / Pimpinan Pesantren',
  'Assalamu''alaikum warahmatullahi wabarakatuh. Segala puji bagi Allah SWT yang telah memberikan kesempatan kepada kita untuk terus berkhidmat dalam dunia pendidikan Islam. Pondok Pesantren Sukahideng hadir sebagai tempat menimba ilmu yang memadukan kearifan salafiyah dengan kebutuhan zaman.',
  'Kami berkomitmen untuk terus mencetak generasi yang tidak hanya pandai secara akademik, tetapi juga kuat imannya, mulia akhlaknya, dan bermanfaat bagi masyarakat. Semoga Allah SWT meridhai setiap langkah perjuangan kita. Wassalamu''alaikum warahmatullahi wabarakatuh.');

-- ─── Vision ────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO vision (id, vision_text, quote_text)
VALUES (1,
  'Menjadi lembaga pendidikan Islam terkemuka yang menghasilkan generasi berilmu, berakhlak mulia, mandiri, dan bermanfaat bagi agama, bangsa, dan masyarakat global.',
  '"Tuntutlah ilmu dari buaian hingga liang lahat" — Hadits');

-- ─── History Timeline ──────────────────────────────────────────────────────
INSERT OR IGNORE INTO history_timeline (year, title, description, sort_order)
VALUES ('1922', 'Awal Mula', 'Pesantren dirintis sebagai majelis pengajian masyarakat di Sukahideng, Tasikmalaya.', 0);
INSERT OR IGNORE INTO history_timeline (year, title, description, sort_order)
VALUES ('1960', 'Pendirian Madrasah', 'Pendidikan diniyah formal mulai diselenggarakan secara terstruktur.', 1);
INSERT OR IGNORE INTO history_timeline (year, title, description, sort_order)
VALUES ('1998', 'Jenjang Formal', 'Pendirian MTs dan MA terakreditasi melengkapi pendidikan pesantren.', 2);
INSERT OR IGNORE INTO history_timeline (year, title, description, sort_order)
VALUES ('2026', 'Era Digital', 'Modernisasi layanan melalui sistem manajemen dan kanal informasi resmi.', 3);

-- ─── Mission Points ─────────────────────────────────────────────────────────
INSERT OR IGNORE INTO mission_points (number, text, sort_order)
VALUES ('1', 'Menyelenggarakan pendidikan salafiyah yang menjaga keaslian tradisi keilmuan pesantren.', 0);
INSERT OR IGNORE INTO mission_points (number, text, sort_order)
VALUES ('2', 'Memadukan ilmu agama dan ilmu umum secara seimbang dan terakreditasi.', 1);
INSERT OR IGNORE INTO mission_points (number, text, sort_order)
VALUES ('3', 'Membina akhlak mulia melalui keteladanan dan pembiasaan ubudiyah.', 2);
INSERT OR IGNORE INTO mission_points (number, text, sort_order)
VALUES ('4', 'Menumbuhkan kemandirian dan jiwa kepemimpinan santri.', 3);
INSERT OR IGNORE INTO mission_points (number, text, sort_order)
VALUES ('5', 'Mengabdi kepada masyarakat dan memperkuat ukhuwah islamiyah.', 4);

-- ─── Facilities ─────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO facilities (name, icon, sort_order)
VALUES ('Masjid Jami''', 'mosque', 0);
INSERT OR IGNORE INTO facilities (name, icon, sort_order)
VALUES ('Asrama Santri', 'house-line', 1);
INSERT OR IGNORE INTO facilities (name, icon, sort_order)
VALUES ('Ruang Kelas', 'chalkboard-teacher', 2);
INSERT OR IGNORE INTO facilities (name, icon, sort_order)
VALUES ('Perpustakaan', 'books', 3);
INSERT OR IGNORE INTO facilities (name, icon, sort_order)
VALUES ('Lab Komputer', 'desktop', 4);
INSERT OR IGNORE INTO facilities (name, icon, sort_order)
VALUES ('Lapangan Olahraga', 'soccer-ball', 5);
INSERT OR IGNORE INTO facilities (name, icon, sort_order)
VALUES ('Koperasi', 'storefront', 6);
INSERT OR IGNORE INTO facilities (name, icon, sort_order)
VALUES ('Klinik Kesehatan', 'first-aid-kit', 7);

-- ─── Admin User ─────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO admin_users (email, password_hash, name, created_at)
VALUES ('${esc(adminEmail)}', '${esc(passwordHash)}', '${esc(adminName)}', '${now}');
`.trim();

writeFileSync("db/seed.sql", sql, "utf-8");
console.log("✓ db/seed.sql generated");
console.log(`  Admin email   : ${adminEmail}`);
console.log(`  Admin password: ${adminPassword}`);
console.log(`  Mode          : ${mode}`);

const flag = mode === "remote" ? "--remote" : "--local";
const cmd = `wrangler d1 execute sukahideng-web ${flag} --file=db/seed.sql`;
console.log(`\n$ ${cmd}\n`);
execSync(cmd, { stdio: "inherit" });
console.log("\n✓ Seed complete.");

import type { D1Database } from "@cloudflare/workers-types";
import { ALL_FIELDS, colOf, BERKAS_NAMES } from "@/lib/psb/fields";

// Cross-DB repository: all reads/writes against eskahade-db (binding ESKAHADE_DB).
// The `pendaftar`/`pendaftar_berkas` tables are NOT in our drizzle schema, so we
// use raw prepared statements. Column names come from the trusted field config
// (never user input); values are always bound.

const TP_YEAR = "2026"; // Tahun Pelajaran 2026/2027

function uuid(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

export type PendaftarRow = Record<string, string | number | null>;

// PSB-2026-XXXX — next sequence for the TP year.
export async function generateNoReg(db: D1Database): Promise<string> {
  const row = await db
    .prepare("SELECT COUNT(*) AS n FROM pendaftar WHERE no_reg LIKE ?")
    .bind(`PSB-${TP_YEAR}-%`)
    .first<{ n: number }>();
  const next = (row?.n ?? 0) + 1;
  return `PSB-${TP_YEAR}-${String(next).padStart(4, "0")}`;
}

// Insert a new prospective student. `data` is camelCase field name -> value.
export async function createPendaftar(
  db: D1Database,
  data: Record<string, unknown>,
): Promise<{ id: string; noReg: string; password: string }> {
  const id = uuid();
  const noReg = await generateNoReg(db);
  const ts = nowIso();

  const cols = ["id", "no_reg", "status", "created_at", "updated_at"];
  const vals: (string | number | null)[] = [id, noReg, "menunggu", ts, ts];
  for (const f of ALL_FIELDS) {
    cols.push(colOf(f));
    const v = data[f.name];
    vals.push(v === undefined || v === "" ? null : String(v));
  }
  const placeholders = cols.map(() => "?").join(", ");
  await db
    .prepare(`INSERT INTO pendaftar (${cols.join(", ")}) VALUES (${placeholders})`)
    .bind(...vals)
    .run();

  const password = String(data["tanggalLahir"] ?? ""); // password = tanggal lahir
  return { id, noReg, password };
}

export async function upsertBerkas(db: D1Database, pendaftarId: string, jenis: string, url: string) {
  if (!BERKAS_NAMES.includes(jenis)) throw new Error("jenis berkas tidak valid");
  await db
    .prepare(
      `INSERT INTO pendaftar_berkas (id, pendaftar_id, jenis, url, uploaded_at)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(pendaftar_id, jenis) DO UPDATE SET url = excluded.url, uploaded_at = datetime('now')`,
    )
    .bind(uuid(), pendaftarId, jenis, url)
    .run();
}

export async function getBerkas(db: D1Database, pendaftarId: string) {
  const res = await db
    .prepare("SELECT jenis, url, uploaded_at FROM pendaftar_berkas WHERE pendaftar_id = ?")
    .bind(pendaftarId)
    .all<{ jenis: string; url: string; uploaded_at: string }>();
  return res.results ?? [];
}

export async function getPendaftarById(db: D1Database, id: string): Promise<PendaftarRow | null> {
  return (await db.prepare("SELECT * FROM pendaftar WHERE id = ?").bind(id).first()) as PendaftarRow | null;
}

export async function findByLogin(
  db: D1Database,
  noReg: string,
  tanggalLahir: string,
): Promise<PendaftarRow | null> {
  return (await db
    .prepare("SELECT * FROM pendaftar WHERE no_reg = ? AND tanggal_lahir = ?")
    .bind(noReg, tanggalLahir)
    .first()) as PendaftarRow | null;
}

// Update editable fields (santri self-edit). Only data fields are writable.
export async function updatePendaftar(db: D1Database, id: string, data: Record<string, unknown>) {
  const sets: string[] = [];
  const vals: (string | number | null)[] = [];
  for (const f of ALL_FIELDS) {
    if (f.name in data) {
      sets.push(`${colOf(f)} = ?`);
      const v = data[f.name];
      vals.push(v === undefined || v === "" ? null : String(v));
    }
  }
  if (!sets.length) return;
  sets.push("updated_at = ?");
  vals.push(nowIso());
  vals.push(id);
  await db.prepare(`UPDATE pendaftar SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
}

export type ListFilter = { q?: string; status?: string };

export async function listPendaftar(db: D1Database, filter: ListFilter = {}) {
  const where: string[] = [];
  const binds: string[] = [];
  if (filter.q) {
    where.push("(nama_lengkap LIKE ? OR no_reg LIKE ?)");
    binds.push(`%${filter.q}%`, `%${filter.q}%`);
  }
  if (filter.status) {
    where.push("status = ?");
    binds.push(filter.status);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const res = await db
    .prepare(
      `SELECT id, no_reg, nama_lengkap, sekolah_santri, kelas, status,
              berkas_verified, bayar_verified, santri_id, created_at
       FROM pendaftar ${clause} ORDER BY created_at DESC`,
    )
    .bind(...binds)
    .all<PendaftarRow>();
  return res.results ?? [];
}

export async function pendaftarStats(db: D1Database) {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN berkas_verified = 1 THEN 1 ELSE 0 END) AS berkas,
              SUM(CASE WHEN bayar_verified = 1 THEN 1 ELSE 0 END) AS bayar
       FROM pendaftar`,
    )
    .first<{ total: number; berkas: number; bayar: number }>();
  return { total: row?.total ?? 0, verifiedBerkas: row?.berkas ?? 0, paid: row?.bayar ?? 0 };
}

// Toggle berkas/bayar verification (admin). Also nudges the status label.
export async function setVerify(db: D1Database, id: string, kind: "berkas" | "bayar", value: boolean) {
  const col = kind === "berkas" ? "berkas_verified" : "bayar_verified";
  await db
    .prepare(`UPDATE pendaftar SET ${col} = ?, updated_at = ? WHERE id = ?`)
    .bind(value ? 1 : 0, nowIso(), id)
    .run();
}

export async function setFlags(
  db: D1Database,
  id: string,
  flags: { editAllowed?: boolean; uploadAllowed?: boolean },
) {
  const sets: string[] = [];
  const vals: (number | string)[] = [];
  if (flags.editAllowed !== undefined) { sets.push("edit_allowed = ?"); vals.push(flags.editAllowed ? 1 : 0); }
  if (flags.uploadAllowed !== undefined) { sets.push("upload_allowed = ?"); vals.push(flags.uploadAllowed ? 1 : 0); }
  if (!sets.length) return;
  sets.push("updated_at = ?"); vals.push(nowIso());
  vals.push(id);
  await db.prepare(`UPDATE pendaftar SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
}

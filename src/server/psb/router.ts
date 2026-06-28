import { Hono } from "hono";
import { cookies } from "next/headers";
import { getEskahadeDB, getPsbBucket } from "@/lib/cf";
import {
  getSessionFromCookies,
  getSantriSessionFromCookies,
  createSantriSession,
  deleteSession,
  validateSantriSession,
  PSB_SESSION_COOKIE,
} from "@/lib/auth";
import {
  createPendaftar,
  upsertBerkas,
  getPendaftarById,
  getBerkas,
  updatePendaftar,
  findByLogin,
  listPendaftar,
  pendaftarStats,
  setVerify,
  setFlags,
} from "@/server/psb/eskahade";
import { getPsbSetting, putPsbSetting } from "@/server/psb/settings";
import { ALL_FIELDS, BERKAS_NAMES } from "@/lib/psb/fields";
import { fullSchema, loginSantriSchema } from "@/lib/psb/validation";
import { DEFAULT_CONTENT, CONTENT_KEY, type SiteContent } from "@/lib/psb/content";

// PSB sub-app. Mounted in the web Hono root at app.route("/psb", psbApp), so all
// paths resolve under /api/psb/*. Uses eskahade-web's Cloudflare bindings
// (getEskahadeDB for registrant data, getPsbBucket for uploads) and unified
// auth (admin sk_sess, santri psb_sess) instead of Pages-Functions c.env.
type PsbEnv = { Variables: { santriId: string } };

const psb = new Hono<PsbEnv>();

const WILAYAH_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";
const MEDIA_PREFIX = "/api/psb/media/";

function maxAge() {
  return 7 * 24 * 3600;
}

// ─── Guards ──────────────────────────────────────────────────────────────────
psb.use("/santri/*", async (c, next) => {
  const session = await getSantriSessionFromCookies();
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  c.set("santriId", session.subjectId);
  await next();
});

psb.use("/admin/*", async (c, next) => {
  const session = await getSessionFromCookies();
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  await next();
});

// ─── Auth ────────────────────────────────────────────────────────────────────
psb.post("/auth/santri", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = loginSantriSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "Data tidak lengkap" }, 400);

  const row = await findByLogin(getEskahadeDB(), parsed.data.noReg.trim(), parsed.data.tanggalLahir.trim());
  if (!row) return c.json({ error: "Nomor pendaftaran atau tanggal lahir salah" }, 401);

  const token = await createSantriSession(String(row.id));
  const jar = await cookies();
  jar.set({ name: PSB_SESSION_COOKIE, value: token, httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: maxAge() });
  return c.json({ ok: true });
});

psb.post("/auth/logout", async (c) => {
  const jar = await cookies();
  const token = jar.get(PSB_SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  jar.delete(PSB_SESSION_COOKIE);
  return c.json({ ok: true });
});

// ─── Public: pendaftaran ──────────────────────────────────────────────────────
psb.post("/pendaftaran", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const parsed = fullSchema().safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Validasi gagal", issues: parsed.error.flatten().fieldErrors }, 400);
  }

  const eskahade = getEskahadeDB();
  const { id, noReg, password } = await createPendaftar(eskahade, parsed.data);

  const berkas = (body.berkas ?? {}) as Record<string, string>;
  for (const jenis of BERKAS_NAMES) {
    const url = berkas[jenis];
    if (url) await upsertBerkas(eskahade, id, jenis, url);
  }
  return c.json({ id, noReg, password });
});

// ─── Public: site content ─────────────────────────────────────────────────────
psb.get("/content", async (c) => {
  const override = await getPsbSetting<Partial<SiteContent>>(CONTENT_KEY);
  return c.json({ ...DEFAULT_CONTENT, ...(override ?? {}) });
});

// ─── Media: upload + serve (PSB bucket) ───────────────────────────────────────
psb.post("/upload", async (c) => {
  const form = await c.req.formData();
  const file = form.get("file");
  const jenis = String(form.get("jenis") ?? "berkas");
  if (!(file instanceof File)) return c.json({ error: "Berkas tidak ditemukan" }, 400);
  if (jenis !== "berkas" && !BERKAS_NAMES.includes(jenis)) {
    return c.json({ error: "Jenis berkas tidak valid" }, 400);
  }
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const key = `uploads/${jenis}/${Date.now()}-${safe}`;
  await getPsbBucket().put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  return c.json({ name: file.name, url: `${MEDIA_PREFIX}${key}` });
});

psb.get("/media/*", async (c) => {
  const key = c.req.path.slice(c.req.path.indexOf(MEDIA_PREFIX) + MEDIA_PREFIX.length);
  if (!key) return c.notFound();
  const obj = await getPsbBucket().get(decodeURIComponent(key));
  if (!obj) return c.notFound();
  const headers = new Headers();
  headers.set("Content-Type", obj.httpMetadata?.contentType ?? "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(obj.body as unknown as BodyInit, { headers });
});

// ─── Wilayah proxy (Emsifa) ───────────────────────────────────────────────────
async function proxy(c: { json: (b: unknown, s?: number) => Response }, url: string) {
  try {
    const res = await fetch(url, { cf: { cacheTtl: 86400, cacheEverything: true } } as RequestInit);
    if (!res.ok) return c.json([], 200);
    return c.json(await res.json());
  } catch {
    return c.json([], 200);
  }
}
psb.get("/wilayah/provinsi", (c) => proxy(c, `${WILAYAH_BASE}/provinces.json`));
psb.get("/wilayah/kabupaten", (c) => {
  const id = c.req.query("provinsi");
  if (!id) return c.json([]);
  return proxy(c, `${WILAYAH_BASE}/regencies/${id}.json`);
});
psb.get("/wilayah/kecamatan", (c) => {
  const id = c.req.query("kabupaten");
  if (!id) return c.json([]);
  return proxy(c, `${WILAYAH_BASE}/districts/${id}.json`);
});
psb.get("/wilayah/desa", (c) => {
  const id = c.req.query("kecamatan");
  if (!id) return c.json([]);
  return proxy(c, `${WILAYAH_BASE}/villages/${id}.json`);
});

// ─── Santri (psb_sess) ────────────────────────────────────────────────────────
psb.get("/santri/me", async (c) => {
  const id = c.get("santriId");
  const row = await getPendaftarById(getEskahadeDB(), id);
  if (!row) return c.json({ error: "Data tidak ditemukan" }, 404);
  const berkas = await getBerkas(getEskahadeDB(), id);
  return c.json({
    santri: row,
    berkas,
    status: row.status,
    editAllowed: Number(row.edit_allowed) === 1,
    uploadAllowed: Number(row.upload_allowed) === 1,
  });
});

psb.patch("/santri/me", async (c) => {
  const id = c.get("santriId");
  const eskahade = getEskahadeDB();
  const row = await getPendaftarById(eskahade, id);
  if (!row) return c.json({ error: "Data tidak ditemukan" }, 404);
  if (Number(row.edit_allowed) !== 1) return c.json({ error: "Pengubahan data tidak diizinkan" }, 403);

  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const allowed = new Set(ALL_FIELDS.map((f) => f.name));
  const data: Record<string, unknown> = {};
  for (const k of Object.keys(body)) if (allowed.has(k)) data[k] = body[k];
  await updatePendaftar(eskahade, id, data);
  return c.json({ ok: true });
});

psb.post("/santri/me/upload", async (c) => {
  const id = c.get("santriId");
  const eskahade = getEskahadeDB();
  const row = await getPendaftarById(eskahade, id);
  if (!row) return c.json({ error: "Data tidak ditemukan" }, 404);
  if (Number(row.upload_allowed) !== 1) return c.json({ error: "Unggah ulang tidak diizinkan" }, 403);

  const form = await c.req.formData();
  const file = form.get("file");
  const jenis = String(form.get("jenis") ?? "");
  if (!(file instanceof File)) return c.json({ error: "Berkas tidak ditemukan" }, 400);
  if (!BERKAS_NAMES.includes(jenis)) return c.json({ error: "Jenis berkas tidak valid" }, 400);

  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const key = `uploads/${jenis}/${Date.now()}-${safe}`;
  await getPsbBucket().put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  const url = `${MEDIA_PREFIX}${key}`;
  await upsertBerkas(eskahade, id, jenis, url);
  return c.json({ jenis, url });
});

psb.get("/santri/me/cetak/:kind", async (c) => {
  const id = c.get("santriId");
  const kind = c.req.param("kind");
  if (!["bukti", "ortu", "santri"].includes(kind)) return c.json({ error: "Jenis tidak valid" }, 400);
  const row = await getPendaftarById(getEskahadeDB(), id);
  if (!row) return c.json({ error: "Data tidak ditemukan" }, 404);
  return c.json({ kind, santri: row });
});

// ─── Admin (sk_sess, shared with eskahade-web admin) ──────────────────────────
psb.get("/admin/pendaftar", async (c) => {
  const q = c.req.query("q") ?? undefined;
  const status = c.req.query("status") ?? undefined;
  const eskahade = getEskahadeDB();
  const [rows, stats] = await Promise.all([
    listPendaftar(eskahade, { q, status }),
    pendaftarStats(eskahade),
  ]);
  return c.json({ rows, stats });
});

psb.get("/admin/pendaftar/:id", async (c) => {
  const id = c.req.param("id");
  const eskahade = getEskahadeDB();
  const row = await getPendaftarById(eskahade, id);
  if (!row) return c.json({ error: "Tidak ditemukan" }, 404);
  const berkas = await getBerkas(eskahade, id);
  return c.json({ santri: row, berkas });
});

psb.patch("/admin/pendaftar/:id/verify", async (c) => {
  const id = c.req.param("id");
  const { kind, value } = (await c.req.json().catch(() => ({}))) as { kind?: string; value?: boolean };
  if (kind !== "berkas" && kind !== "bayar") return c.json({ error: "kind tidak valid" }, 400);
  await setVerify(getEskahadeDB(), id, kind, !!value);
  return c.json({ ok: true });
});

psb.patch("/admin/pendaftar/:id/flags", async (c) => {
  const id = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as { editAllowed?: boolean; uploadAllowed?: boolean };
  await setFlags(getEskahadeDB(), id, body);
  return c.json({ ok: true });
});

psb.get("/admin/settings", async (c) => {
  const content = (await getPsbSetting<SiteContent>(CONTENT_KEY)) ?? DEFAULT_CONTENT;
  return c.json({ [CONTENT_KEY]: content });
});

psb.put("/admin/settings", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  for (const [k, v] of Object.entries(body)) await putPsbSetting(k, v);
  return c.json({ ok: true });
});

export default psb;

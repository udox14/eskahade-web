import { Hono } from "hono";
import { handle } from "hono/vercel";
import { loginUser, deleteSession, getSessionFromCookies } from "@/lib/auth";
import { cookies } from "next/headers";
import { getBucket } from "@/lib/cf";
import { insertMedia } from "@/modules/media/repo";
import { deleteMedia, getMediaList } from "@/modules/media/repo";
import { db } from "@/lib/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";

import { upsertHero } from "@/modules/hero/repo";
import { getServices, upsertService, deleteService, updateServiceOrder } from "@/modules/services/repo";
import { getStats, upsertStat, deleteStat, updateStatOrder } from "@/modules/stats/repo";
import { getPrograms, upsertProgram, deleteProgram, updateProgramOrder } from "@/modules/programs/repo";
import { getEvents, upsertEvent, deleteEvent, updateEventOrder } from "@/modules/events/repo";
import { getTestimonials, upsertTestimonial, deleteTestimonial, updateTestimonialOrder } from "@/modules/testimonials/repo";
import { getNewsPosts, getNewsCategories, upsertNewsPost, deleteNewsPost, upsertNewsCategory, deleteNewsCategory } from "@/modules/news/repo";
import { getGalleryPhotos, getGalleryCategories, upsertGalleryPhoto, deleteGalleryPhoto, updateGalleryPhotoOrder, upsertGalleryCategory, deleteGalleryCategory } from "@/modules/gallery/repo";
import { getOrgMembers, upsertOrgMember, deleteOrgMember, updateOrgOrder } from "@/modules/org/repo";
import { getHistoryTimeline, getFacilities, upsertProfileHero, upsertSambutan, upsertVision, upsertHistoryItem, deleteHistoryItem, upsertMissionPoint, deleteMissionPoint, upsertFacility, deleteFacility } from "@/modules/profile/repo";
import { upsertSettings } from "@/modules/settings/repo";

// No `runtime = "edge"` — under @opennextjs/cloudflare the default Node.js
// runtime runs on workerd; forcing edge breaks module interop (undefined
// default exports) and crashes routes like /api/auth/login.

const app = new Hono().basePath("/api");

// ─── Auth ──────────────────────────────────────────────────────────────────
app.post("/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const token = await loginUser(email, password);
  if (!token) return c.json({ error: "Email atau password salah" }, 401);
  const jar = await cookies();
  jar.set({ name: "sk_sess", value: token, httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 7 * 24 * 3600 });
  return c.json({ ok: true });
});

app.post("/auth/logout", async (c) => {
  const jar = await cookies();
  const token = jar.get("sk_sess")?.value;
  if (token) await deleteSession(token);
  jar.delete("sk_sess");
  return c.json({ ok: true });
});

// ─── Auth middleware for /api/admin/* ──────────────────────────────────────
app.use("/admin/*", async (c, next) => {
  const session = await getSessionFromCookies();
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  await next();
});

// ─── Media upload ──────────────────────────────────────────────────────────
app.post("/admin/media/upload", async (c) => {
  const form = await c.req.formData();
  const file = form.get("file") as File | null;
  if (!file) return c.json({ error: "No file" }, 400);

  const key = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const bucket = getBucket();
  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });
  await insertMedia({
    key,
    filename: file.name,
    mime: file.type,
    size: file.size,
    alt: form.get("alt") as string ?? "",
    createdAt: new Date().toISOString(),
  });
  return c.json({ key, url: `/api/media/${encodeURIComponent(key)}` });
});

app.delete("/admin/media/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const [row] = await db().select().from(media).where(eq(media.id, id)).limit(1);
  if (row) { await getBucket().delete(row.key); await deleteMedia(id); }
  return c.json({ ok: true });
});

app.get("/admin/media", async (c) => {
  const list = await getMediaList(200);
  return c.json(list);
});

// ─── Hero ──────────────────────────────────────────────────────────────────
app.put("/admin/hero", async (c) => { await upsertHero(await c.req.json()); return c.json({ ok: true }); });

// ─── Services ──────────────────────────────────────────────────────────────
app.post("/admin/services", async (c) => { await upsertService(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/services/:id", async (c) => { await upsertService({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/services/:id", async (c) => { await deleteService(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/services/reorder", async (c) => { const { ids } = await c.req.json(); await updateServiceOrder(ids); return c.json({ ok: true }); });

// ─── Stats ──────────────────────────────────────────────────────────────────
app.post("/admin/stats", async (c) => { await upsertStat(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/stats/:id", async (c) => { await upsertStat({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/stats/:id", async (c) => { await deleteStat(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/stats/reorder", async (c) => { const { ids } = await c.req.json(); await updateStatOrder(ids); return c.json({ ok: true }); });

// ─── Programs ──────────────────────────────────────────────────────────────
app.post("/admin/programs", async (c) => { await upsertProgram(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/programs/:id", async (c) => { await upsertProgram({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/programs/:id", async (c) => { await deleteProgram(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/programs/reorder", async (c) => { const { ids } = await c.req.json(); await updateProgramOrder(ids); return c.json({ ok: true }); });

// ─── Events ────────────────────────────────────────────────────────────────
app.post("/admin/events", async (c) => { await upsertEvent(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/events/:id", async (c) => { await upsertEvent({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/events/:id", async (c) => { await deleteEvent(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/events/reorder", async (c) => { const { ids } = await c.req.json(); await updateEventOrder(ids); return c.json({ ok: true }); });

// ─── Testimonials ──────────────────────────────────────────────────────────
app.post("/admin/testimonials", async (c) => { await upsertTestimonial(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/testimonials/:id", async (c) => { await upsertTestimonial({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/testimonials/:id", async (c) => { await deleteTestimonial(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/testimonials/reorder", async (c) => { const { ids } = await c.req.json(); await updateTestimonialOrder(ids); return c.json({ ok: true }); });

// ─── News posts ────────────────────────────────────────────────────────────
app.post("/admin/news/posts", async (c) => { await upsertNewsPost(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/news/posts/:id", async (c) => { await upsertNewsPost({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/news/posts/:id", async (c) => { await deleteNewsPost(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/news/categories", async (c) => { await upsertNewsCategory(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/news/categories/:id", async (c) => { await upsertNewsCategory({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/news/categories/:id", async (c) => { await deleteNewsCategory(+c.req.param("id")); return c.json({ ok: true }); });

// ─── Gallery ───────────────────────────────────────────────────────────────
app.post("/admin/gallery/photos", async (c) => { await upsertGalleryPhoto(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/gallery/photos/:id", async (c) => { await upsertGalleryPhoto({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/gallery/photos/:id", async (c) => { await deleteGalleryPhoto(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/gallery/photos/reorder", async (c) => { const { ids } = await c.req.json(); await updateGalleryPhotoOrder(ids); return c.json({ ok: true }); });
app.post("/admin/gallery/categories", async (c) => { await upsertGalleryCategory(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/gallery/categories/:id", async (c) => { await upsertGalleryCategory({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/gallery/categories/:id", async (c) => { await deleteGalleryCategory(+c.req.param("id")); return c.json({ ok: true }); });

// ─── Org ───────────────────────────────────────────────────────────────────
app.post("/admin/org", async (c) => { await upsertOrgMember(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/org/:id", async (c) => { await upsertOrgMember({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/org/:id", async (c) => { await deleteOrgMember(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/org/reorder", async (c) => { const { ids } = await c.req.json(); await updateOrgOrder(ids); return c.json({ ok: true }); });

// ─── Profile ───────────────────────────────────────────────────────────────
app.put("/admin/profil/hero", async (c) => { await upsertProfileHero(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/profil/sambutan", async (c) => { await upsertSambutan(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/profil/vision", async (c) => { await upsertVision(await c.req.json()); return c.json({ ok: true }); });
app.post("/admin/profil/history", async (c) => { await upsertHistoryItem(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/profil/history/:id", async (c) => { await upsertHistoryItem({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/profil/history/:id", async (c) => { await deleteHistoryItem(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/profil/mission", async (c) => { await upsertMissionPoint(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/profil/mission/:id", async (c) => { await upsertMissionPoint({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/profil/mission/:id", async (c) => { await deleteMissionPoint(+c.req.param("id")); return c.json({ ok: true }); });
app.post("/admin/profil/facilities", async (c) => { await upsertFacility(await c.req.json()); return c.json({ ok: true }); });
app.put("/admin/profil/facilities/:id", async (c) => { await upsertFacility({ id: +c.req.param("id"), ...await c.req.json() }); return c.json({ ok: true }); });
app.delete("/admin/profil/facilities/:id", async (c) => { await deleteFacility(+c.req.param("id")); return c.json({ ok: true }); });

// ─── Settings ──────────────────────────────────────────────────────────────
app.put("/admin/settings", async (c) => { await upsertSettings(await c.req.json()); return c.json({ ok: true }); });

// ─── GET list endpoints (for client-side refresh after save) ───────────────
app.get("/admin/services", async (c) => { const list = await getServices(); return c.json(list); });
app.get("/admin/stats", async (c) => { const list = await getStats(); return c.json(list); });
app.get("/admin/programs", async (c) => { const list = await getPrograms(); return c.json(list); });
app.get("/admin/events", async (c) => { const list = await getEvents(); return c.json(list); });
app.get("/admin/testimonials", async (c) => { const list = await getTestimonials(); return c.json(list); });
app.get("/admin/org", async (c) => { const list = await getOrgMembers(); return c.json(list); });
app.get("/admin/news/posts", async (c) => { const rows = await getNewsPosts({ limit: 200 }); return c.json(rows.map(r => r.post)); });
app.get("/admin/news/categories", async (c) => { const list = await getNewsCategories(); return c.json(list); });
app.get("/admin/gallery/photos", async (c) => { const rows = await getGalleryPhotos(); return c.json(rows.map(r => r.photo)); });
app.get("/admin/gallery/categories", async (c) => { const list = await getGalleryCategories(); return c.json(list); });
app.get("/admin/profil/history", async (c) => { const list = await getHistoryTimeline(); return c.json(list); });
app.get("/admin/profil/facilities", async (c) => { const list = await getFacilities(); return c.json(list); });

// ─── Export ────────────────────────────────────────────────────────────────
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

import { getGalleryCategories, getGalleryPhotos } from "@/modules/gallery/repo";
import Link from "next/link";
import GaleriClient from "@/components/site/GaleriClient";

export const revalidate = 0;

export default async function GaleriPage() {
  const [categories, photosRaw] = await Promise.all([
    getGalleryCategories(),
    getGalleryPhotos(),
  ]);

  const cats = [{ id: 0, name: "Semua", slug: "semua" }, ...categories];
  const photos = photosRaw.map(r => ({
    id: r.photo.id,
    caption: r.photo.caption,
    imageKey: r.photo.imageKey,
    colSpan: r.photo.colSpan,
    rowSpan: r.photo.rowSpan,
    categorySlug: r.category?.slug ?? "semua",
    categoryName: r.category?.name ?? "",
  }));

  return (
    <>
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "44px var(--pad-x) 8px" }}>
        <div style={{ fontSize: 13, color: "var(--text-placeholder)", marginBottom: 14 }}>
          <Link href="/" style={{ color: "var(--green-mid)" }}>Beranda</Link>
          <span style={{ margin: "0 6px" }}>/</span> Galeri
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
          <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Dokumentasi
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 46, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: "0 0 12px", lineHeight: 1.08 }}>
          Galeri Keseharian Santri
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-dim)", maxWidth: 560, margin: 0, lineHeight: 1.7 }}>
          Momen-momen pembelajaran, ibadah, dan kebersamaan di lingkungan Pondok Pesantren Sukahideng.
        </p>
      </section>

      <GaleriClient categories={cats} photos={photos} />
    </>
  );
}

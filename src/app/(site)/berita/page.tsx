import { getNewsCategories, getNewsPosts, getFeaturedPost, countNewsPosts } from "@/modules/news/repo";
import Link from "next/link";
import Image from "next/image";
import BeritaFilter from "@/components/site/BeritaFilter";

export const revalidate = 0;

const PAGE_SIZE = 9;

interface SearchParams { cat?: string; page?: string }

export default async function BeritaPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const cat = sp.cat ?? "semua";
  const page = parseInt(sp.page ?? "1", 10);

  const [categories, postsRaw, featured, total] = await Promise.all([
    getNewsCategories(),
    getNewsPosts({ categorySlug: cat, page, publishedOnly: true }),
    getFeaturedPost(),
    countNewsPosts({ categorySlug: cat, publishedOnly: true }),
  ]);

  const posts = postsRaw.map(r => ({ ...r.post, category: r.category }));
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const cats = [{ id: 0, name: "Semua", slug: "semua" }, ...categories];

  return (
    <>
      {/* Header */}
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "44px var(--pad-x) 8px" }}>
        <div style={{ fontSize: 13, color: "var(--text-placeholder)", marginBottom: 14 }}>
          <Link href="/" style={{ color: "var(--green-mid)" }}>Beranda</Link> <span style={{ margin: "0 6px" }}>/</span> Berita
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-mid)", marginBottom: 12 }}>
          <span style={{ width: 22, height: "1.5px", background: "var(--gold)" }} /> Kabar Pesantren
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 46, letterSpacing: "-0.02em", color: "var(--green-deep)", margin: 0, maxWidth: 640, lineHeight: 1.08 }}>
          Berita &amp; Kegiatan
        </h1>
      </section>

      {/* Featured */}
      {featured && (
        <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "28px var(--pad-x)" }}>
          <Link href={`/berita/${featured.post.slug}`} className="featured-card">
            <div style={{ aspectRatio: "16/10", background: "linear-gradient(150deg,#8FAE85,#5F7E58)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
              {featured.post.coverKey
                ? <Image src={`/api/media/${featured.post.coverKey}`} alt={featured.post.title} fill style={{ objectFit: "cover" }} />
                : <i className="ph ph-image" style={{ fontSize: 40, color: "rgba(255,255,255,.55)" }} />}
              <span style={{ position: "absolute", top: 18, left: 18, background: "var(--gold)", color: "var(--gold-dark)", fontSize: "11.5px", fontWeight: 700, padding: "6px 13px", borderRadius: 99 }}>Sorotan Utama</span>
            </div>
            <div style={{ padding: 36, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 12, fontSize: "12.5px", color: "var(--text-placeholder)", fontWeight: 600, marginBottom: 14 }}>
                <span style={{ color: "var(--green)" }}>{featured.category?.name ?? "Berita"}</span>
                <span>·</span>
                <span>{featured.post.date}</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 30, lineHeight: 1.15, color: "var(--green-deep)", margin: "0 0 14px" }}>{featured.post.title}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)", margin: "0 0 20px" }}>{featured.post.excerpt}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--green)" }}>Baca selengkapnya <i className="ph ph-arrow-right" /></span>
            </div>
          </Link>
        </section>
      )}

      {/* Filter */}
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "8px var(--pad-x)" }}>
        <BeritaFilter categories={cats} activeCat={cat} />
      </section>

      {/* Grid */}
      <section style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "24px var(--pad-x) 40px" }}>
        <div className="news-grid">
          {posts.map(p => (
            <Link key={p.id} href={`/berita/${p.slug}`} className="news-card">
              <div style={{ aspectRatio: "16/10", background: "linear-gradient(150deg,#8FAE85,#5F7E58)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.coverKey
                  ? <Image src={`/api/media/${p.coverKey}`} alt={p.title} fill style={{ objectFit: "cover" }} />
                  : <i className="ph ph-image" style={{ fontSize: 28, color: "rgba(255,255,255,.5)" }} />}
                <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(31,58,39,.9)", color: "#E7EFE0", fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 99 }}>{p.category?.name ?? "Info"}</span>
              </div>
              <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                <span style={{ fontSize: 12, color: "var(--text-placeholder)", fontWeight: 500 }}>{p.date}</span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 18, lineHeight: 1.25, color: "var(--green-deep)", margin: 0 }}>{p.title}</h3>
                <p style={{ fontSize: "13.5px", lineHeight: 1.55, color: "var(--text-faint)", margin: "4px 0 0" }}>{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 44 }}>
            {page > 1 && <Link href={`/berita?cat=${cat}&page=${page - 1}`} className="page-btn"><i className="ph ph-caret-left" /></Link>}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <Link key={n} href={`/berita?cat=${cat}&page=${n}`} className={`page-btn${n === page ? " page-btn-active" : ""}`}>{n}</Link>
            ))}
            {page < totalPages && <Link href={`/berita?cat=${cat}&page=${page + 1}`} className="page-btn"><i className="ph ph-caret-right" /></Link>}
          </div>
        )}
      </section>

      <style>{`
        .featured-card { display: grid; grid-template-columns: 1.15fr 0.85fr; background: var(--card); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; }
        .news-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .news-card { display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; transition: transform .2s; }
        .news-card:hover { transform: translateY(-4px); }
        .page-btn { width: 42px; height: 42px; border-radius: 11px; border: 1px solid #D8D0BC; background: var(--card); color: var(--text-muted); cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .page-btn-active { border: none; background: var(--green); color: #F4F0E6; }
        @media (max-width: 900px) { .featured-card { grid-template-columns: 1fr; } .news-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

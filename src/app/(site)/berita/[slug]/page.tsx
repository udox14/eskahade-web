import { getNewsPostBySlug, getNewsPosts } from "@/modules/news/repo";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0;

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getNewsPostBySlug(slug);
  if (!result || !result.post.published) notFound();

  const { post, category } = result;

  // Related posts
  const relatedRaw = await getNewsPosts({ publishedOnly: true, limit: 3 });
  const related = relatedRaw
    .map(r => ({ ...r.post, category: r.category }))
    .filter(p => p.slug !== slug)
    .slice(0, 3);

  return (
    <article style={{ maxWidth: 860, margin: "0 auto", padding: "48px var(--pad-x) 64px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "var(--text-placeholder)", marginBottom: 20 }}>
        <Link href="/" style={{ color: "var(--green-mid)" }}>Beranda</Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <Link href="/berita" style={{ color: "var(--green-mid)" }}>Berita</Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <span>{post.title}</span>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 12, fontSize: "12.5px", fontWeight: 600, marginBottom: 16 }}>
        <span style={{ background: "var(--green-soft)", color: "var(--green-accent)", padding: "5px 12px", borderRadius: 99 }}>{category?.name ?? "Berita"}</span>
        <span style={{ color: "var(--text-placeholder)", display: "flex", alignItems: "center" }}>{post.date}</span>
      </div>

      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 42, lineHeight: 1.1, color: "var(--green-deep)", margin: "0 0 24px", letterSpacing: "-0.02em" }}>
        {post.title}
      </h1>

      {/* Cover */}
      {post.coverKey && (
        <div style={{ aspectRatio: "16/9", borderRadius: 20, overflow: "hidden", marginBottom: 36, position: "relative" }}>
          <Image src={`/api/media/${post.coverKey}`} alt={post.title} fill style={{ objectFit: "cover" }} />
        </div>
      )}

      {/* Body */}
      <div
        className="news-body"
        dangerouslySetInnerHTML={{ __html: post.body || `<p style="color:var(--text-muted)">${post.excerpt}</p>` }}
      />

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: 64, borderTop: "1px solid var(--border)", paddingTop: 40 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 26, color: "var(--green-deep)", margin: "0 0 24px" }}>Berita Lainnya</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {related.map(p => (
              <Link key={p.id} href={`/berita/${p.slug}`} style={{ display: "flex", flexDirection: "column", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", transition: "transform .2s" }}
                    className="related-card">
                <div style={{ aspectRatio: "16/10", background: "linear-gradient(150deg,#8FAE85,#5F7E58)", position: "relative" }}>
                  {p.coverKey && <Image src={`/api/media/${p.coverKey}`} alt={p.title} fill style={{ objectFit: "cover" }} />}
                </div>
                <div style={{ padding: "14px 16px 18px" }}>
                  <div style={{ fontSize: 11, color: "var(--text-placeholder)", marginBottom: 6 }}>{p.date}</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15, lineHeight: 1.3, color: "var(--green-deep)" }}>{p.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .news-body { font-size: 17px; line-height: 1.8; color: var(--text-muted); }
        .news-body h1,.news-body h2,.news-body h3 { font-family: var(--font-heading); color: var(--green-deep); margin: 1.5em 0 0.5em; }
        .news-body p { margin: 0 0 1.2em; }
        .news-body a { color: var(--green); text-decoration: underline; }
        .news-body img { max-width: 100%; border-radius: 12px; margin: 1em 0; }
        .news-body blockquote { border-left: 4px solid var(--gold); padding: 12px 20px; margin: 1.5em 0; background: var(--card); border-radius: 0 12px 12px 0; }
        .related-card:hover { transform: translateY(-3px); }
      `}</style>
    </article>
  );
}

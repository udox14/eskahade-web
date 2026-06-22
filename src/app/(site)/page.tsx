import { getAllSettings } from "@/modules/settings/repo";
import { getHero } from "@/modules/hero/repo";
import { getServices } from "@/modules/services/repo";
import { getStats } from "@/modules/stats/repo";
import { getPrograms } from "@/modules/programs/repo";
import { getNewsPosts } from "@/modules/news/repo";
import { getEvents } from "@/modules/events/repo";
import { getGalleryPhotos } from "@/modules/gallery/repo";
import { getTestimonials } from "@/modules/testimonials/repo";
import { getOrgMembers } from "@/modules/org/repo";
import HeroSection from "@/components/site/HeroSection";
import ServicesSection from "@/components/site/ServicesSection";
import StatsSection from "@/components/site/StatsSection";
import ProgramsSection from "@/components/site/ProgramsSection";
import BeritaPreview from "@/components/site/BeritaPreview";
import AgendaSection from "@/components/site/AgendaSection";
import GalleryPreview from "@/components/site/GalleryPreview";
import TestimoniSection from "@/components/site/TestimoniSection";
import StrukturSection from "@/components/site/StrukturSection";
import KontakSection from "@/components/site/KontakSection";

export const revalidate = 0;

export default async function BerandaPage() {
  const [
    settings, hero, services, stats, programs, newsResult, events, galleryResult, testimonials, orgMembers,
  ] = await Promise.all([
    getAllSettings(),
    getHero(),
    getServices(),
    getStats(),
    getPrograms(),
    getNewsPosts({ publishedOnly: true, limit: 3 }),
    getEvents(),
    getGalleryPhotos(undefined, 6),
    getTestimonials(),
    getOrgMembers(),
  ]);

  const news = newsResult.map(r => ({ ...r.post, category: r.category }));
  const galleryPhotos = galleryResult.map(r => ({ ...r.photo, category: r.category }));
  const pimpinan = orgMembers.find(m => m.level === "pimpinan") ?? null;
  const struktur = orgMembers.filter(m => m.level === "bawah").slice(0, 4);

  return (
    <>
      <HeroSection hero={hero} settings={settings} />
      <ServicesSection services={services} />
      <StatsSection stats={stats} />
      <ProgramsSection programs={programs} />
      <BeritaPreview posts={news} />
      <AgendaSection events={events} settings={settings} />
      <GalleryPreview photos={galleryPhotos} />
      <TestimoniSection testimonials={testimonials} />
      <StrukturSection pimpinan={pimpinan} struktur={struktur} />
      <KontakSection settings={settings} />
    </>
  );
}

import { Footer } from "@/components/psb/site/Footer";

// Marketing/info pages (landing, panduan, persyaratan, biaya, agenda) get the
// Footer. Flow pages (pendaftaran, selesai, login, santri) live outside this
// group and render Navbar-only, per the original handoff.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

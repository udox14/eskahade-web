import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, Amiri } from "next/font/google";
import "../globals.css";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { getAllSettings } from "@/modules/settings/repo";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--loaded-plus-jakarta",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--loaded-bricolage",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--loaded-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pondok Pesantren Sukahideng",
  description: "Lembaga Pendidikan Pondok Pesantren Sukahideng — Tasikmalaya. Menempa Generasi Berilmu & Berakhlak Mulia.",
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getAllSettings();
  return (
    <html lang="id" className={`${plusJakarta.variable} ${bricolage.variable} ${amiri.variable}`}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" />
      </head>
      <body>
        <SiteHeader settings={settings} />
        <main>{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}

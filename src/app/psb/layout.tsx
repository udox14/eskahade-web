import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./psb-theme.css";
import { Navbar } from "@/components/psb/site/Navbar";
import { Toaster } from "@/components/psb/ui/sonner";

// Top-level layout for the PSB section (/psb). Declares its own <html>/<body>
// so the Tailwind theme (psb-theme.css) is scoped to these routes only — the
// rest of eskahade-web never loads it. Navbar shows on every PSB page; the
// Footer is added by the (marketing) sub-layout.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PSB Pondok Pesantren Sukahideng · 2026/2027",
  description:
    "Penerimaan Santri Baru Pondok Pesantren Sukahideng, Tasikmalaya. Pendaftaran online Tahun Pelajaran 2026/2027.",
};

export default function PsbLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

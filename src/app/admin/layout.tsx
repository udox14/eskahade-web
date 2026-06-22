import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "@/app/globals.css";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--loaded-plus-jakarta", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--loaded-bricolage", display: "swap" });

interface Props { children: React.ReactNode }

// Shell layout for everything under /admin — no auth guard here so /admin/login
// can render. The (panel) route group nested below adds the session guard + chrome.
export default function AdminLayout({ children }: Props) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${bricolage.variable}`}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" />
      </head>
      <body style={{ margin: 0, background: "#F1F5F0", fontFamily: "var(--font-body)" }}>
        {children}
      </body>
    </html>
  );
}

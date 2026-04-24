import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, EB_Garamond, Inter } from "next/font/google";
import { buildMetadata, SITE_TITLE } from "@/lib/seo/metadata";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: SITE_TITLE,
  description:
    "Интерактивный атлас библейских путешествий — пергаментная карта Восточного Средиземноморья.",
  path: "/",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e8dcc4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${ebGaramond.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

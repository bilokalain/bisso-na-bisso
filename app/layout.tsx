import type { Metadata, Viewport } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "Bisso na Bisso — petites annonces de la diaspora",
    template: "%s — Bisso na Bisso",
  },
  description:
    "Prestataires événementiel, co-transport de colis, profs particuliers. Entre nous, pour nous.",
  applicationName: "Bisso na Bisso",
  appleWebApp: {
    capable: true,
    title: "Bisso",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: "Bisso na Bisso",
    title: "Bisso na Bisso — petites annonces de la diaspora",
    description:
      "Prestataires événementiel, co-transport de colis, profs particuliers. Entre nous, pour nous.",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1D2E5E" },
    { media: "(prefers-color-scheme: dark)", color: "#1D2E5E" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

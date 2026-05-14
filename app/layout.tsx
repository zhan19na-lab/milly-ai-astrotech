import type { Metadata, Viewport } from "next";
import "./globals.css";

// ── PWA & SEO Metadata ─────────────────────────────────────────
export const metadata: Metadata = {
  // Core identity
  title: {
    default: "Milly — AI AstroTech Assistant",
    template: "%s | Milly",
  },
  description:
    "Milly — ваш AI-ассистент в мире AstroTech и автоматизации. Космический интеллект в кармане.",

  // PWA manifest link (Next.js injects <link rel="manifest"> automatically)
  manifest: "/manifest.json",

  // iOS home-screen meta
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Milly",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Milly AI",
    title: "Milly — AI AstroTech Assistant",
    description: "Ваш AI-ассистент в мире AstroTech и автоматизации.",
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    title: "Milly — AI AstroTech Assistant",
    description: "Ваш AI-ассистент в мире AstroTech и автоматизации.",
  },

  // Prevent search-engine indexing until production is ready
  robots: { index: false, follow: false },

  // Icons (referenced in head)
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

// ── Viewport — native-app feel on mobile ──────────────────────
// user-scalable=no prevents accidental pinch-zoom on touch targets
// viewport-fit=cover lets content bleed under iOS safe-area notch
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#6D28D9",
};

// ── Root Layout ────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      {/*
        Next.js App Router auto-injects:
          <meta name="viewport" ...>  — from the viewport export above
          <link rel="manifest" ...>  — from metadata.manifest
          <meta name="theme-color">  — from viewport.themeColor
        No manual <head> tags needed for those.
      */}
      <head>
        {/* iOS splash / status-bar hints */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Prevent Windows phone from highlighting phone numbers */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Barlow, Michroma } from "next/font/google";
import { MobileStickyBar } from "@/components/sections/MobileStickyBar";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { SkipLink } from "@/components/ui/SkipLink";
import { business } from "@/config/business";
import { seo } from "@/config/seo";
import { getSiteUrl } from "@/lib/site-url";
import "@/styles/globals.css";

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
  preload: true,
});

const barlow = Barlow({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
  preload: true,
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.titleDefault,
    template: seo.titleTemplate,
  },
  description: seo.description,
  applicationName: business.name,
  authors: [{ name: business.name }],
  creator: business.name,
  publisher: business.name,
  keywords: [...seo.keywords],
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: business.name,
    title: seo.ogTitle,
    description: seo.ogDescription,
    images: [
      {
        url: "/brand/hero.jpg",
        width: 1600,
        height: 900,
        alt: "Doorstep appliance service — washing machine, refrigerator and dishwasher",
      },
      {
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: business.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.ogTitle,
    description: seo.ogDescription,
    images: ["/brand/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  category: "home services",
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Avadi, Chennai",
  },
};

export const viewport: Viewport = {
  themeColor: "#EAF6E8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${michroma.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SkipLink />
        <JsonLd />
        <SiteHeader />
        <main
          id="main"
          className="flex-1 overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0"
          tabIndex={-1}
        >
          {children}
        </main>
        <SiteFooter />
        <MobileStickyBar />
        <Analytics />
      </body>
    </html>
  );
}

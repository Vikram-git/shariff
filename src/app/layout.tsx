import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Barlow, Michroma } from "next/font/google";
import { MobileStickyBar } from "@/components/sections/MobileStickyBar";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { SkipLink } from "@/components/ui/SkipLink";
import { business } from "@/config/business";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const description = `${business.taglines.hero} Doorstep appliance repair in ${business.serviceAreas.join(", ")}. Visiting charge Rs ${business.visitingChargeInr}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} · Doorstep repair in Avadi, Chennai`,
    template: `%s · ${business.shortName}`,
  },
  description,
  applicationName: business.name,
  authors: [{ name: business.name }],
  creator: business.name,
  keywords: [
    "appliance repair Avadi",
    "washing machine repair Chennai",
    "refrigerator service Ambattur",
    "dishwasher repair",
    "doorstep appliance service",
    ...business.serviceAreas.map((a) => `appliance repair ${a}`),
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: business.name,
    title: business.name,
    description: business.taglines.hero,
    images: [
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
    title: business.name,
    description: business.taglines.hero,
    images: ["/brand/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  category: "home services",
};

export const viewport: Viewport = {
  themeColor: "#0A0E0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${michroma.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SkipLink />
        <JsonLd />
        <SiteHeader />
        <main
          id="main"
          className="flex-1 overflow-x-hidden pb-[calc(4.75rem+env(safe-area-inset-bottom))] sm:pb-0"
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

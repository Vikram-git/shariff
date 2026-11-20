import type { Metadata } from "next";
import { Areas } from "@/components/sections/Areas";
import { Booking } from "@/components/sections/Booking";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Price } from "@/components/sections/Price";
import { Reviews } from "@/components/sections/Reviews";
import { SeoIntro } from "@/components/sections/SeoIntro";
import { Services } from "@/components/sections/Services";
import { SymptomPicker } from "@/components/sections/SymptomPicker";
import { seo } from "@/config/seo";

export const metadata: Metadata = {
  title: { absolute: seo.titleDefault },
  description: seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: seo.ogTitle,
    description: seo.ogDescription,
    url: "/",
  },
};

/** Home — appliance service landing for Avadi / Chennai searches. */
export default function Home() {
  return (
    <>
      <Hero />
      <SeoIntro />
      <Services />
      <SymptomPicker />
      <Price />
      <HowItWorks />
      <Areas />
      <Reviews />
      <Booking />
      <Faq />
    </>
  );
}

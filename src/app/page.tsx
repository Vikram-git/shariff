import { Areas } from "@/components/sections/Areas";
import { Booking } from "@/components/sections/Booking";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Price } from "@/components/sections/Price";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { SymptomPicker } from "@/components/sections/SymptomPicker";

/** Home — hero, services, booking, FAQ. */
export default function Home() {
  return (
    <>
      <Hero />
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

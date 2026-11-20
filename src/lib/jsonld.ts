import { business } from "@/config/business";

export function localBusinessJsonLd(siteUrl: string) {
  const url = siteUrl.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}/#business`,
    name: business.name,
    description: business.taglines.hero,
    url,
    telephone: business.phone.tel,
    image: `${url}/brand/og.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.line1,
      addressLocality: "Avadi",
      addressRegion: "Tamil Nadu",
      postalCode: business.address.pincode,
      addressCountry: "IN",
    },
    areaServed: business.serviceAreas.map((name) => ({
      "@type": "City",
      name,
    })),
    makesOffer: business.services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `${service.name} repair`,
        description: `Doorstep ${service.name.toLowerCase()} service in ${business.serviceAreas.join(", ")}.`,
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        price: business.visitingChargeInr,
        priceCurrency: "INR",
        description: "Visiting charge. Labour is extra, based on the repair.",
      },
    })),
  };
}

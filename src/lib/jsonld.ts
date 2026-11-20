import { business } from "@/config/business";
import { seo } from "@/config/seo";

export function localBusinessJsonLd(siteUrl: string) {
  const url = siteUrl.replace(/\/$/, "");

  return {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${url}/#business`,
    name: business.name,
    alternateName: ["Shariff Appliance Service", "Shariff Appliances"],
    description: seo.description,
    url,
    telephone: business.phone.tel,
    image: [`${url}/brand/hero.jpg`, `${url}/brand/og.png`],
    logo: `${url}/brand/emblem-header.png`,
    priceRange: `Rs ${business.visitingChargeInr}+`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${business.address.line1}, ${business.address.line2}`,
      addressLocality: "Avadi",
      addressRegion: "Tamil Nadu",
      postalCode: business.address.pincode,
      addressCountry: "IN",
    },
    areaServed: business.serviceAreas.map((name) => ({
      "@type": "City",
      name: `${name}, Chennai`,
    })),
    knowsAbout: [
      "Appliance service",
      "Washing machine repair",
      "Refrigerator repair",
      "Dishwasher repair",
      "Doorstep appliance service",
    ],
    makesOffer: business.services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `${service.name} repair and service`,
        serviceType: "Doorstep appliance repair",
        areaServed: business.serviceAreas.map((a) => `${a}, Chennai`),
        description: `Doorstep ${service.name.toLowerCase()} service in Avadi, Ambattur and nearby Chennai.`,
        provider: { "@id": `${url}/#business` },
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        price: business.visitingChargeInr,
        priceCurrency: "INR",
        description: "Visiting charge. Labour is extra, based on the repair.",
      },
    })),
    sameAs: [`https://wa.me/${business.phone.e164}`],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.phone.tel,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en"],
    },
  };
}

export function websiteJsonLd(siteUrl: string) {
  const url = siteUrl.replace(/\/$/, "");
  return {
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: business.name,
    description: seo.description,
    publisher: { "@id": `${url}/#business` },
    inLanguage: "en-IN",
  };
}

export function faqPageJsonLd(siteUrl: string) {
  const url = siteUrl.replace(/\/$/, "");
  return {
    "@type": "FAQPage",
    "@id": `${url}/#faq`,
    mainEntity: business.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function breadcrumbJsonLd(siteUrl: string) {
  const url = siteUrl.replace(/\/$/, "");
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Appliance service",
        item: `${url}/#services`,
      },
    ],
  };
}

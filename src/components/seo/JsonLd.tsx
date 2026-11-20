import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  localBusinessJsonLd,
  websiteJsonLd,
} from "@/lib/jsonld";
import { getSiteUrl } from "@/lib/site-url";

export function JsonLd() {
  const siteUrl = getSiteUrl();
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      localBusinessJsonLd(siteUrl),
      websiteJsonLd(siteUrl),
      faqPageJsonLd(siteUrl),
      breadcrumbJsonLd(siteUrl),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

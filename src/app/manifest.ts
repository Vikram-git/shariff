import type { MetadataRoute } from "next";
import { business } from "@/config/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: business.shortName,
    description: business.taglines.hero,
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E0F",
    theme_color: "#0A0E0F",
    lang: "en",
    icons: [
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

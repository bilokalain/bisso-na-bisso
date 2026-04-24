import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bisso na Bisso",
    short_name: "Bisso",
    description:
      "Petites annonces de la diaspora — événementiel, colis, répétiteurs.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF7F0",
    theme_color: "#1D2E5E",
    categories: ["lifestyle", "shopping", "education"],
    lang: "fr",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

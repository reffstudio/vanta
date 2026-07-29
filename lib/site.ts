export const siteConfig = {
  name: "VANTA by Nery Tovar",
  title: "VANTA by Nery Tovar — Fotografía & Dirección Visual",
  titleTemplate: "%s | VANTA by Nery Tovar",
  description:
    "Estudio de fotografía profesional y dirección visual en Ensenada, Baja California. Especializados en sesiones personalizadas, retratos, eventos sociales y fotografía familiar.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es_MX",
  language: "es",
  creator: "Nery Tovar",
  keywords: [
    "fotografia ensenada",
    "fotografo ensenada baja california",
    "sesiones fotograficas ensenada",
    "fotografia de eventos ensenada",
    "vanta nery tovar",
  ],
  location: {
    city: "Ensenada",
    region: "Baja California",
    country: "MX",
    countryName: "México",
  },
  ogImage: {
    path: "/android-chrome-512x512.png",
    width: 512,
    height: 512,
    alt: "VANTA by Nery Tovar — Fotografía & Dirección Visual",
  },
  services: [
    "Sesiones personalizadas",
    "Retratos",
    "Eventos sociales",
    "Fotografía familiar",
    "Dirección visual",
  ],
} as const

export function absoluteUrl(path = "") {
  return new URL(path, siteConfig.url).toString()
}

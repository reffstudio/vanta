export const siteConfig = {
  name: "VANTA",
  title: "VANTA — Fotografía y Video por Nery Tovar",
  description:
    "Portafolio de fotografía y video de Nery Tovar. Conciertos, retratos, parejas, familia y producción audiovisual con un estilo cinematográfico e interactivo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es_MX",
  language: "es",
  creator: "Nery Tovar",
  keywords: [
    "fotografía",
    "video",
    "portafolio",
    "Nery Tovar",
    "VANTA",
    "conciertos",
    "eventos",
    "retratos",
    "pareja",
    "familia",
    "producción audiovisual",
    "México",
  ],
  ogImage: {
    path: "/android-chrome-512x512.png",
    width: 512,
    height: 512,
    alt: "VANTA — Fotografía y Video por Nery Tovar",
  },
  services: [
    "Conciertos / Eventos Masivos",
    "Sesión Personal",
    "Pareja / Familia",
    "Video & Producción",
  ],
} as const

export function absoluteUrl(path = "") {
  return new URL(path, siteConfig.url).toString()
}

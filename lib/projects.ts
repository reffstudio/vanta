export type ProjectMedia =
  | {
      _key: string
      type: "image"
      url: string
      alt?: string
      caption?: string
    }
  | {
      _key: string
      type: "video"
      url: string
      caption?: string
    }

export type Project = {
  id: string
  title: string
  category: string
  tags: string[]
  date: string
  image: string
  description: string
  gallery: ProjectMedia[]
}

export const projects: Project[] = [
  {
    id: "concert-series",
    title: "Neon Pulse",
    category: "Conciertos / Eventos Masivos",
    tags: ["concierto", "evento"],
    date: "Marzo 2026",
    image: "/projects/concert.png",
    description:
      "Una serie de conciertos capturada bajo luces intensas y humo escénico. Cada cuadro busca traducir la energía cruda del público y la conexión entre el artista y la multitud.",
    gallery: [
      { _key: "1", type: "image", url: "/projects/concert.png" },
      { _key: "2", type: "image", url: "/projects/transit.png" },
      { _key: "3", type: "image", url: "/projects/shadow.png" },
    ],
  },
  {
    id: "portrait-session",
    title: "Quiet Light",
    category: "Sesión Personal",
    tags: ["retrato"],
    date: "Enero 2026",
    image: "/projects/portrait.png",
    description:
      "Retrato editorial con luz natural y una paleta minimalista. La sesión explora la calma y la presencia a través de composiciones limpias y honestas.",
    gallery: [
      { _key: "1", type: "image", url: "/projects/portrait.png" },
      { _key: "2", type: "image", url: "/projects/shadow.png" },
      { _key: "3", type: "image", url: "/projects/couple.png" },
    ],
  },
  {
    id: "desert-expedition",
    title: "Golden Route",
    category: "Otro",
    tags: ["paisaje"],
    date: "Noviembre 2025",
    image: "/projects/desert.png",
    description:
      "Expedición fotográfica a través de dunas infinitas al atardecer. Un ensayo visual sobre el aislamiento, el movimiento y la escala del paisaje.",
    gallery: [
      { _key: "1", type: "image", url: "/projects/desert.png" },
      { _key: "2", type: "image", url: "/projects/coastal.png" },
      { _key: "3", type: "image", url: "/projects/drone.png" },
    ],
  },
  {
    id: "urban-transit",
    title: "Line One",
    category: "Otro",
    tags: ["urbano"],
    date: "Septiembre 2025",
    image: "/projects/transit.png",
    description:
      "Fotografía documental del transporte urbano. Texturas de metal envejecido y luz cambiante que retratan el pulso constante de la ciudad.",
    gallery: [
      { _key: "1", type: "image", url: "/projects/transit.png" },
      { _key: "2", type: "image", url: "/projects/concert.png" },
      { _key: "3", type: "image", url: "/projects/coastal.png" },
    ],
  },
  {
    id: "coastal-architecture",
    title: "Tide House",
    category: "Otro",
    tags: ["arquitectura"],
    date: "Julio 2025",
    image: "/projects/coastal.png",
    description:
      "Estudio arquitectónico de una estructura contemporánea frente al mar. Geometría, luz y agua en un diálogo sereno.",
    gallery: [
      { _key: "1", type: "image", url: "/projects/coastal.png" },
      { _key: "2", type: "image", url: "/projects/desert.png" },
      { _key: "3", type: "image", url: "/projects/portrait.png" },
    ],
  },
  {
    id: "aerial-tech",
    title: "Above",
    category: "Otro",
    tags: ["drone"],
    date: "Mayo 2025",
    image: "/projects/drone.png",
    description:
      "Detrás de escena de nuestro flujo de trabajo aéreo. El control preciso del equipo que hace posible cada toma cinematográfica.",
    gallery: [
      { _key: "1", type: "image", url: "/projects/drone.png" },
      { _key: "2", type: "image", url: "/projects/desert.png" },
      { _key: "3", type: "image", url: "/projects/transit.png" },
    ],
  },
  {
    id: "fine-art-shadow",
    title: "Reach",
    category: "Sesión Personal",
    tags: ["arte"],
    date: "Marzo 2025",
    image: "/projects/shadow.png",
    description:
      "Fotografía de arte fino jugando con luz dura y sombras alargadas sobre superficies cálidas. Un ejercicio de forma y contraste.",
    gallery: [
      { _key: "1", type: "image", url: "/projects/shadow.png" },
      { _key: "2", type: "image", url: "/projects/portrait.png" },
      { _key: "3", type: "image", url: "/projects/concert.png" },
    ],
  },
  {
    id: "couple-story",
    title: "Us, Golden",
    category: "Pareja / Familia",
    tags: ["pareja"],
    date: "Febrero 2025",
    image: "/projects/couple.png",
    description:
      "Historia de pareja capturada a contraluz durante la hora dorada. Momentos espontáneos, risas reales y una atmósfera cálida.",
    gallery: [
      { _key: "1", type: "image", url: "/projects/couple.png" },
      { _key: "2", type: "image", url: "/projects/portrait.png" },
      { _key: "3", type: "image", url: "/projects/coastal.png" },
    ],
  },
]

export const services = [
  "Conciertos / Eventos Masivos",
  "Sesión Personal",
  "Pareja / Familia",
  "Otro",
] as const

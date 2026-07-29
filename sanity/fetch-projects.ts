import { client } from "@/sanity/client"
import { PROJECTS_QUERY, PROJECT_BY_SLUG_QUERY } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import type { Project, ProjectMedia } from "@/lib/projects"
import { projects as fallbackProjects } from "@/lib/projects"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

type SanityImage = SanityImageSource & {
  alt?: string
}

type SanityGalleryItem = {
  _key: string
  _type?: string
  mediaType?: "image" | "video"
  caption?: string
  alt?: string
  asset?: { _id?: string; url?: string }
  image?: SanityImage
  video?: {
    asset?: { url?: string; mimeType?: string }
  }
}

type SanityProject = {
  _id: string
  title: string
  slug: string
  date: string
  description: string
  tags?: string[]
  category?: string
  categoryTitle?: string
  mainImage?: SanityImage
  coverImage?: SanityImage
  gallery?: SanityGalleryItem[]
}

function sanityImageUrl(image?: SanityImage | null, width?: number) {
  if (!image?.asset) return null
  const builder = urlFor(image)
  return width ? builder.width(width).height(width).fit("crop").url() : builder.url()
}

function mapGalleryItem(item: SanityGalleryItem): ProjectMedia | null {
  if (item.mediaType === "video" && item.video?.asset?.url) {
    return {
      _key: item._key,
      type: "video",
      url: item.video.asset.url,
      caption: item.caption,
    }
  }

  const imageSource = item.image ?? (item._type === "image" ? item : null)
  const imageUrl = sanityImageUrl(imageSource, 1600)

  if (imageUrl) {
    return {
      _key: item._key,
      type: "image",
      url: imageUrl,
      alt: item.image?.alt ?? item.alt,
      caption: item.caption,
    }
  }

  return null
}

function mapSanityProject(project: SanityProject): Project {
  const cardImage =
    sanityImageUrl(project.mainImage, 1200) ??
    sanityImageUrl(project.coverImage, 1200) ??
    "/placeholder.svg"

  const gallery =
    project.gallery
      ?.map(mapGalleryItem)
      .filter((item): item is ProjectMedia => item !== null) ?? []

  const category =
    typeof project.category === "string"
      ? project.category
      : project.categoryTitle ?? "Otro"

  return {
    id: project.slug || project._id,
    title: project.title,
    category,
    tags: project.tags ?? [],
    date: project.date,
    image: cardImage,
    description: project.description,
    gallery,
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const data = await client.fetch<SanityProject[]>(PROJECTS_QUERY)
    if (!data?.length) return fallbackProjects
    return data.map(mapSanityProject)
  } catch {
    return fallbackProjects
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const data = await client.fetch<SanityProject | null>(PROJECT_BY_SLUG_QUERY, { slug })
    if (!data) return null
    return mapSanityProject(data)
  } catch {
    return null
  }
}

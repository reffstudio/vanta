import { defineQuery } from "next-sanity"

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    date,
    description,
    tags,
    category,
    "categoryTitle": category->title,
    mainImage {
      asset->{ _id, url },
      alt,
      hotspot,
      crop
    },
    coverImage {
      asset->{ _id, url },
      alt,
      hotspot,
      crop
    },
    gallery[] {
      _key,
      _type,
      mediaType,
      caption,
      asset->{ _id, url },
      alt,
      hotspot,
      crop,
      image {
        asset->{ _id, url },
        alt,
        hotspot,
        crop
      },
      video {
        asset->{ _id, url, mimeType }
      }
    }
  }
`)

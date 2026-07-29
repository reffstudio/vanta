import { client } from "@/sanity/client"
import { PROJECT_SLUGS_QUERY } from "@/sanity/queries"

type ProjectSlug = {
  slug: string
  _updatedAt: string
}

export async function getProjectSlugs(): Promise<ProjectSlug[]> {
  try {
    return await client.fetch<ProjectSlug[]>(PROJECT_SLUGS_QUERY)
  } catch {
    return []
  }
}

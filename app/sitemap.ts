import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"
import { getProjectSlugs } from "@/sanity/fetch-slugs"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectSlugs()

  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((project) => project.slug)
    .map((project) => ({
      url: `${siteConfig.url}/proyectos/${project.slug}`,
      lastModified: new Date(project._updatedAt),
      changeFrequency: "monthly",
      priority: 0.8,
    }))

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectEntries,
  ]
}

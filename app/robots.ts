import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production"

  return {
    rules: isProduction
      ? {
          userAgent: "*",
          allow: "/",
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}

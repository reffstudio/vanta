import { siteConfig } from "@/lib/site"

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#business`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        image: `${siteConfig.url}${siteConfig.ogImage.path}`,
        founder: {
          "@type": "Person",
          name: siteConfig.creator,
        },
        knowsAbout: siteConfig.services,
        inLanguage: siteConfig.language,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

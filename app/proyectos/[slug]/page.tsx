import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProjectBySlug } from "@/sanity/fetch-projects"
import { getProjectSlugs } from "@/sanity/fetch-slugs"
import { siteConfig, absoluteUrl } from "@/lib/site"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getProjectSlugs()
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return { title: "Proyecto no encontrado" }
  }

  const description =
    project.description ||
    `${project.title} — ${project.category}. Portafolio de ${siteConfig.name} en Ensenada, Baja California.`

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `/proyectos/${slug}`,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: `/proyectos/${slug}`,
      siteName: siteConfig.name,
      title: project.title,
      description,
      images: project.image
        ? [{ url: project.image, alt: project.title }]
        : [{ url: siteConfig.ogImage.path, alt: siteConfig.ogImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: [project.image || siteConfig.ogImage.path],
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: absoluteUrl(`/proyectos/${slug}`),
    image: project.image,
    creator: {
      "@type": "Person",
      name: siteConfig.creator,
    },
    inLanguage: siteConfig.language,
  }

  return (
    <main className="min-h-dvh bg-black px-6 py-16 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium uppercase tracking-wide text-brand transition hover:text-brand/80"
        >
          ← Volver al portafolio
        </Link>

        <p className="mt-8 text-xs font-medium uppercase tracking-wide text-brand">
          {project.category}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{project.title}</h1>
        <p className="mt-2 text-sm text-neutral-400">{project.date}</p>

        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="mt-8 w-full rounded-2xl border border-white/10 object-cover"
          />
        )}

        <p className="mt-8 leading-relaxed text-neutral-300">{project.description}</p>

        {project.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-neutral-400"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

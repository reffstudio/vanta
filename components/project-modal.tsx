"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X, Calendar, Tag } from "lucide-react"
import type { Project } from "@/lib/projects"

function ModalImage({
  src,
  alt,
  layoutId,
}: {
  src: string
  alt: string
  layoutId?: string | null
}) {
  const className = "block w-full h-auto max-w-full"

  if (layoutId) {
    return (
      <motion.img
        layoutId={layoutId}
        src={src}
        alt={alt}
        draggable={false}
        className={className}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      />
    )
  }

  return <img src={src} alt={alt} draggable={false} className={className} loading="lazy" />
}

export function ProjectModal({
  project,
  layoutId,
  onClose,
}: {
  project: Project | null
  layoutId: string | null
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (project) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [project, onClose])

  const galleryItems =
    project?.gallery.filter(
      (item) => !(item.type === "image" && item.url === project.image),
    ) ?? []

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            className="relative z-10 flex max-h-[100dvh] w-full max-w-4xl flex-col overflow-y-auto overscroll-contain bg-black sm:max-h-[92dvh] sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-2xl sm:shadow-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:bg-brand hover:text-brand-foreground sm:right-4 sm:top-4"
            >
              <X className="h-5 w-5" />
            </button>

            <ModalImage
              src={project.image}
              alt={project.title}
              layoutId={layoutId}
            />

            <motion.div
              className="px-5 py-6 sm:px-8 sm:py-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.12, ease: "easeOut" }}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                <span className="inline-flex items-center gap-1.5 text-brand">
                  <Tag className="h-3.5 w-3.5" />
                  {project.category}
                </span>
                {project.tags.length > 0 && (
                  <span className="inline-flex flex-wrap items-center gap-1.5 normal-case tracking-normal text-neutral-500">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {project.date}
                </span>
              </div>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
                {project.title}
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-300 text-pretty">
                {project.description}
              </p>
            </motion.div>

            {galleryItems.length > 0 && (
              <div className="flex flex-col">
                {galleryItems.map((item) => (
                  <figure key={item._key} className="m-0">
                    {item.type === "video" ? (
                      <video
                        src={item.url}
                        controls
                        playsInline
                        className="block w-full bg-black"
                      />
                    ) : (
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={item.alt || `${project.title} imagen`}
                        draggable={false}
                        loading="lazy"
                        className="block w-full h-auto max-w-full"
                      />
                    )}
                    {item.caption && (
                      <figcaption className="px-5 py-3 text-sm text-neutral-500 sm:px-8">
                        {item.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

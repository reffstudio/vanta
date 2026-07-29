"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X, Calendar, Tag } from "lucide-react"
import type { Project } from "@/lib/projects"

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

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:bg-brand hover:text-brand-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-3xl">
              {layoutId ? (
                <motion.img
                  layoutId={layoutId}
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent" />
            </div>

            <motion.div
              className="p-6 sm:p-8"
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
              <p className="mt-4 max-w-2xl leading-relaxed text-neutral-300 text-pretty">
                {project.description}
              </p>

              <div className="mt-8 flex flex-col gap-4">
                {project.gallery
                  .filter((item) => !(item.type === "image" && item.url === project.image))
                  .map((item) => (
                    <div
                      key={item._key}
                      className="w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900"
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          controls
                          playsInline
                          className="h-auto w-full bg-black"
                        />
                      ) : (
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.alt || `${project.title} imagen`}
                          className="h-auto w-full object-contain"
                        />
                      )}
                      {item.caption && (
                        <p className="border-t border-white/10 px-4 py-3 text-sm text-neutral-400">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

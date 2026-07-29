"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Pointer } from "lucide-react"
import type { Project } from "@/lib/projects"
import { FloatingGallery } from "@/components/floating-gallery"
import { ProjectModal } from "@/components/project-modal"
import { ContactModal } from "@/components/contact-modal"

export function HomePage({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<{ project: Project; layoutId: string } | null>(null)
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black text-white">
      <FloatingGallery
        projects={projects}
        onOpen={(project, layoutId) => setActive({ project, layoutId })}
        paused={active !== null}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.55)_100%)]" />

      <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <img
            src="/vanta-logo.png"
            alt="VANTA by Nery Tovar"
            className="w-56 rounded-3xl shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:w-72"
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-6 z-40 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-neutral-300 backdrop-blur-md">
          <Pointer className="h-3.5 w-3.5 text-brand" />
          <span>Mantén presionado un proyecto para abrir</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-40 flex justify-center">
        <motion.button
          type="button"
          onClick={() => setContactOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-3 rounded-full border border-brand/40 bg-black/50 px-7 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-black/50 backdrop-blur-md transition hover:border-brand hover:bg-black/70"
        >
          <span className="h-2 w-2 rounded-full bg-brand transition group-hover:scale-125" />
          Agendar Sesión
        </motion.button>
      </div>

      <ProjectModal
        project={active?.project ?? null}
        layoutId={active?.layoutId ?? null}
        onClose={() => setActive(null)}
      />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  )
}

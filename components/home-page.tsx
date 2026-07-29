"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Pointer, Zap } from "lucide-react"
import type { Project } from "@/lib/projects"
import { FloatingGallery } from "@/components/floating-gallery"
import { ProjectModal } from "@/components/project-modal"
import { ContactModal } from "@/components/contact-modal"
import { SocialLinks } from "@/components/social-links"

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
          className="flex w-56 flex-col items-center gap-5 sm:w-72"
        >
          <img
            src="/vanta-logo.png"
            alt="VANTA by Nery Tovar"
            className="w-full rounded-3xl shadow-2xl shadow-black/60 ring-1 ring-white/10"
          />

          <motion.span
            className="vanta-cta-ring pointer-events-auto flex w-full rounded-full"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.button
              type="button"
              onClick={() => setContactOpen(true)}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-black/70 px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-black/50 backdrop-blur-md transition hover:bg-black/85 sm:gap-3 sm:py-4 sm:text-sm sm:tracking-[0.15em]"
            >
              <Zap className="h-4 w-4 shrink-0 fill-brand text-brand transition group-hover:scale-110" />
              Agendar Sesión
              <Zap className="h-4 w-4 shrink-0 fill-brand text-brand transition group-hover:scale-110" />
            </motion.button>
          </motion.span>

          <SocialLinks />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-40 flex justify-center px-4">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-neutral-300 backdrop-blur-md">
          <span className="vanta-pointer-press inline-flex">
            <Pointer className="h-3.5 w-3.5 text-brand" />
          </span>
          <span>Mantén presionado un proyecto para abrir</span>
        </div>
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

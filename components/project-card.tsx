"use client"

import { useCallback, useRef, useState } from "react"
import { motion } from "motion/react"
import type { Project } from "@/lib/projects"

const HOLD_DURATION = 550 // ms

export function ProjectCard({
  project,
  layoutId,
  onOpen,
  onHoverChange,
}: {
  project: Project
  layoutId: string
  onOpen: (project: Project, layoutId: string) => void
  onHoverChange: (hovered: boolean) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [holding, setHolding] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setHolding(false)
  }, [])

  const startHold = useCallback(() => {
    setHolding(true)
    timerRef.current = setTimeout(() => {
      setHolding(false)
      onOpen(project, layoutId)
    }, HOLD_DURATION)
  }, [onOpen, project, layoutId])

  const setHover = useCallback(
    (value: boolean) => {
      setHovered(value)
      onHoverChange(value)
      if (!value) clearTimer()
    },
    [clearTimer, onHoverChange],
  )

  return (
    <motion.button
      type="button"
      aria-label={`Abrir proyecto ${project.title}. Mantén presionado o presiona Enter.`}
      className="group relative block w-full cursor-pointer touch-none select-none rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={(e) => {
        e.preventDefault()
        startHold()
      }}
      onPointerUp={clearTimer}
      onPointerCancel={clearTimer}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen(project, layoutId)
        }
      }}
      animate={{ scale: holding ? 1.35 : hovered ? 1.06 : 1 }}
      transition={
        holding
          ? { duration: HOLD_DURATION / 1000, ease: [0.4, 0, 0.6, 1] }
          : { type: "spring", stiffness: 260, damping: 24 }
      }
      style={{ zIndex: holding ? 20 : "auto" }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-xl shadow-black/60">
        <motion.img
          layoutId={layoutId}
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-[filter] duration-500 group-hover:brightness-110"
          draggable={false}
        />

        {/* label */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-left"
        >
          <p className="text-sm font-semibold leading-tight text-white text-balance">{project.title}</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-brand">{project.category}</p>
        </motion.div>
      </div>
    </motion.button>
  )
}

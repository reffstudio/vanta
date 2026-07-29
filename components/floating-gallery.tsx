"use client"

import { useMemo, useState } from "react"
import type { Project } from "@/lib/projects"
import { ProjectCard } from "@/components/project-card"

type ColumnConfig = {
  duration: string
  delay: string
  visibility: string
  // which projects (by index) live in this column — kept small for lots of empty space
  picks: number[]
}

// Fewer cards per column + staggered picks = sparse, non-grid feel.
const COLUMNS: ColumnConfig[] = [
  { duration: "11s", delay: "-3s", visibility: "", picks: [0, 5] },
  { duration: "13s", delay: "-6s", visibility: "", picks: [2, 7] },
  { duration: "12s", delay: "-4s", visibility: "hidden md:flex", picks: [4, 1] },
  { duration: "14s", delay: "-9s", visibility: "hidden xl:flex", picks: [6, 3] },
]

// Deterministic pseudo-random so server and client render identically (no hydration mismatch).
function seeded(seed: number) {
  const x = Math.sin(seed * 999.13) * 10000
  return x - Math.floor(x)
}

export function FloatingGallery({
  projects,
  onOpen,
  paused = false,
}: {
  projects: Project[]
  onOpen: (project: Project, layoutId: string) => void
  paused?: boolean
}) {
  const [pausedColumns, setPausedColumns] = useState<Record<number, boolean>>({})

  const columnItems = useMemo(
    () =>
      COLUMNS.map((col) =>
        col.picks.map((p) => projects[p % projects.length]).filter(Boolean),
      ),
    [projects],
  )

  return (
    <div className="pointer-events-none absolute inset-0 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4" aria-hidden={false}>
      {COLUMNS.map((col, colIndex) => {
        const items = columnItems[colIndex]
        // duplicate for a seamless -50% loop
        const loop = [...items, ...items]
        return (
          <div key={colIndex} className={`relative h-full overflow-hidden ${col.visibility}`}>
            <div
              className="vanta-column pointer-events-auto flex flex-col items-center pt-[18vh]"
              data-paused={paused || pausedColumns[colIndex] ? "true" : "false"}
              style={
                {
                  "--vanta-duration": col.duration,
                  "--vanta-delay": col.delay,
                } as React.CSSProperties
              }
            >
              {loop.map((project, i) => {
                const r1 = seeded(colIndex * 13 + i * 7 + 1)
                const r2 = seeded(colIndex * 29 + i * 11 + 3)
                const r3 = seeded(colIndex * 41 + i * 17 + 5)
                // random horizontal drift, vertical gap and size for an organic scatter.
                // Round to fixed precision so server/client HTML match (no hydration mismatch).
                const xOffset = ((r1 - 0.5) * 46).toFixed(2) // -23% .. +23%
                const marginTop = (22 + r2 * 34).toFixed(2) // 22vh .. 56vh of empty space
                const width = (58 + r3 * 34).toFixed(2) // 58% .. 92% of column width
                const cardId = `${colIndex}-${project.id}-${i}`
                return (
                  <div
                    key={cardId}
                    style={{
                      transform: `translateX(${xOffset}%)`,
                      marginTop: i === 0 ? "0vh" : `${marginTop}vh`,
                      width: `${width}%`,
                    }}
                  >
                    <ProjectCard
                      project={project}
                      layoutId={cardId}
                      onOpen={onOpen}
                      onHoverChange={(hovered) =>
                        setPausedColumns((prev) => ({ ...prev, [colIndex]: hovered }))
                      }
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

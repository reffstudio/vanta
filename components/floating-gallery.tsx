"use client"

import { useMemo, useState } from "react"
import type { Project } from "@/lib/projects"
import { useColumnScroll } from "@/lib/use-column-scroll"
import { ProjectCard } from "@/components/project-card"

type ColumnConfig = {
  duration: string
  delay: string
  visibility: string
  picks: number[]
}

const COLUMNS: ColumnConfig[] = [
  { duration: "28s", delay: "-7s", visibility: "", picks: [0, 5, 2] },
  { duration: "32s", delay: "-12s", visibility: "", picks: [2, 7, 4] },
  { duration: "30s", delay: "-9s", visibility: "hidden md:flex", picks: [4, 1, 6] },
  { duration: "34s", delay: "-15s", visibility: "hidden xl:flex", picks: [6, 3, 0] },
]

function seeded(seed: number) {
  const x = Math.sin(seed * 999.13) * 10000
  return x - Math.floor(x)
}

function cardLayout(colIndex: number, localIndex: number) {
  const r1 = seeded(colIndex * 13 + localIndex * 7 + 1)
  const r2 = seeded(colIndex * 29 + localIndex * 11 + 3)
  const r3 = seeded(colIndex * 41 + localIndex * 17 + 5)

  return {
    xOffset: ((r1 - 0.5) * 32).toFixed(2),
    gapVh: localIndex === 0 ? "0" : (14 + r2 * 10).toFixed(2),
    width: (62 + r3 * 28).toFixed(2),
  }
}

function ColumnSegment({
  colIndex,
  items,
  segmentKey,
  mirror,
  onOpen,
  onHoverChange,
}: {
  colIndex: number
  items: Project[]
  segmentKey: string
  mirror?: boolean
  onOpen: (project: Project, layoutId: string) => void
  onHoverChange: (hovered: boolean) => void
}) {
  return (
    <>
      {items.map((project, localIndex) => {
        const layout = cardLayout(colIndex, localIndex)
        const cardId = `${colIndex}-${project.id}-${localIndex}`

        return (
          <div
            key={`${segmentKey}-${cardId}`}
            className="vanta-column-item w-full shrink-0"
            style={{
              transform: `translateX(${layout.xOffset}%)`,
              marginTop: `${layout.gapVh}vh`,
              width: `${layout.width}%`,
            }}
          >
            <ProjectCard
              project={project}
              layoutId={cardId}
              imageLayoutId={mirror ? undefined : cardId}
              onOpen={onOpen}
              onHoverChange={onHoverChange}
            />
          </div>
        )
      })}
    </>
  )
}

function GalleryColumn({
  colIndex,
  col,
  items,
  paused,
  onOpen,
  onHoverChange,
}: {
  colIndex: number
  col: ColumnConfig
  items: Project[]
  paused: boolean
  onOpen: (project: Project, layoutId: string) => void
  onHoverChange: (hovered: boolean) => void
}) {
  const { trackRef, scrubHandlers } = useColumnScroll({
    duration: col.duration,
    delay: col.delay,
    paused,
  })

  return (
    <div
      className={`vanta-column-scrub relative h-full overflow-hidden ${col.visibility}`}
      {...scrubHandlers}
    >
      <div ref={trackRef} className="vanta-column-track pointer-events-auto flex flex-col items-center">
        <ColumnSegment
          colIndex={colIndex}
          items={items}
          segmentKey={`${colIndex}-a`}
          onOpen={onOpen}
          onHoverChange={onHoverChange}
        />
        <ColumnSegment
          colIndex={colIndex}
          items={items}
          segmentKey={`${colIndex}-b`}
          mirror
          onOpen={onOpen}
          onHoverChange={onHoverChange}
        />
      </div>
    </div>
  )
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
    <div
      className="pointer-events-none absolute inset-0 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      aria-hidden={false}
    >
      {COLUMNS.map((col, colIndex) => {
        const items = columnItems[colIndex]
        if (!items.length) return null

        return (
          <GalleryColumn
            key={colIndex}
            colIndex={colIndex}
            col={col}
            items={items}
            paused={paused || !!pausedColumns[colIndex]}
            onOpen={onOpen}
            onHoverChange={(hovered) =>
              setPausedColumns((prev) => ({ ...prev, [colIndex]: hovered }))
            }
          />
        )
      })}
    </div>
  )
}

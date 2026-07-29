"use client"

import { motion, type Transition } from "motion/react"
import { cn } from "@/lib/utils"

type ProjectLayoutImageProps = {
  src: string
  alt: string
  className?: string
  layoutId?: string
  transition?: Transition
}

export function ProjectLayoutImage({
  src,
  alt,
  className,
  layoutId,
  transition,
}: ProjectLayoutImageProps) {
  const imageUrl = src || "/placeholder.svg"

  if (layoutId) {
    return (
      <motion.div
        layoutId={layoutId}
        role="img"
        aria-label={alt}
        className={cn("bg-cover bg-center", className)}
        style={{ backgroundImage: `url("${imageUrl}")` }}
        transition={transition}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("bg-cover bg-center", className)}
      style={{ backgroundImage: `url("${imageUrl}")` }}
    />
  )
}

"use client"

import { useCallback, useEffect, useRef } from "react"

const SCRUB_THRESHOLD = 10

function parseSeconds(value: string): number {
  return parseFloat(value) * 1000
}

function initialProgress(durationMs: number, delayMs: number): number {
  const offset = ((-delayMs % durationMs) + durationMs) % durationMs
  return offset / durationMs
}

export function useColumnScroll({
  duration,
  delay,
  paused,
}: {
  duration: string
  delay: string
  paused: boolean
}) {
  const durationMs = parseSeconds(duration)
  const delayMs = parseSeconds(delay)

  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(initialProgress(durationMs, delayMs))
  const dragOffsetRef = useRef(0)
  const isDraggingRef = useRef(false)
  const hasScrubbedRef = useRef(false)
  const pointerStartYRef = useRef(0)
  const lastYRef = useRef(0)
  const halfHeightRef = useRef(0)
  const lastTimeRef = useRef(0)
  const reducedMotionRef = useRef(false)

  const applyTransform = useCallback(() => {
    const el = trackRef.current
    const half = halfHeightRef.current
    if (!el || half === 0) return
    const y = -progressRef.current * half + dragOffsetRef.current
    el.style.transform = `translate3d(0, ${y}px, 0)`
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = mq.matches
    const onChange = () => {
      reducedMotionRef.current = mq.matches
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const measure = () => {
      halfHeightRef.current = el.scrollHeight / 2
      applyTransform()
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [applyTransform])

  useEffect(() => {
    if (paused || reducedMotionRef.current) return

    let raf = 0
    const tick = (now: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = now
      const dt = now - lastTimeRef.current
      lastTimeRef.current = now

      if (!isDraggingRef.current) {
        progressRef.current = (progressRef.current + dt / durationMs) % 1
        applyTransform()
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      lastTimeRef.current = 0
    }
  }, [paused, durationMs, applyTransform])

  const onPointerDownCapture = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    isDraggingRef.current = true
    hasScrubbedRef.current = false
    pointerStartYRef.current = e.clientY
    lastYRef.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMoveCapture = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return

      const totalDy = e.clientY - pointerStartYRef.current
      if (!hasScrubbedRef.current && Math.abs(totalDy) < SCRUB_THRESHOLD) return

      hasScrubbedRef.current = true
      const dy = e.clientY - lastYRef.current
      lastYRef.current = e.clientY
      dragOffsetRef.current += dy
      applyTransform()
    },
    [applyTransform],
  )

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return

      if (hasScrubbedRef.current && halfHeightRef.current > 0) {
        const half = halfHeightRef.current
        const totalY = -progressRef.current * half + dragOffsetRef.current
        progressRef.current = (((-totalY / half) % 1) + 1) % 1
        dragOffsetRef.current = 0
        applyTransform()
      }

      isDraggingRef.current = false
      hasScrubbedRef.current = false
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    },
    [applyTransform],
  )

  return {
    trackRef,
    scrubHandlers: {
      onPointerDownCapture,
      onPointerMoveCapture,
      onPointerUpCapture: endDrag,
      onPointerCancelCapture: endDrag,
    },
  }
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { services } from "@/lib/projects"

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function Calendar({
  selected,
  onSelect,
}: {
  selected: Date | null
  onSelect: (date: Date) => void
}) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()

  // Monday-first offset for the first day of the month
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDayIndex; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const canGoPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1)

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month - 1, 1))}
          disabled={!canGoPrev}
          aria-label="Mes anterior"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-brand hover:text-brand-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-white">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month + 1, 1))}
          aria-label="Mes siguiente"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-brand hover:text-brand-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-center text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />
          const isPast = date < today
          const isSelected = selected != null && date.getTime() === startOfDay(selected).getTime()
          const isToday = date.getTime() === today.getTime()
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(date)}
              className={[
                "flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition",
                isSelected
                  ? "bg-brand text-brand-foreground"
                  : isPast
                    ? "cursor-not-allowed text-neutral-700"
                    : "text-neutral-200 hover:bg-white/10",
                isToday && !isSelected ? "ring-1 ring-inset ring-brand/60" : "",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ContactModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setSubmitted(false)
      setSelectedDate(null)
      setSelectedTime("")
    }
  }, [open])

  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"

  const dateLabel = selectedDate
    ? `${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : "Seleccione una fecha en el calendario"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Formulario para agendar sesión"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

          <motion.div
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-neutral-950 p-6 shadow-2xl shadow-black sm:p-8"
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-brand hover:text-brand-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-white">¡Sesión agendada!</h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-400 text-pretty">
                  Gracias por escribir. Le responderemos muy pronto para confirmar los detalles de la sesión.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Agendar sesión</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Creemos algo juntos</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400 text-pretty">
                  Complete los datos de la sesión y le contactaremos con una propuesta.
                </p>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSubmitted(true)
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-neutral-300">
                        Nombre
                      </label>
                      <input id="name" name="name" required placeholder="Nombre completo" className={fieldClass} />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-neutral-300">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="nombre@correo.com"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-neutral-300">
                        Teléfono
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+1 555 123 4567"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="mb-1.5 block text-xs font-medium text-neutral-300">
                        Servicio
                      </label>
                      <select id="service" name="service" required defaultValue="" className={fieldClass}>
                        <option value="" disabled>
                          Selecciona un servicio
                        </option>
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-neutral-900">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-300">Fecha deseada</label>
                    <Calendar selected={selectedDate} onSelect={setSelectedDate} />
                    <input
                      type="hidden"
                      name="date"
                      required
                      value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}
                    />
                    <p className="mt-2 text-xs text-neutral-400">{dateLabel}</p>
                  </div>

                  <div>
                    <label htmlFor="time" className="mb-1.5 block text-xs font-medium text-neutral-300">
                      Hora deseada
                    </label>
                    <select
                      id="time"
                      name="time"
                      required
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="" disabled>
                        Selecciona una hora
                      </option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t} className="bg-neutral-900">
                          {t} hrs
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-neutral-300">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Describe la idea o el proyecto..."
                      className={`${fieldClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-brand-foreground transition hover:brightness-110 active:scale-[0.99]"
                  >
                    Agendar sesión
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

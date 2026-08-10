export function PoweredByReff() {
  return (
    <a
      href="https://www.reff.studio"
      target="_blank"
      rel="noopener noreferrer"
      className="pointer-events-auto inline-flex items-center gap-1.5 text-[10px] tracking-wide text-neutral-400 transition hover:text-neutral-300"
      aria-label="Powered by REFF STUDIO — abre en una nueva pestaña"
    >
      <span>Powered by</span>
      <img
        src="/reff-studio-logo.png"
        alt="REFF STUDIO"
        className="h-3.5 w-auto mix-blend-screen"
      />
    </a>
  )
}

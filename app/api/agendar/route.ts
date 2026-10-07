import { NextResponse } from "next/server"

const FIELDS = ["name", "email", "phone", "service", "date", "time", "message"] as const

function asSheetText(value: string) {
  return value.startsWith("'") ? value : `'${value}`
}

function sheetsAccepted(status: number) {
  return (status >= 200 && status < 400) || status === 405
}

export async function POST(request: Request) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "El formulario aún no está conectado." },
      { status: 503 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 })
  }

  const payload = Object.fromEntries(
    FIELDS.map((field) => [field, typeof body[field] === "string" ? body[field].trim() : ""]),
  )

  if (!payload.name || !payload.email || !payload.phone || !payload.service || !payload.date || !payload.time) {
    return NextResponse.json({ error: "Faltan datos obligatorios." }, { status: 400 })
  }

  // Sheets trata un valor que empieza con + como fórmula (#ERROR!).
  payload.phone = asSheetText(payload.phone)

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "manual",
  })

  if (!sheetsAccepted(response.status)) {
    return NextResponse.json(
      { error: "No se pudo guardar la solicitud. Intenta de nuevo." },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}

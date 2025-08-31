import { NextResponse } from 'next/server'

const base = process.env.ML_SERVICE_URL ?? 'http://127.0.0.1:8000'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const r = await fetch(`${base}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await r.json()
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}



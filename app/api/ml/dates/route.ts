import { NextResponse } from 'next/server'

const base = process.env.ML_SERVICE_URL ?? 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const r = await fetch(`${base}/dates`)
    const data = await r.json()
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}



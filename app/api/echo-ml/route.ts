import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { coordinate } = body || {}

  const base = coordinate || { lat: -32.2469, lng: 148.601 }
  const jitter = (n: number) => n + (Math.random() - 0.5) * 1.2

  const sites = Array.from({ length: 3 }).map((_, i) => ({
    id: `mock-${i + 1}`,
    lat: jitter(base.lat)3,
    lng: jitter(base.lng),
    score: Math.round((0.7 + Math.random() * 0.25) * 100) / 100,
    summary: 'Mock ML site candidate for local testing.'
  }))

  return NextResponse.json({ sites })
}

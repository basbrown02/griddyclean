import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type ExtractResult = { locationQuery: string; technology?: 'solar' | 'wind' | 'hydro' }

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    // Step 1: Ask the model to extract a clean place string and technology as JSON
    const extract = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Extract the target place and technology from the user text. Respond ONLY as JSON with keys: locationQuery (string, include state and country if known; prefer Australian locality), technology (one of solar, wind, hydro).',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    })

    let extracted: ExtractResult = { locationQuery: 'Australia' }
    try {
      extracted = JSON.parse(extract.choices?.[0]?.message?.content || '{}')
    } catch {}
    if (!extracted.locationQuery) extracted.locationQuery = 'Australia'
    if (!/australia/i.test(extracted.locationQuery)) {
      extracted.locationQuery = `${extracted.locationQuery}, Australia`
    }

    // Step 2: Geocode the place with Google Geocoding API
    const googleKey =
      process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!googleKey) {
      return NextResponse.json({ error: 'Missing Google Maps API key' }, { status: 500 })
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      extracted.locationQuery
    )}&key=${googleKey}`
    const geoRes = await fetch(url)
    const geo = await geoRes.json()
    const best = geo?.results?.[0]
    const coord = best?.geometry?.location

    if (!coord) {
      return NextResponse.json({
        result: {
          technology: extracted.technology ?? 'wind',
          locationQuery: extracted.locationQuery,
          error: 'Geocoding failed',
        },
      })
    }

    const result = {
      technology: extracted.technology ?? 'wind',
      locationQuery: extracted.locationQuery,
      coordinate: { lat: coord.lat, lng: coord.lng },
      fullAddress: best?.formatted_address,
      placeId: best?.place_id,
      source: 'google-geocoding',
    }

    return NextResponse.json({ result })
  } catch (err) {
    console.error('Agent error', err)
    return NextResponse.json({ error: 'Agent failed' }, { status: 500 })
  }
}

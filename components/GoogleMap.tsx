"use client"

import { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Layers, ChevronDown } from 'lucide-react'

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export interface MarkerData {
  lat: number
  lng: number
  title?: string
}

interface GoogleMapProps {
  className?: string
  markers?: MarkerData[]
}

export function GoogleMap({ className, markers = [] }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerInstancesRef = useRef<any[]>([])
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    // Load Google Maps API once
    const existing = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]'
    ) as HTMLScriptElement | null

    if (!existing) {
      if (!apiKey) {
        console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
        return
      }
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing&callback=initMap`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    window.initMap = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        const australiaCenter = { lat: -25.2744, lng: 133.7751 }
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: australiaCenter,
          zoom: 5,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a2daf2' }] },
            { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f2' }] },
          ],
        })
        mapInstanceRef.current = newMap
      }
      // Render initial markers
      renderMarkers()
    }

    // If the API is already present, initialize immediately
    if (window.google?.maps && !mapInstanceRef.current) {
      window.initMap()
    }

    return () => {
      // cleanup markers only
      markerInstancesRef.current.forEach((m) => m.setMap(null))
      markerInstancesRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Render markers when props change
  useEffect(() => {
    renderMarkers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(markers)])

  const renderMarkers = () => {
    if (!mapInstanceRef.current || !window.google?.maps) return

    // Remove previous markers
    markerInstancesRef.current.forEach((m) => m.setMap(null))
    markerInstancesRef.current = []

    markers.forEach(({ lat, lng, title }) => {
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#dc2626"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
          anchor: new window.google.maps.Point(12, 24),
        },
      })
      markerInstancesRef.current.push(marker)
    })

    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }))
      mapInstanceRef.current.fitBounds(bounds)
    }
  }

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[600px]" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="w-8 h-8 bg-white/90 hover:bg-white"
        >
          <Layers className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-8 h-8 bg-white/90 hover:bg-white"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

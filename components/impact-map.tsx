"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, MapPin, AlertTriangle } from "lucide-react"
import type { SimulationResult } from "@/types/simulation"

interface ImpactMapProps {
  result: SimulationResult
  onClose?: () => void
}

export function ImpactMap({ result, onClose }: ImpactMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      // Load Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Load Leaflet JS
      if (!(window as any).L) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.async = true
        document.body.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      setIsLoaded(true)
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return

    const L = (window as any).L
    if (!L) return

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([result.input.latitude, result.input.longitude], 8)

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Impact point marker
    L.marker([result.input.latitude, result.input.longitude], {
      icon: L.divIcon({
        className: "impact-marker",
        html: '<div style="background: red; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>',
        iconSize: [20, 20],
      }),
    })
      .addTo(map)
      .bindPopup("<b>Impact Point</b><br>Ground Zero")

    // Fireball radius (red)
    L.circle([result.input.latitude, result.input.longitude], {
      radius: result.fireball.radius_m,
      color: "#ff0000",
      fillColor: "#ff0000",
      fillOpacity: 0.4,
      weight: 2,
    })
      .addTo(map)
      .bindPopup(`<b>Fireball</b><br>Radius: ${result.fireball.radius_km.toFixed(2)} km<br>Instant vaporization`)

    // Total destruction zone (dark red)
    L.circle([result.input.latitude, result.input.longitude], {
      radius: result.blast.total_destruction_m,
      color: "#cc0000",
      fillColor: "#cc0000",
      fillOpacity: 0.3,
      weight: 2,
    })
      .addTo(map)
      .bindPopup(
        `<b>Total Destruction (20 psi)</b><br>Radius: ${result.blast.total_destruction_km.toFixed(2)} km<br>Complete structural collapse`,
      )

    // Severe damage zone (orange)
    L.circle([result.input.latitude, result.input.longitude], {
      radius: result.blast.severe_damage_m,
      color: "#ff6600",
      fillColor: "#ff6600",
      fillOpacity: 0.2,
      weight: 2,
    })
      .addTo(map)
      .bindPopup(
        `<b>Severe Damage (5 psi)</b><br>Radius: ${result.blast.severe_damage_km.toFixed(2)} km<br>Most buildings collapse`,
      )

    // Moderate damage zone (yellow)
    L.circle([result.input.latitude, result.input.longitude], {
      radius: result.blast.moderate_damage_m,
      color: "#ffcc00",
      fillColor: "#ffcc00",
      fillOpacity: 0.15,
      weight: 2,
    })
      .addTo(map)
      .bindPopup(
        `<b>Moderate Damage (1 psi)</b><br>Radius: ${result.blast.moderate_damage_km.toFixed(2)} km<br>Window breakage, light damage`,
      )

    // Crater circle (brown)
    L.circle([result.input.latitude, result.input.longitude], {
      radius: result.crater.diameter_m / 2,
      color: "#8b4513",
      fillColor: "#8b4513",
      fillOpacity: 0.6,
      weight: 3,
    })
      .addTo(map)
      .bindPopup(
        `<b>Impact Crater</b><br>Diameter: ${result.crater.diameter_km.toFixed(2)} km<br>Depth: ${result.crater.depth_m.toFixed(0)} m`,
      )

    // Fit bounds to show all circles
    const bounds = L.latLngBounds([
      [result.input.latitude, result.input.longitude],
      [result.input.latitude, result.input.longitude],
    ])
    bounds.extend(L.latLng(result.input.latitude, result.input.longitude).toBounds(result.blast.moderate_damage_m * 2))
    map.fitBounds(bounds, { padding: [50, 50] })

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [isLoaded, result])

  return (
    <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-purple-400" />
          Impact Zone Map
        </CardTitle>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-purple-950/50"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div
          ref={mapContainerRef}
          className="w-full h-[500px] rounded-lg overflow-hidden border border-purple-500/30"
        />

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span className="text-sm text-slate-300">Fireball</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-700"></div>
            <span className="text-sm text-slate-300">Total Destruction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-600"></div>
            <span className="text-sm text-slate-300">Severe Damage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
            <span className="text-sm text-slate-300">Moderate Damage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-800"></div>
            <span className="text-sm text-slate-300">Impact Crater</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-sm text-slate-300">Ground Zero</span>
          </div>
        </div>

        <div className="mt-4 bg-yellow-950/50 p-3 rounded-lg border border-yellow-500/30 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            Click on any circle to see detailed information. Use mouse wheel to zoom and drag to pan the map.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

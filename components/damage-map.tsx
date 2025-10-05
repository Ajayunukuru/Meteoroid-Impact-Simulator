"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, MapPin } from "lucide-react"
import type { SimulationResult } from "@/types/simulation"

interface DamageMapProps {
  latitude: number
  longitude: number
  simulationResult: SimulationResult | null
}

const MAJOR_CITIES = [
  { name: "New York", lat: 40.7128, lon: -74.006, population: "8.3M" },
  { name: "London", lat: 51.5074, lon: -0.1278, population: "9M" },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503, population: "14M" },
  { name: "Paris", lat: 48.8566, lon: 2.3522, population: "2.2M" },
  { name: "Sydney", lat: -33.8688, lon: 151.2093, population: "5.3M" },
  { name: "Mumbai", lat: 19.076, lon: 72.8777, population: "20M" },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437, population: "4M" },
  { name: "Beijing", lat: 39.9042, lon: 116.4074, population: "21M" },
]

export function DamageMap({ latitude, longitude, simulationResult }: DamageMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const kmToPixels = (km: number) => km * 10 * zoom

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getAffectedCities = () => {
    if (!simulationResult) return { total: [], severe: [], moderate: [] }

    const total: typeof MAJOR_CITIES = []
    const severe: typeof MAJOR_CITIES = []
    const moderate: typeof MAJOR_CITIES = []

    MAJOR_CITIES.forEach((city) => {
      const distance = calculateDistance(latitude, longitude, city.lat, city.lon)
      if (distance <= simulationResult.blast.total_destruction_km) {
        total.push(city)
      } else if (distance <= simulationResult.blast.severe_damage_km) {
        severe.push(city)
      } else if (distance <= simulationResult.blast.moderate_damage_km) {
        moderate.push(city)
      }
    })

    return { total, severe, moderate }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = container.clientWidth || 800
    const height = 400

    canvas.width = width
    canvas.height = height

    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
    gradient.addColorStop(0, "#0f172a")
    gradient.addColorStop(1, "#020617")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2 + pan.x
    const centerY = canvas.height / 2 + pan.y

    ctx.strokeStyle = "#1e293b"
    ctx.lineWidth = 1
    ctx.shadowBlur = 5
    ctx.shadowColor = "#3b82f6"
    for (let i = 0; i < canvas.width; i += 50 * zoom) {
      ctx.beginPath()
      ctx.moveTo(i + pan.x, 0)
      ctx.lineTo(i + pan.x, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50 * zoom) {
      ctx.beginPath()
      ctx.moveTo(0, i + pan.y)
      ctx.lineTo(canvas.width, i + pan.y)
      ctx.stroke()
    }
    ctx.shadowBlur = 0

    if (simulationResult && simulationResult.blast) {
      const moderateRadius = kmToPixels(simulationResult.blast.moderate_damage_km)
      const severeRadius = kmToPixels(simulationResult.blast.severe_damage_km)
      const totalRadius = kmToPixels(simulationResult.blast.total_destruction_km)

      const zones = [
        {
          radius: moderateRadius,
          color: "rgba(234, 179, 8, 0.15)",
          borderColor: "rgba(234, 179, 8, 0.8)",
          glowColor: "rgba(234, 179, 8, 0.4)",
          label: "Moderate Damage",
          distance: simulationResult.blast.moderate_damage_km,
          description: "Windows shatter, minor structural damage",
        },
        {
          radius: severeRadius,
          color: "rgba(249, 115, 22, 0.2)",
          borderColor: "rgba(249, 115, 22, 0.9)",
          glowColor: "rgba(249, 115, 22, 0.5)",
          label: "Severe Damage",
          distance: simulationResult.blast.severe_damage_km,
          description: "Buildings collapse, major infrastructure damage",
        },
        {
          radius: totalRadius,
          color: "rgba(239, 68, 68, 0.25)",
          borderColor: "rgba(239, 68, 68, 1)",
          glowColor: "rgba(239, 68, 68, 0.6)",
          label: "Total Destruction",
          distance: simulationResult.blast.total_destruction_km,
          description: "Complete devastation, no survivors",
        },
      ]

      zones.forEach((zone) => {
        // Outer glow
        ctx.shadowBlur = 20
        ctx.shadowColor = zone.glowColor
        ctx.fillStyle = zone.color
        ctx.beginPath()
        ctx.arc(centerX, centerY, zone.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        // Border with highlight effect
        const isHovered = hoveredZone === zone.label
        ctx.strokeStyle = zone.borderColor
        ctx.lineWidth = isHovered ? 4 : 2
        ctx.setLineDash(isHovered ? [10, 5] : [])
        ctx.beginPath()
        ctx.arc(centerX, centerY, zone.radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.save()
        ctx.font = "bold 13px monospace"
        const labelText = `${zone.label}: ${zone.distance.toFixed(1)} km`
        const textWidth = ctx.measureText(labelText).width
        const labelX = centerX + zone.radius + 15
        const labelY = centerY

        // Label background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(labelX - 5, labelY - 15, textWidth + 10, 22)

        // Label border
        ctx.strokeStyle = zone.borderColor
        ctx.lineWidth = 1
        ctx.strokeRect(labelX - 5, labelY - 15, textWidth + 10, 22)

        // Label text
        ctx.fillStyle = zone.borderColor
        ctx.fillText(labelText, labelX, labelY)
        ctx.restore()
      })

      if (simulationResult.crater) {
        const craterRadius = kmToPixels(simulationResult.crater.diameter_km / 2)

        // Crater shadow
        ctx.shadowBlur = 15
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
        ctx.fillStyle = "rgba(92, 64, 51, 0.9)"
        ctx.beginPath()
        ctx.arc(centerX, centerY, craterRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        // Crater rim
        ctx.strokeStyle = "rgba(139, 69, 19, 1)"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(centerX, centerY, craterRadius, 0, Math.PI * 2)
        ctx.stroke()

        // Crater label
        ctx.fillStyle = "rgba(139, 69, 19, 1)"
        ctx.font = "bold 11px monospace"
        ctx.fillText(
          `Crater: ${simulationResult.crater.diameter_km.toFixed(2)} km`,
          centerX - craterRadius / 2,
          centerY,
        )
      }

      const affectedCities = getAffectedCities()
      const allAffected = [...affectedCities.total, ...affectedCities.severe, ...affectedCities.moderate]

      allAffected.forEach((city) => {
        const distance = calculateDistance(latitude, longitude, city.lat, city.lon)
        const angle = Math.random() * Math.PI * 2 // Simplified positioning
        const pixelDistance = kmToPixels(distance)
        const cityX = centerX + Math.cos(angle) * pixelDistance
        const cityY = centerY + Math.sin(angle) * pixelDistance

        // City marker
        ctx.fillStyle = "#3b82f6"
        ctx.beginPath()
        ctx.arc(cityX, cityY, 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "#60a5fa"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(cityX, cityY, 4, 0, Math.PI * 2)
        ctx.stroke()

        // City name
        ctx.fillStyle = "#93c5fd"
        ctx.font = "10px monospace"
        ctx.fillText(city.name, cityX + 8, cityY + 3)
      })
    }

    const pulseSize = 8 + Math.sin(Date.now() / 200) * 2

    // Impact glow
    ctx.shadowBlur = 20
    ctx.shadowColor = "#ef4444"
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Impact border
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2
    ctx.setLineDash([8, 4])
    ctx.shadowBlur = 10
    ctx.shadowColor = "#ef4444"

    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 25, canvas.height / 2)
    ctx.lineTo(canvas.width / 2 - 12, canvas.height / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 + 12, canvas.height / 2)
    ctx.lineTo(canvas.width / 2 + 25, canvas.height / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, canvas.height / 2 - 25)
    ctx.lineTo(canvas.width / 2, canvas.height / 2 - 12)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, canvas.height / 2 + 12)
    ctx.lineTo(canvas.width / 2, canvas.height / 2 + 25)
    ctx.stroke()

    ctx.setLineDash([])
    ctx.shadowBlur = 0

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fillRect(5, 5, 280, 30)
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 1
    ctx.strokeRect(5, 5, 280, 30)

    ctx.fillStyle = "#60a5fa"
    ctx.font = "bold 14px monospace"
    ctx.fillText(`Impact: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`, 12, 24)

    const scaleKm = 10
    const scalePixels = kmToPixels(scaleKm)

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fillRect(5, canvas.height - 55, scalePixels + 20, 45)
    ctx.strokeStyle = "#3b82f6"
    ctx.strokeRect(5, canvas.height - 55, scalePixels + 20, 45)

    ctx.strokeStyle = "#60a5fa"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(15, canvas.height - 30)
    ctx.lineTo(15 + scalePixels, canvas.height - 30)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(15, canvas.height - 35)
    ctx.lineTo(15, canvas.height - 25)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(15 + scalePixels, canvas.height - 35)
    ctx.lineTo(15 + scalePixels, canvas.height - 25)
    ctx.stroke()

    ctx.fillStyle = "#93c5fd"
    ctx.font = "bold 12px monospace"
    ctx.fillText(`${scaleKm} km`, 15 + scalePixels / 2 - 18, canvas.height - 40)
  }, [latitude, longitude, simulationResult, zoom, pan, hoveredZone])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }

    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.5, 5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.5, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const affectedCities = getAffectedCities()

  return (
    <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30 shadow-2xl shadow-purple-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          <MapPin className="inline-block mr-2 h-5 w-5 text-blue-400" />
          Damage Zone Map
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="border-purple-400 text-purple-300 hover:bg-purple-950/50 bg-transparent h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="border-purple-400 text-purple-300 hover:bg-purple-950/50 bg-transparent h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="border-purple-400 text-purple-300 hover:bg-purple-950/50 bg-transparent h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="w-full">
          <canvas
            ref={canvasRef}
            className="w-full h-[400px] bg-slate-900 rounded-lg cursor-move border border-purple-500/20"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <div className="flex flex-col gap-1 p-2 bg-red-950/30 rounded border border-red-500/30">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500/30 border-2 border-red-500"></div>
              <span className="text-red-300 font-semibold">Total Destruction</span>
            </div>
            <span className="text-red-200/70 text-[10px] ml-6">Complete devastation</span>
          </div>
          <div className="flex flex-col gap-1 p-2 bg-orange-950/30 rounded border border-orange-500/30">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500/30 border-2 border-orange-500"></div>
              <span className="text-orange-300 font-semibold">Severe Damage</span>
            </div>
            <span className="text-orange-200/70 text-[10px] ml-6">Buildings collapse</span>
          </div>
          <div className="flex flex-col gap-1 p-2 bg-yellow-950/30 rounded border border-yellow-500/30">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500/30 border-2 border-yellow-500"></div>
              <span className="text-yellow-300 font-semibold">Moderate Damage</span>
            </div>
            <span className="text-yellow-200/70 text-[10px] ml-6">Windows shatter</span>
          </div>
        </div>

        {simulationResult &&
          (affectedCities.total.length > 0 ||
            affectedCities.severe.length > 0 ||
            affectedCities.moderate.length > 0) && (
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-blue-500/30">
              <h4 className="text-sm font-semibold text-blue-300 mb-2">Affected Major Cities</h4>
              <div className="space-y-2 text-xs">
                {affectedCities.total.length > 0 && (
                  <div>
                    <span className="text-red-400 font-semibold">Total Destruction: </span>
                    <span className="text-slate-300">
                      {affectedCities.total.map((c) => `${c.name} (${c.population})`).join(", ")}
                    </span>
                  </div>
                )}
                {affectedCities.severe.length > 0 && (
                  <div>
                    <span className="text-orange-400 font-semibold">Severe Damage: </span>
                    <span className="text-slate-300">
                      {affectedCities.severe.map((c) => `${c.name} (${c.population})`).join(", ")}
                    </span>
                  </div>
                )}
                {affectedCities.moderate.length > 0 && (
                  <div>
                    <span className="text-yellow-400 font-semibold">Moderate Damage: </span>
                    <span className="text-slate-300">
                      {affectedCities.moderate.map((c) => `${c.name} (${c.population})`).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

        <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          Drag to pan, use zoom controls to adjust view. Blue markers show major cities.
        </p>
      </CardContent>
    </Card>
  )
}

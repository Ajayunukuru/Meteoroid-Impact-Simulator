"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ThemeToggle } from "@/components/theme-toggle"
import { ImpactVisualization } from "@/components/impact-visualization"
import { ImpactResults } from "@/components/impact-results"
import { LoadingOverlay } from "@/components/loading-overlay"
import { QualitySettingsPanel, getDefaultQualitySettings, type QualitySettings } from "@/components/quality-settings"
import { ArrowLeft, Play, RotateCcw } from "lucide-react"
import Link from "next/link"
import type { SimulationResult } from "@/types/simulation"
import { calculateImpactLocation } from "@/lib/location-utils"
import { DamageMap } from "@/components/damage-map"

export default function SimulatorPage() {
  const router = useRouter()
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState("Preparing simulation...")
  const visualizationRef = useRef<HTMLDivElement>(null)

  const [qualitySettings, setQualitySettings] = useState<QualitySettings>(getDefaultQualitySettings())

  const [diameter, setDiameter] = useState(100)
  const [density, setDensity] = useState(3000)
  const [velocity, setVelocity] = useState(20)
  const [angle, setAngle] = useState(45)
  const [composition, setComposition] = useState("stone")
  const [targetType, setTargetType] = useState("land")
  const [latitude, setLatitude] = useState(40.7128)
  const [longitude, setLongitude] = useState(-74.006)

  useEffect(() => {
    setQualitySettings(getDefaultQualitySettings())
  }, [])

  const handleSimulate = async () => {
    setIsSimulating(true)
    setShowAnimation(false)
    setLoadingProgress(0)
    setLoadingMessage("Calculating trajectory...")

    const updateProgress = (progress: number, message: string) => {
      setLoadingProgress(progress)
      setLoadingMessage(message)
    }

    const actualImpact = calculateImpactLocation(latitude, longitude, angle, velocity, diameter)
    updateProgress(20, "Computing impact physics...")

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diameter,
          density,
          velocity,
          angle,
          composition,
          targetType,
          latitude: actualImpact.latitude,
          longitude: actualImpact.longitude,
        }),
      })

      updateProgress(50, "Loading 3D assets...")

      if (!response.ok) {
        throw new Error("Simulation failed")
      }

      const result = await response.json()
      updateProgress(70, "Preparing visualization...")

      await new Promise((resolve) => setTimeout(resolve, 500))

      setSimulationResult(result)
      updateProgress(90, "Starting animation...")

      await new Promise((resolve) => setTimeout(resolve, 300))
      updateProgress(100, "Complete!")

      setShowAnimation(true)

      setTimeout(() => {
        visualizationRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }, 200)
    } catch (error) {
      console.error("Simulation error:", error)
      alert("Simulation failed. Please try again.")
    } finally {
      setTimeout(() => {
        setIsSimulating(false)
      }, 500)
    }
  }

  const handleReset = () => {
    setSimulationResult(null)
    setShowAnimation(false)
    setDiameter(100)
    setDensity(3000)
    setVelocity(20)
    setAngle(45)
    setComposition("stone")
    setTargetType("land")
    setLatitude(40.7128)
    setLongitude(-74.006)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 smooth-scroll">
      <LoadingOverlay show={isSimulating} progress={loadingProgress} message={loadingMessage} />

      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
      </div>

      <header className="relative z-10 border-b border-purple-500/30 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="text-purple-300 hover:bg-purple-950/50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Impact Simulator
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Impact Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-200 text-base">Diameter: {diameter} m</Label>
                  <Slider
                    value={[diameter]}
                    onValueChange={(v) => setDiameter(v[0])}
                    min={10}
                    max={10000}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400">Range: 10m - 10km</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-base">Velocity: {velocity} km/s</Label>
                  <Slider
                    value={[velocity]}
                    onValueChange={(v) => setVelocity(v[0])}
                    min={11}
                    max={72}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400">Range: 11-72 km/s</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-base">Density: {density} kg/m³</Label>
                  <Slider
                    value={[density]}
                    onValueChange={(v) => setDensity(v[0])}
                    min={1000}
                    max={8000}
                    step={100}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400">Range: 1000-8000 kg/m³</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-base">Impact Angle: {angle}°</Label>
                  <Slider
                    value={[angle]}
                    onValueChange={(v) => setAngle(v[0])}
                    min={15}
                    max={90}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400">Range: 15-90 degrees from horizontal</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-base">Composition</Label>
                  <Select value={composition} onValueChange={setComposition}>
                    <SelectTrigger className="bg-slate-900/50 border-purple-500/30 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ice">Ice (917 kg/m³)</SelectItem>
                      <SelectItem value="carbonaceous">Carbonaceous (2000 kg/m³)</SelectItem>
                      <SelectItem value="stone">Stone (3000 kg/m³)</SelectItem>
                      <SelectItem value="stony_iron">Stony-Iron (5000 kg/m³)</SelectItem>
                      <SelectItem value="iron">Iron (7800 kg/m³)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-base">Target Type</Label>
                  <Select value={targetType} onValueChange={setTargetType}>
                    <SelectTrigger className="bg-slate-900/50 border-purple-500/30 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="ocean">Ocean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200 text-base">Latitude</Label>
                    <Input
                      type="number"
                      value={latitude}
                      onChange={(e) => setLatitude(Number.parseFloat(e.target.value))}
                      min={-90}
                      max={90}
                      step={0.1}
                      className="bg-slate-900/50 border-purple-500/30 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200 text-base">Longitude</Label>
                    <Input
                      type="number"
                      value={longitude}
                      onChange={(e) => setLongitude(Number.parseFloat(e.target.value))}
                      min={-180}
                      max={180}
                      step={0.1}
                      className="bg-slate-900/50 border-purple-500/30 text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base h-12 rounded-xl animate-button-glow"
                  >
                    {isSimulating ? (
                      "Simulating..."
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Simulate Impact
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-purple-400 text-purple-300 hover:bg-purple-950/50 bg-transparent rounded-xl"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <QualitySettingsPanel settings={qualitySettings} onSettingsChange={setQualitySettings} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div ref={visualizationRef}>
              <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
                <CardContent className="p-0">
                  <ImpactVisualization
                    latitude={simulationResult?.input.latitude ?? latitude}
                    longitude={simulationResult?.input.longitude ?? longitude}
                    angle={angle}
                    diameter={diameter}
                    showAnimation={showAnimation}
                    simulationResult={simulationResult}
                    qualitySettings={qualitySettings}
                  />
                </CardContent>
              </Card>
            </div>

            {simulationResult && (
              <DamageMap
                latitude={simulationResult.input.latitude}
                longitude={simulationResult.input.longitude}
                simulationResult={simulationResult}
              />
            )}

            {simulationResult && <ImpactResults result={simulationResult} />}
          </div>
        </div>
      </main>
    </div>
  )
}

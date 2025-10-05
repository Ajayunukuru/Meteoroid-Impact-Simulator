"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { formatLargeNumber, getImpactSeverity } from "@/lib/physics-utils"
import type { SimulationResult } from "@/types/simulation"
import { AlertTriangle, Flame, Mountain, Waves, Zap, Map, MapPin } from "lucide-react"
import { ImpactMap } from "./impact-map"
import { SafetyRecommendations } from "./safety-recommendations"

interface ImpactResultsProps {
  result: SimulationResult
}

export function ImpactResults({ result }: ImpactResultsProps) {
  const severity = getImpactSeverity(result.energy.megatons_tnt)
  const [showMap, setShowMap] = useState(false)

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-950/80 to-orange-950/80 backdrop-blur-xl border-red-500/50 border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-red-400 animate-pulse" />
            Impact Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-slate-950/50 p-4 rounded-lg border border-red-500/30">
            <h3 className="text-lg font-bold text-red-400 mb-2">Location</h3>
            <p className="text-2xl font-bold text-white">{result.input.location_name || "Unknown Location"}</p>
            {result.input.country && <p className="text-lg text-slate-300 mt-1">{result.input.country}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/50 p-3 rounded-lg border border-red-500/30">
              <p className="text-sm text-slate-400">Latitude</p>
              <p className="text-xl font-bold text-white">{result.input.latitude.toFixed(4)}°N</p>
            </div>
            <div className="bg-slate-950/50 p-3 rounded-lg border border-red-500/30">
              <p className="text-sm text-slate-400">Longitude</p>
              <p className="text-xl font-bold text-white">{result.input.longitude.toFixed(4)}°E</p>
            </div>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-lg border border-red-500/30">
            <p className="text-sm text-slate-400">Target Type</p>
            <p className="text-lg font-bold text-white capitalize">{result.input.target_type}</p>
          </div>
        </CardContent>
      </Card>

      {/* Severity Alert */}
      <Alert
        className={`border-2 ${
          result.global_catastrophe
            ? "bg-red-950/50 border-red-500"
            : severity.level.includes("Extinction")
              ? "bg-red-900/50 border-red-600"
              : severity.level.includes("Continental")
                ? "bg-orange-900/50 border-orange-500"
                : "bg-yellow-900/50 border-yellow-500"
        }`}
      >
        <AlertTriangle className="h-5 w-5" />
        <AlertDescription className="text-base">
          <strong className={severity.color}>{severity.level}</strong>: {severity.description}
          {result.global_catastrophe && (
            <span className="block mt-2 text-red-300">
              This impact would cause a global extinction event with catastrophic worldwide effects.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* View Map Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowMap(!showMap)}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base rounded-xl animate-button-glow"
        >
          <Map className="mr-2 h-5 w-5" />
          {showMap ? "Hide Impact Map" : "View Impact Map"}
        </Button>
      </div>

      {/* Impact Map */}
      {showMap && <ImpactMap result={result} onClose={() => setShowMap(false)} />}

      <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="energy" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 border border-purple-500/30">
              <TabsTrigger value="energy" className="text-sm data-[state=active]:bg-purple-600">
                Energy
              </TabsTrigger>
              <TabsTrigger value="crater" className="text-sm data-[state=active]:bg-purple-600">
                Crater
              </TabsTrigger>
              <TabsTrigger value="blast" className="text-sm data-[state=active]:bg-purple-600">
                Blast
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-sm data-[state=active]:bg-purple-600">
                Effects
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-sm data-[state=active]:bg-purple-600">
                Compare
              </TabsTrigger>
            </TabsList>

            {/* Energy Tab */}
            <TabsContent value="energy" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-bold text-purple-400">Power Released</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatLargeNumber(result.energy.megatons_tnt)} MT</p>
                  <p className="text-sm text-slate-300 mt-2">
                    This is as powerful as{" "}
                    <strong>{formatLargeNumber(result.energy.megatons_tnt * 1000)} thousand tons</strong> of TNT
                    exploding at once!
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Mountain className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-purple-400">Asteroid Weight</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatLargeNumber(result.energy.mass_kg)} kg</p>
                  <p className="text-sm text-slate-300 mt-2">
                    That's about <strong>{formatLargeNumber(result.energy.mass_kg / 1000000)} million tons</strong> of
                    space rock!
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Impact Speed</h3>
                  <p className="text-2xl font-bold text-white">{result.input.velocity_km_s} km/s</p>
                  <p className="text-sm text-slate-300 mt-2">
                    That's <strong>{(result.input.velocity_km_s * 3600).toFixed(0)} km/h</strong> - way faster than any
                    rocket!
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Size</h3>
                  <p className="text-2xl font-bold text-white">{result.input.diameter_m} meters</p>
                  <p className="text-sm text-slate-300 mt-2">
                    About{" "}
                    {result.input.diameter_m > 100
                      ? `${Math.floor(result.input.diameter_m / 100)} football fields`
                      : "the size of a building"}{" "}
                    wide!
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Crater Tab */}
            <TabsContent value="crater" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Mountain className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-purple-400">Crater Size</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">{result.crater.diameter_km.toFixed(2)} km wide</p>
                  <p className="text-sm text-slate-300 mt-2">
                    The hole created would be <strong>{result.crater.diameter_m.toFixed(0)} meters</strong> across -
                    that's huge!
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Crater Depth</h3>
                  <p className="text-2xl font-bold text-white">{result.crater.depth_m.toFixed(0)} meters deep</p>
                  <p className="text-sm text-slate-300 mt-2">
                    Deep enough to bury a <strong>{Math.floor(result.crater.depth_m / 3)}-story building</strong>!
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-950/50 to-orange-950/50 p-4 rounded-lg border border-amber-500/30">
                <p className="text-slate-300 text-base leading-relaxed">
                  When the asteroid hits, it creates a massive explosion that digs a giant hole in the ground. Rocks and
                  dirt fly everywhere, creating a blanket of debris around the crater. The shape depends on the angle -
                  straight down makes a round crater, while a shallow angle makes an oval one.
                </p>
              </div>
            </TabsContent>

            {/* Blast Tab */}
            <TabsContent value="blast" className="space-y-4 mt-6">
              <div className="space-y-3">
                <div className="bg-red-950/50 p-4 rounded-lg border-2 border-red-500">
                  <h3 className="text-lg font-bold text-red-400 mb-2">Total Destruction Zone</h3>
                  <p className="text-2xl font-bold text-white">
                    Up to {result.blast.total_destruction_km.toFixed(1)} km away
                  </p>
                  <p className="text-sm text-slate-300 mt-2">
                    Everything within this distance is completely destroyed. No buildings survive. Everyone must
                    evacuate immediately!
                  </p>
                </div>

                <div className="bg-orange-950/50 p-4 rounded-lg border-2 border-orange-500">
                  <h3 className="text-lg font-bold text-orange-400 mb-2">Severe Damage Zone</h3>
                  <p className="text-2xl font-bold text-white">
                    Up to {result.blast.severe_damage_km.toFixed(1)} km away
                  </p>
                  <p className="text-sm text-slate-300 mt-2">
                    Most buildings collapse. Very dangerous! People need to hide in underground shelters.
                  </p>
                </div>

                <div className="bg-yellow-950/50 p-4 rounded-lg border-2 border-yellow-500">
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Moderate Damage Zone</h3>
                  <p className="text-2xl font-bold text-white">
                    Up to {result.blast.moderate_damage_km.toFixed(1)} km away
                  </p>
                  <p className="text-sm text-slate-300 mt-2">
                    Windows break and some walls crack. Stay inside away from windows!
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-bold text-purple-400">Fireball</h3>
                </div>
                <p className="text-2xl font-bold text-white">{result.fireball.radius_km.toFixed(2)} km radius</p>
                <p className="text-sm text-slate-300 mt-2">
                  A giant ball of fire hotter than the Sun! Everything inside turns to vapor instantly.
                </p>
              </div>
            </TabsContent>

            {/* Effects Tab */}
            <TabsContent value="effects" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Earthquake Strength</h3>
                  <p className="text-2xl font-bold text-white">{result.seismic.magnitude.toFixed(1)}</p>
                  <p className="text-sm text-slate-300 mt-2">
                    The ground shakes like a{" "}
                    {result.seismic.magnitude > 7 ? "massive" : result.seismic.magnitude > 5 ? "strong" : "moderate"}{" "}
                    earthquake!
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Heat Wave</h3>
                  <p className="text-2xl font-bold text-white">Extreme</p>
                  <p className="text-sm text-slate-300 mt-2">
                    The heat from the impact can start fires many kilometers away!
                  </p>
                </div>
              </div>

              {result.tsunami && (
                <div className="bg-blue-950/50 p-4 rounded-lg border-2 border-blue-500">
                  <div className="flex items-center gap-2 mb-3">
                    <Waves className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-blue-400">Tsunami Waves (Ocean Impact)</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-slate-400">At 10 km</p>
                      <p className="text-xl font-bold text-white">{result.tsunami.height_10km.toFixed(1)} m tall</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">At 100 km</p>
                      <p className="text-xl font-bold text-white">{result.tsunami.height_100km.toFixed(1)} m tall</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">At 500 km</p>
                      <p className="text-xl font-bold text-white">{result.tsunami.height_500km.toFixed(1)} m tall</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">At 1000 km</p>
                      <p className="text-xl font-bold text-white">{result.tsunami.height_1000km.toFixed(1)} m tall</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-3">
                    Giant waves flood coastal areas. Move to high ground immediately!
                  </p>
                </div>
              )}

              <div className="bg-gradient-to-r from-purple-950/50 to-blue-950/50 p-4 rounded-lg border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-400 mb-2">Other Effects</h3>
                <ul className="space-y-2 text-slate-300 text-base">
                  <li>• A powerful shockwave travels around the entire Earth</li>
                  <li>• Huge amounts of dust and rocks are thrown into the sky</li>
                  <li>• Wildfires can start from the extreme heat</li>
                  <li>• The ground shakes and can trigger more earthquakes</li>
                  {result.global_catastrophe && (
                    <>
                      <li className="text-red-400">• The climate changes worldwide (impact winter)</li>
                      <li className="text-red-400">• Crops fail and food becomes scarce everywhere</li>
                      <li className="text-red-400">• Many species of animals and plants go extinct</li>
                    </>
                  )}
                </ul>
              </div>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Compared to Hiroshima Bomb</h3>
                  <p className="text-2xl font-bold text-white">
                    {formatLargeNumber(result.comparisons.hiroshima_equivalent)}x stronger
                  </p>
                  <p className="text-sm text-slate-300 mt-2">
                    This impact is {formatLargeNumber(result.comparisons.hiroshima_equivalent)} times more powerful than
                    the atomic bomb dropped on Hiroshima in 1945.
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Compared to Nagasaki Bomb</h3>
                  <p className="text-2xl font-bold text-white">
                    {formatLargeNumber(result.comparisons.nagasaki_equivalent)}x stronger
                  </p>
                  <p className="text-sm text-slate-300 mt-2">
                    This impact is {formatLargeNumber(result.comparisons.nagasaki_equivalent)} times more powerful than
                    the atomic bomb dropped on Nagasaki in 1945.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-950/50 to-orange-950/50 p-4 rounded-lg border border-red-500/30">
                <h3 className="text-lg font-bold text-red-400 mb-3">Famous Impact Events</h3>
                <div className="space-y-2 text-slate-300 text-base">
                  <p>
                    <strong>Tunguska Event (1908):</strong> A space rock exploded over Siberia, flattening 2,000 square
                    kilometers of forest - that's bigger than a large city!
                  </p>
                  <p>
                    <strong>Dinosaur Extinction (66 million years ago):</strong> A massive asteroid hit Earth and caused
                    the dinosaurs to go extinct. It was one of the biggest impacts ever!
                  </p>
                  <p>
                    <strong>Largest Nuclear Test:</strong> The biggest bomb ever tested (Tsar Bomba in 1961) was 50
                    megatons.
                  </p>
                  {result.energy.megatons_tnt > 50 && (
                    <p className="text-yellow-400 mt-3">
                      This asteroid impact is even more powerful than the biggest bomb ever made!
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Safety Recommendations */}
      <SafetyRecommendations result={result} />
    </div>
  )
}

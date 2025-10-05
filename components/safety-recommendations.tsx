"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSafetyRecommendations, getSafeMigrationLocations } from "@/lib/physics-utils"
import type { SimulationResult } from "@/types/simulation"
import { Shield, MapPin, Clock, AlertTriangle } from "lucide-react"

interface SafetyRecommendationsProps {
  result: SimulationResult
}

export function SafetyRecommendations({ result }: SafetyRecommendationsProps) {
  const recommendations = getSafetyRecommendations(result.blast.moderate_damage_km)
  const migrationLocations = getSafeMigrationLocations(result.input.latitude, result.input.longitude)

  return (
    <div className="space-y-6">
      <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
            <Shield className="w-6 w-6 text-purple-400" />
            How to Stay Safe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-red-950/50 border-red-500">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-base">
              <strong>Important:</strong> If scientists predict an asteroid will hit Earth, listen to emergency
              instructions on TV and radio. Act quickly to stay safe!
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  rec.priority === "critical"
                    ? "bg-red-950/50 border-red-500"
                    : rec.priority === "high"
                      ? "bg-orange-950/50 border-orange-500"
                      : rec.priority === "medium"
                        ? "bg-yellow-950/50 border-yellow-500"
                        : "bg-blue-950/50 border-blue-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        rec.priority === "critical"
                          ? "bg-red-600"
                          : rec.priority === "high"
                            ? "bg-orange-600"
                            : rec.priority === "medium"
                              ? "bg-yellow-600"
                              : "bg-blue-600"
                      }`}
                    >
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      Within {rec.distance_km.toFixed(0)} km of impact
                    </h3>
                    <p className="text-slate-300 text-base mb-2">{rec.action}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{rec.timeframe}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
            <h3 className="text-lg font-bold text-purple-400 mb-3">Safety Tips</h3>
            <ul className="space-y-2 text-slate-300 text-base">
              <li>
                • <strong>Before Impact:</strong> Leave the danger zone if you have time
              </li>
              <li>
                • <strong>Best Shelter:</strong> Underground places like basements are safest
              </li>
              <li>
                • <strong>Supplies:</strong> Keep water, food, and medicine for at least 2 weeks
              </li>
              <li>
                • <strong>Stay Informed:</strong> Keep a battery radio to hear emergency news
              </li>
              <li>
                • <strong>After Impact:</strong> Stay inside until officials say it's safe
              </li>
              <li>
                • <strong>Dust & Debris:</strong> Don't go outside - the air is full of dangerous dust
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-400" />
            Where to Go
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-950/50 border-blue-500">
            <AlertDescription className="text-base">
              If there's warning before the asteroid hits, moving to a safe place far away is the best way to survive.
              Here are some safer locations:
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {migrationLocations.map((location, index) => (
              <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-purple-400">{location.name}</h3>
                  {location.distance_km > 0 && (
                    <span className="text-sm text-slate-400">{location.distance_km.toFixed(0)} km away</span>
                  )}
                </div>
                <p className="text-slate-300 text-base">{location.reason}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-950/50 to-blue-950/50 p-4 rounded-lg border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-400 mb-3">When to Leave</h3>
            <div className="space-y-2 text-slate-300 text-base">
              <p>
                <strong>Weeks Before:</strong> If we know weeks ahead, organize moving lots of people to the other side
                of Earth or underground shelters.
              </p>
              <p>
                <strong>Days Before:</strong> Move away from dangerous areas to places beyond the blast zone. Help
                elderly people and children first.
              </p>
              <p>
                <strong>Hours Before:</strong> Find shelter in strong buildings or underground. It's too late to travel
                far.
              </p>
              <p className="text-yellow-400 mt-3">
                <strong>Note:</strong> For very large impacts, nowhere on Earth is completely safe. Focus on having
                supplies and being prepared for long-term survival.
              </p>
            </div>
          </div>

          {result.global_catastrophe && (
            <Alert className="bg-red-950/50 border-red-500">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="text-base">
                <strong>Global Catastrophe:</strong> This impact would cause destruction worldwide. Regular evacuation
                might not be enough. Underground bunkers with many years of supplies would be needed. Countries would
                need to work together to help people survive.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

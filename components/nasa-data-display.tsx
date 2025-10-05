"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Rocket } from "lucide-react"

interface NearEarthObject {
  id: string
  name: string
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
  close_approach_data: Array<{
    relative_velocity: {
      kilometers_per_second: string
    }
    miss_distance: {
      kilometers: string
    }
  }>
  is_potentially_hazardous_asteroid: boolean
}

export function NasaDataDisplay() {
  const [neoData, setNeoData] = useState<NearEarthObject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchNeoData() {
      try {
        const response = await fetch("/api/nasa/neo")
        const data = await response.json()

        if (data.near_earth_objects) {
          // Check if it's already an array (fallback data)
          if (Array.isArray(data.near_earth_objects)) {
            setNeoData(data.near_earth_objects)
          } else {
            // It's an object with dates as keys (real NASA API)
            // Flatten all date arrays into a single array
            const allNeos: NearEarthObject[] = []
            for (const date in data.near_earth_objects) {
              allNeos.push(...data.near_earth_objects[date])
            }
            setNeoData(allNeos)
          }
        } else {
          setError("No data available")
        }
      } catch (err) {
        console.error("[v0] Error fetching NEO data:", err)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchNeoData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        <h3 className="text-2xl font-bold text-foreground">Near-Earth Objects (Live NASA Data)</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {neoData.slice(0, 4).map((neo) => {
          const avgDiameter =
            (neo.estimated_diameter.kilometers.estimated_diameter_min +
              neo.estimated_diameter.kilometers.estimated_diameter_max) /
            2
          const velocity = neo.close_approach_data[0]?.relative_velocity.kilometers_per_second || "N/A"
          const distance = neo.close_approach_data[0]?.miss_distance.kilometers || "N/A"

          return (
            <Card
              key={neo.id}
              className="bg-card/80 backdrop-blur-sm border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-foreground">{neo.name}</CardTitle>
                  {neo.is_potentially_hazardous_asteroid && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Hazardous
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-muted-foreground">ID: {neo.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diameter:</span>
                  <span className="font-medium text-foreground">{avgDiameter.toFixed(2)} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Velocity:</span>
                  <span className="font-medium text-foreground">{velocity} km/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miss Distance:</span>
                  <span className="font-medium text-foreground">
                    {typeof distance === "string" ? Number.parseInt(distance).toLocaleString() : distance} km
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

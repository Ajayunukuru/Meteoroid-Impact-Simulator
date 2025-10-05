"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface ApodData {
  title: string
  explanation: string
  url: string
  media_type: string
  date: string
}

export function NasaApod() {
  const [apod, setApod] = useState<ApodData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApod() {
      try {
        const response = await fetch("/api/nasa/apod")
        const data = await response.json()
        setApod(data)
      } catch (err) {
        console.error("[v0] Error fetching APOD:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchApod()
  }, [])

  if (loading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!apod) {
    return null
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-purple-200 dark:border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">{apod.title}</CardTitle>
        <CardDescription className="text-muted-foreground">{apod.date}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apod.media_type === "image" && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <Image src={apod.url || "/placeholder.svg"} alt={apod.title} fill className="object-cover" />
          </div>
        )}
        <p className="text-muted-foreground leading-relaxed">{apod.explanation}</p>
      </CardContent>
    </Card>
  )
}

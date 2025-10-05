import { type NextRequest, NextResponse } from "next/server"

// Fallback data when NASA API is unavailable
const FALLBACK_APOD_DATA = {
  title: "Asteroid Impact Visualization",
  explanation:
    "This stunning visualization shows what happens when an asteroid enters Earth's atmosphere. The intense friction causes the object to heat up, creating a brilliant fireball visible from hundreds of kilometers away. The impact can release energy equivalent to millions of tons of TNT, creating massive craters and devastating shockwaves.",
  url: "/asteroid-impact-explosion-fireball.jpg",
  media_type: "image",
  date: new Date().toISOString().split("T")[0],
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY"

    console.log("[v0] Fetching NASA APOD data...")

    try {
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("NASA APOD API request failed")
      }

      const data = await response.json()
      console.log("[v0] NASA APOD data fetched successfully")

      return NextResponse.json(data)
    } catch (apiError) {
      console.log("[v0] NASA APOD API unavailable, using fallback data")
      return NextResponse.json(FALLBACK_APOD_DATA)
    }
  } catch (error) {
    console.error("[v0] NASA APOD API error:", error)
    return NextResponse.json(FALLBACK_APOD_DATA)
  }
}

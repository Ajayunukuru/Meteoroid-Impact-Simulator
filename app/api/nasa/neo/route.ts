import { type NextRequest, NextResponse } from "next/server"

// Fallback data when NASA API is unavailable
const FALLBACK_NEO_DATA = {
  near_earth_objects: [
    {
      id: "2021277",
      name: "277 Elvira",
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 40.5,
          estimated_diameter_max: 90.6,
        },
      },
      close_approach_data: [
        {
          relative_velocity: {
            kilometers_per_second: "19.12",
          },
          miss_distance: {
            kilometers: "45000000",
          },
        },
      ],
      is_potentially_hazardous_asteroid: false,
    },
    {
      id: "433",
      name: "433 Eros",
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 16.84,
          estimated_diameter_max: 37.66,
        },
      },
      close_approach_data: [
        {
          relative_velocity: {
            kilometers_per_second: "23.45",
          },
          miss_distance: {
            kilometers: "22000000",
          },
        },
      ],
      is_potentially_hazardous_asteroid: true,
    },
    {
      id: "99942",
      name: "99942 Apophis",
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 0.34,
          estimated_diameter_max: 0.76,
        },
      },
      close_approach_data: [
        {
          relative_velocity: {
            kilometers_per_second: "7.42",
          },
          miss_distance: {
            kilometers: "31000",
          },
        },
      ],
      is_potentially_hazardous_asteroid: true,
    },
    {
      id: "101955",
      name: "101955 Bennu",
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 0.49,
          estimated_diameter_max: 1.09,
        },
      },
      close_approach_data: [
        {
          relative_velocity: {
            kilometers_per_second: "28.6",
          },
          miss_distance: {
            kilometers: "480000",
          },
        },
      ],
      is_potentially_hazardous_asteroid: true,
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("start_date") || new Date().toISOString().split("T")[0]
    const endDate = searchParams.get("end_date") || new Date().toISOString().split("T")[0]

    // NASA API key (optional - NASA has a DEMO_KEY with rate limits)
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY"

    console.log("[v0] Fetching NASA NEO data...")

    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error("NASA API request failed")
      }

      const data = await response.json()
      console.log("[v0] NASA API data fetched successfully")

      return NextResponse.json(data)
    } catch (apiError) {
      console.log("[v0] NASA API unavailable, using fallback data")
      return NextResponse.json(FALLBACK_NEO_DATA)
    }
  } catch (error) {
    console.error("[v0] NASA API error:", error)
    return NextResponse.json(FALLBACK_NEO_DATA)
  }
}

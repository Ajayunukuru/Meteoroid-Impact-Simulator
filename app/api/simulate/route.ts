import { type NextRequest, NextResponse } from "next/server"
import { calculateImpactEffects, type ImpactParameters } from "@/lib/physics-calculations"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting simulation...")
    const data = await request.json()
    console.log("[v0] Received data:", data)

    // Validate required fields
    const requiredFields = ["diameter", "density", "velocity", "angle"]
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        console.log(`[v0] Missing field: ${field}`)
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const params: ImpactParameters = {
      diameter: Number(data.diameter),
      density: Number(data.density),
      velocity: Number(data.velocity),
      angle: Number(data.angle),
      latitude: Number(data.latitude) || 0,
      longitude: Number(data.longitude) || 0,
      target_type: (data.targetType || "land") as "land" | "ocean",
    }

    console.log("[v0] Calculating impact effects...")
    const result = calculateImpactEffects(params)
    console.log("[v0] Calculation complete:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Simulation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

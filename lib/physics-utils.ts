/**
 * Utility functions for physics calculations and formatting
 */

export function formatScientific(value: number, decimals = 2): string {
  if (value === 0) return "0"
  if (value < 0.01 || value > 1e6) {
    return value.toExponential(decimals)
  }
  return value.toFixed(decimals)
}

export function formatLargeNumber(value: number): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)} trillion`
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)} billion`
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)} million`
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)} thousand`
  }
  return value.toFixed(2)
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`
  }
  return `${meters.toFixed(2)} m`
}

export function formatEnergy(joules: number): string {
  const megatons = joules / 4.184e15
  if (megatons >= 1e6) {
    return `${(megatons / 1e6).toFixed(2)} million MT`
  } else if (megatons >= 1e3) {
    return `${(megatons / 1e3).toFixed(2)} thousand MT`
  } else if (megatons >= 1) {
    return `${megatons.toFixed(2)} MT`
  } else {
    const kilotons = megatons * 1000
    return `${kilotons.toFixed(2)} KT`
  }
}

export function getImpactSeverity(megatons: number): {
  level: string
  color: string
  description: string
} {
  if (megatons >= 1e6) {
    return {
      level: "Extinction Event",
      color: "text-red-500",
      description: "Global catastrophe, mass extinction",
    }
  } else if (megatons >= 1e5) {
    return {
      level: "Continental Devastation",
      color: "text-orange-500",
      description: "Continent-wide destruction, climate effects",
    }
  } else if (megatons >= 1e4) {
    return {
      level: "Regional Catastrophe",
      color: "text-yellow-500",
      description: "Regional destruction, significant casualties",
    }
  } else if (megatons >= 1e3) {
    return {
      level: "Major Impact",
      color: "text-yellow-400",
      description: "City-scale destruction",
    }
  } else if (megatons >= 1) {
    return {
      level: "Significant Impact",
      color: "text-blue-400",
      description: "Local destruction, casualties likely",
    }
  } else {
    return {
      level: "Minor Impact",
      color: "text-green-400",
      description: "Limited damage, mostly atmospheric",
    }
  }
}

export function getCraterComparison(diameter_km: number): string {
  if (diameter_km >= 300) {
    return "Larger than Chicxulub crater (dinosaur extinction)"
  } else if (diameter_km >= 100) {
    return "Similar to Vredefort crater (South Africa)"
  } else if (diameter_km >= 50) {
    return "Similar to Manicouagan crater (Canada)"
  } else if (diameter_km >= 10) {
    return "Similar to Barringer crater (Arizona)"
  } else if (diameter_km >= 1) {
    return "Larger than most recent impact craters"
  } else {
    return "Small crater, similar to meteor impacts"
  }
}

export function getCompositionDensity(composition: string): number {
  const densities: Record<string, number> = {
    ice: 917,
    stone: 3000,
    iron: 7800,
    carbonaceous: 2000,
    stony_iron: 5000,
  }
  return densities[composition] || 3000
}

export function getCompositionDescription(composition: string): string {
  const descriptions: Record<string, string> = {
    ice: "Icy composition (comets, volatile-rich)",
    stone: "Rocky composition (most common asteroids)",
    iron: "Metallic composition (dense, penetrates deeper)",
    carbonaceous: "Carbon-rich composition (primitive material)",
    stony_iron: "Mixed rock and metal composition",
  }
  return descriptions[composition] || "Rocky composition"
}

export interface SafetyRecommendation {
  distance_km: number
  action: string
  timeframe: string
  priority: "critical" | "high" | "medium" | "low"
}

export function getSafetyRecommendations(blast_radius_km: number): SafetyRecommendation[] {
  const recommendations: SafetyRecommendation[] = []

  // Total destruction zone
  recommendations.push({
    distance_km: blast_radius_km * 0.3,
    action: "Immediate evacuation required - unsurvivable zone",
    timeframe: "Evacuate weeks in advance if possible",
    priority: "critical",
  })

  // Severe damage zone
  recommendations.push({
    distance_km: blast_radius_km * 0.6,
    action: "Seek underground shelter, evacuate if time permits",
    timeframe: "Evacuate days in advance",
    priority: "critical",
  })

  // Moderate damage zone
  recommendations.push({
    distance_km: blast_radius_km,
    action: "Take shelter in reinforced buildings, away from windows",
    timeframe: "Shelter in place hours before impact",
    priority: "high",
  })

  // Light damage zone
  recommendations.push({
    distance_km: blast_radius_km * 2,
    action: "Stay indoors, protect from flying debris and glass",
    timeframe: "Shelter 30 minutes before impact",
    priority: "medium",
  })

  return recommendations
}

export function getSafeMigrationLocations(
  impact_lat: number,
  impact_lon: number,
): Array<{
  name: string
  reason: string
  distance_km: number
}> {
  // This is a simplified version - in reality, you'd calculate actual distances
  return [
    {
      name: "Underground bunkers (if available)",
      reason: "Best protection from blast, heat, and radiation",
      distance_km: 0,
    },
    {
      name: "Opposite hemisphere",
      reason: "Maximum distance from impact site",
      distance_km: 12000,
    },
    {
      name: "Mountain ranges (far from impact)",
      reason: "Natural barriers against blast waves",
      distance_km: 5000,
    },
    {
      name: "Inland areas (if ocean impact)",
      reason: "Protection from tsunamis",
      distance_km: 1000,
    },
  ]
}

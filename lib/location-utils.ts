/**
 * Utility functions for calculating impact locations and getting location names
 */

export interface ImpactLocation {
  latitude: number
  longitude: number
  locationName: string
  country: string
  ocean: boolean
}

/**
 * Calculate the actual impact location based on trajectory parameters
 * This simulates where the asteroid will hit based on its angle and approach direction
 */
export function calculateImpactLocation(
  initialLat: number,
  initialLon: number,
  angle: number,
  velocity: number,
  diameter: number,
): { latitude: number; longitude: number } {
  // Use angle and velocity to calculate trajectory offset
  // Lower angles cause the asteroid to travel further horizontally before impact
  const angleRad = (angle * Math.PI) / 180

  // Calculate horizontal distance traveled (in degrees)
  // Steeper angles (closer to 90°) = less horizontal travel
  // Shallower angles (closer to 15°) = more horizontal travel
  const horizontalFactor = Math.cos(angleRad) * (velocity / 50) * (diameter / 100)

  // Add some randomness based on the parameters to create variation
  const seed = (angle * velocity * diameter) % 360
  const latOffset = Math.sin(seed) * horizontalFactor * 10
  const lonOffset = Math.cos(seed) * horizontalFactor * 10

  // Calculate new position
  let newLat = initialLat + latOffset
  let newLon = initialLon + lonOffset

  // Clamp latitude to valid range
  newLat = Math.max(-90, Math.min(90, newLat))

  // Wrap longitude
  while (newLon > 180) newLon -= 360
  while (newLon < -180) newLon += 360

  return { latitude: newLat, longitude: newLon }
}

/**
 * Get location name from coordinates
 * This is a simplified version - in production you'd use a reverse geocoding API
 */
export function getLocationName(latitude: number, longitude: number): ImpactLocation {
  // Major cities and their approximate coordinates
  const cities = [
    { name: "New York", country: "USA", lat: 40.7128, lon: -74.006, ocean: false },
    { name: "London", country: "UK", lat: 51.5074, lon: -0.1278, ocean: false },
    { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, ocean: false },
    { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522, ocean: false },
    { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, ocean: false },
    { name: "Mumbai", country: "India", lat: 19.076, lon: 72.8777, ocean: false },
    { name: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333, ocean: false },
    { name: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357, ocean: false },
    { name: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173, ocean: false },
    { name: "Beijing", country: "China", lat: 39.9042, lon: 116.4074, ocean: false },
    { name: "Los Angeles", country: "USA", lat: 34.0522, lon: -118.2437, ocean: false },
    { name: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332, ocean: false },
    { name: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792, ocean: false },
    { name: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784, ocean: false },
    { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816, ocean: false },
  ]

  // Ocean regions
  const oceans = [
    { name: "Pacific Ocean", lat: 0, lon: -140, radius: 80 },
    { name: "Atlantic Ocean", lat: 0, lon: -30, radius: 50 },
    { name: "Indian Ocean", lat: -20, lon: 80, radius: 40 },
    { name: "Arctic Ocean", lat: 80, lon: 0, radius: 30 },
    { name: "Southern Ocean", lat: -60, lon: 0, radius: 30 },
  ]

  // Find nearest city
  let nearestCity = cities[0]
  let minDistance = Number.MAX_VALUE

  for (const city of cities) {
    const distance = Math.sqrt(Math.pow(latitude - city.lat, 2) + Math.pow(longitude - city.lon, 2))
    if (distance < minDistance) {
      minDistance = distance
      nearestCity = city
    }
  }

  // Check if in ocean (far from any city)
  if (minDistance > 20) {
    // Find nearest ocean
    for (const ocean of oceans) {
      const distance = Math.sqrt(Math.pow(latitude - ocean.lat, 2) + Math.pow(longitude - ocean.lon, 2))
      if (distance < ocean.radius) {
        return {
          latitude,
          longitude,
          locationName: ocean.name,
          country: "",
          ocean: true,
        }
      }
    }

    // Default to generic ocean
    return {
      latitude,
      longitude,
      locationName: "Open Ocean",
      country: "",
      ocean: true,
    }
  }

  // Near a city
  const direction = getDirection(latitude, longitude, nearestCity.lat, nearestCity.lon)
  const distanceKm = minDistance * 111 // Rough conversion to km

  if (distanceKm < 50) {
    return {
      latitude,
      longitude,
      locationName: nearestCity.name,
      country: nearestCity.country,
      ocean: false,
    }
  } else {
    return {
      latitude,
      longitude,
      locationName: `${Math.round(distanceKm)} km ${direction} of ${nearestCity.name}`,
      country: nearestCity.country,
      ocean: false,
    }
  }
}

function getDirection(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const dLat = lat2 - lat1
  const dLon = lon2 - lon1

  const angle = Math.atan2(dLon, dLat) * (180 / Math.PI)

  if (angle >= -22.5 && angle < 22.5) return "north"
  if (angle >= 22.5 && angle < 67.5) return "northeast"
  if (angle >= 67.5 && angle < 112.5) return "east"
  if (angle >= 112.5 && angle < 157.5) return "southeast"
  if (angle >= 157.5 || angle < -157.5) return "south"
  if (angle >= -157.5 && angle < -112.5) return "southwest"
  if (angle >= -112.5 && angle < -67.5) return "west"
  return "northwest"
}

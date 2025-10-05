/**
 * Comprehensive physics calculations for asteroid impact simulation
 * Based on scientific models and empirical data
 */

import type { SimulationResult } from "@/types/simulation"
import { getLocationName } from "./location-utils"

export interface ImpactParameters {
  diameter: number // meters
  density: number // kg/m³
  velocity: number // km/s
  angle: number // degrees from horizontal
  latitude: number
  longitude: number
  target_type?: "land" | "ocean"
}

export function calculateImpactEffects(params: ImpactParameters): SimulationResult {
  const { diameter, density, velocity, angle, latitude, longitude, target_type = "land" } = params

  // Convert units
  const radius_m = diameter / 2
  const velocity_ms = velocity * 1000
  const angle_rad = (angle * Math.PI) / 180

  // 1. Calculate mass
  const volume_m3 = (4 / 3) * Math.PI * Math.pow(radius_m, 3)
  const mass_kg = volume_m3 * density

  // 2. Calculate kinetic energy
  const kinetic_energy_joules = 0.5 * mass_kg * Math.pow(velocity_ms, 2)

  // 3. Convert to TNT equivalent (1 megaton = 4.184 × 10^15 joules)
  const tnt_equivalent_megatons = kinetic_energy_joules / 4.184e15

  // 4. Calculate crater dimensions (using scaling laws)
  const angle_factor = Math.pow(Math.sin(angle_rad), 1 / 3)
  const energy_factor = Math.pow(kinetic_energy_joules, 0.26)
  const crater_diameter_m = (1.8 * energy_factor * angle_factor) / Math.pow(density, 0.33)
  const crater_diameter_km = crater_diameter_m / 1000
  const crater_depth_km = crater_diameter_km * 0.25
  const crater_volume_km3 = (Math.PI / 3) * Math.pow(crater_diameter_km / 2, 2) * crater_depth_km

  // 5. Calculate fireball radius
  const fireball_radius_km = 0.28 * Math.pow(tnt_equivalent_megatons, 0.4)

  // 6. Calculate blast radii at different overpressures
  const blast_radius_20psi_km = 0.28 * Math.pow(tnt_equivalent_megatons, 0.33)
  const blast_radius_5psi_km = 0.54 * Math.pow(tnt_equivalent_megatons, 0.4)
  const blast_radius_1psi_km = 1.0 * Math.pow(tnt_equivalent_megatons, 0.47)

  // 7. Calculate seismic magnitude
  const seismic_magnitude = (2 / 3) * Math.log10(kinetic_energy_joules) - 4.8

  // 8. Calculate thermal radiation
  const thermal_flux_1km = (1e8 * Math.pow(tnt_equivalent_megatons, 0.5)) / Math.pow(1, 2)
  const thermal_flux_10km = (1e8 * Math.pow(tnt_equivalent_megatons, 0.5)) / Math.pow(10, 2)
  const thermal_flux_100km = (1e8 * Math.pow(tnt_equivalent_megatons, 0.5)) / Math.pow(100, 2)

  // 9. Comparisons
  const hiroshima_equivalent = tnt_equivalent_megatons / 0.015 // Hiroshima was ~15 kilotons
  const nagasaki_equivalent = tnt_equivalent_megatons / 0.021 // Nagasaki was ~21 kilotons

  // 10. Determine if global catastrophe
  const global_catastrophe = tnt_equivalent_megatons >= 1e6

  const locationInfo = getLocationName(latitude, longitude)
  const actualTargetType = locationInfo.ocean ? "ocean" : "land"

  const result: SimulationResult = {
    input: {
      diameter_m: diameter,
      density_kg_m3: density,
      velocity_km_s: velocity,
      angle_deg: angle,
      composition:
        density === 917
          ? "ice"
          : density === 2000
            ? "carbonaceous"
            : density === 3000
              ? "stone"
              : density === 5000
                ? "stony_iron"
                : "iron",
      target_type: actualTargetType,
      latitude: latitude,
      longitude: longitude,
      location_name: locationInfo.locationName,
      country: locationInfo.country,
    },
    energy: {
      mass_kg: mass_kg,
      kinetic_energy_j: kinetic_energy_joules,
      megatons_tnt: tnt_equivalent_megatons,
    },
    crater: {
      diameter_m: crater_diameter_m,
      diameter_km: crater_diameter_km,
      depth_m: crater_depth_km * 1000,
      volume_m3: crater_volume_km3 * 1e9,
    },
    fireball: {
      radius_m: fireball_radius_km * 1000,
      radius_km: fireball_radius_km,
    },
    blast: {
      total_destruction_m: blast_radius_20psi_km * 1000,
      total_destruction_km: blast_radius_20psi_km,
      severe_damage_m: blast_radius_5psi_km * 1000,
      severe_damage_km: blast_radius_5psi_km,
      moderate_damage_m: blast_radius_1psi_km * 1000,
      moderate_damage_km: blast_radius_1psi_km,
    },
    seismic: {
      magnitude: seismic_magnitude,
    },
    thermal: {
      flux_1km_j_m2: thermal_flux_1km,
      flux_10km_j_m2: thermal_flux_10km,
      flux_100km_j_m2: thermal_flux_100km,
    },
    tsunami: null,
    comparisons: {
      hiroshima_equivalent: hiroshima_equivalent,
      nagasaki_equivalent: nagasaki_equivalent,
    },
    global_catastrophe: global_catastrophe,
  }

  if (actualTargetType === "ocean") {
    const tsunami_height_10km = (10 * Math.pow(tnt_equivalent_megatons, 0.5)) / Math.pow(10, 0.5)
    const tsunami_height_100km = (10 * Math.pow(tnt_equivalent_megatons, 0.5)) / Math.pow(100, 0.5)
    const tsunami_height_500km = (10 * Math.pow(tnt_equivalent_megatons, 0.5)) / Math.pow(500, 0.5)
    const tsunami_height_1000km = (10 * Math.pow(tnt_equivalent_megatons, 0.5)) / Math.pow(1000, 0.5)

    result.tsunami = {
      height_10km: tsunami_height_10km,
      height_100km: tsunami_height_100km,
      height_500km: tsunami_height_500km,
      height_1000km: tsunami_height_1000km,
    }
  }

  return result
}

export interface SimulationResult {
  input: {
    diameter_m: number
    density_kg_m3: number
    velocity_km_s: number
    angle_deg: number
    composition: string
    target_type: string
    latitude: number
    longitude: number
    location_name?: string
    country?: string
  }
  energy: {
    mass_kg: number
    kinetic_energy_j: number
    megatons_tnt: number
  }
  crater: {
    diameter_m: number
    diameter_km: number
    depth_m: number
    volume_m3: number
  }
  fireball: {
    radius_m: number
    radius_km: number
  }
  blast: {
    total_destruction_m: number
    total_destruction_km: number
    severe_damage_m: number
    severe_damage_km: number
    moderate_damage_m: number
    moderate_damage_km: number
  }
  seismic: {
    magnitude: number
  }
  thermal: {
    flux_1km_j_m2: number
    flux_10km_j_m2: number
    flux_100km_j_m2: number
  }
  tsunami: {
    height_10km: number
    height_100km: number
    height_500km: number
    height_1000km: number
  } | null
  comparisons: {
    hiroshima_equivalent: number
    nagasaki_equivalent: number
  }
  global_catastrophe: boolean
}

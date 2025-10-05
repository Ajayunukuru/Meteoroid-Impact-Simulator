# Asteroid Impact Physics Engine Documentation

## Overview

This physics engine calculates the effects of asteroid impacts on Earth using empirically-derived scaling laws and scientific models.

## Input Parameters

### Required Parameters

- **diameter_m**: Asteroid diameter in meters (> 0)
- **density_kg_m3**: Material density in kg/m³ (typical: 2000-8000)
- **velocity_km_s**: Impact velocity in km/s (typical: 11-72)
- **angle_deg**: Impact angle from horizontal (0-90 degrees)

### Optional Parameters

- **composition**: Material type (ice, stone, iron, carbonaceous, stony_iron)
- **targetType**: Impact location (land, ocean)
- **latitude**: Impact latitude (-90 to 90)
- **longitude**: Impact longitude (-180 to 180)

## Calculations

### 1. Mass Calculation

\`\`\`
mass = (4/3) × π × r³ × density
\`\`\`

Where r is the radius (diameter/2).

### 2. Kinetic Energy

\`\`\`
KE = 0.5 × mass × velocity²
\`\`\`

Converted to megatons of TNT equivalent:
\`\`\`
1 megaton = 4.184 × 10¹⁵ joules
\`\`\`

### 3. Crater Dimensions

**Diameter**: Based on scaling law
\`\`\`
D = k × E^0.25 × sin(angle) × target_factor
\`\`\`

**Depth**: Proportional to diameter
\`\`\`
depth = diameter × (0.15 to 0.20)
\`\`\`

Steeper angles create deeper craters.

### 4. Fireball Radius

\`\`\`
R_fireball = 440 × MT^0.4 meters
\`\`\`

### 5. Blast Radius

Calculated for different overpressure levels:
- **20 psi**: Total destruction
- **5 psi**: Severe structural damage
- **1 psi**: Window breakage

\`\`\`
R_blast = k × MT^0.33 kilometers
\`\`\`

### 6. Seismic Effects

Richter magnitude using Gutenberg-Richter relation:
\`\`\`
M = (2/3) × log₁₀(E) - 10.7
\`\`\`

### 7. Thermal Radiation

Energy flux at distance d:
\`\`\`
flux = (0.35 × E) / (4π × d²) J/m²
\`\`\`

Approximately 35% of impact energy is released as thermal radiation.

### 8. Tsunami (Ocean Impacts)

Initial wave height:
\`\`\`
h₀ = 10 × √MT meters
\`\`\`

Height at distance:
\`\`\`
h(d) = h₀ × exp(-d / decay_length)
\`\`\`

### 9. Global Catastrophe Threshold

Impacts exceeding 1 million megatons (approximately 1 km diameter at 20 km/s) are classified as global catastrophes.

## Output Structure

\`\`\`json
{
  "input": { ... },
  "energy": {
    "mass_kg": number,
    "kinetic_energy_j": number,
    "megatons_tnt": number
  },
  "crater": {
    "diameter_m": number,
    "diameter_km": number,
    "depth_m": number,
    "volume_m3": number
  },
  "fireball": {
    "radius_m": number,
    "radius_km": number
  },
  "blast": {
    "total_destruction_km": number,
    "severe_damage_km": number,
    "moderate_damage_km": number
  },
  "seismic": {
    "magnitude": number
  },
  "thermal": {
    "flux_1km_j_m2": number,
    "flux_10km_j_m2": number,
    "flux_100km_j_m2": number
  },
  "tsunami": { ... } | null,
  "comparisons": {
    "hiroshima_equivalent": number,
    "nagasaki_equivalent": number
  },
  "global_catastrophe": boolean
}
\`\`\`

## Scientific References

1. Collins et al. (2005) - "Earth Impact Effects Program"
2. Melosh (1989) - "Impact Cratering: A Geologic Process"
3. Glasstone & Dolan (1977) - "The Effects of Nuclear Weapons"
4. Hills & Goda (1993) - "Tsunami generation by asteroid impacts"

## Limitations

- Simplified models for educational purposes
- Does not account for atmospheric entry effects for small objects
- Tsunami model is approximate
- Does not include long-term climate effects
- Crater scaling laws are empirical approximations

## Example Usage

### Small Impact (Tunguska-like)
\`\`\`json
{
  "diameter": 50,
  "density": 3000,
  "velocity": 15,
  "angle": 45
}
\`\`\`

### Large Impact (Chicxulub-like)
\`\`\`json
{
  "diameter": 10000,
  "density": 3000,
  "velocity": 20,
  "angle": 60
}
\`\`\`
\`\`\`

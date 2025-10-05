"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Stars, Trail, Html } from "@react-three/drei"
import * as THREE from "three"
import type { SimulationResult } from "@/types/simulation"
import type { QualitySettings } from "@/components/quality-settings"

interface EarthProps {
  impactLat: number
  impactLon: number
  showImpact: boolean
  onTextureLoaded?: () => void
  detail: number
}

function Earth({ impactLat, impactLon, showImpact, onTextureLoaded, detail }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const impactPositionRef = useRef<THREE.Vector3>(new THREE.Vector3())

  const earthTexture = useLoader(
    THREE.TextureLoader,
    "/realistic-earth-map-with-continents-and-oceans-blu.jpg",
    undefined,
    undefined,
  )

  useEffect(() => {
    if (earthTexture && onTextureLoaded) {
      onTextureLoaded()
    }
  }, [earthTexture, onTextureLoaded])

  useEffect(() => {
    const phi = (90 - impactLat) * (Math.PI / 180)
    const theta = (impactLon + 180) * (Math.PI / 180)
    const radius = 2

    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    impactPositionRef.current.set(x, y, z)
  }, [impactLat, impactLon])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0005
    }
  })

  return (
    <group>
      {/* Main Earth sphere with enhanced materials */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, detail, detail]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
          emissive="#1a2332"
          emissiveIntensity={0.15}
        />
      </mesh>

      <mesh ref={atmosphereRef} scale={1.02}>
        <sphereGeometry args={[2, detail, detail]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh scale={1.05}>
        <sphereGeometry args={[2, detail, detail]} />
        <meshBasicMaterial
          color="#6bb6ff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh rotation={[0, Math.PI / 4, 0]}>
        <sphereGeometry args={[2.01, detail, detail]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} roughness={1} metalness={0} />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.005, detail, detail]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>

      {showImpact && (
        <>
          <mesh position={[impactPositionRef.current.x, impactPositionRef.current.y, impactPositionRef.current.z]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>

          {/* Impact ring */}
          <mesh position={[impactPositionRef.current.x, impactPositionRef.current.y, impactPositionRef.current.z]}>
            <ringGeometry args={[0.09, 0.14, 32]} />
            <meshBasicMaterial color="#ff3333" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>

          {/* Outer impact ring */}
          <mesh position={[impactPositionRef.current.x, impactPositionRef.current.y, impactPositionRef.current.z]}>
            <ringGeometry args={[0.16, 0.2, 32]} />
            <meshBasicMaterial color="#ff6666" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>

          <pointLight
            position={[impactPositionRef.current.x, impactPositionRef.current.y, impactPositionRef.current.z]}
            color="#ff0000"
            intensity={3}
            distance={1.5}
          />
        </>
      )}

      <LocationMarkers />
    </group>
  )
}

function LocationMarkers() {
  const locations = [
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  ]

  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)
    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)
    return new THREE.Vector3(x, y, z)
  }

  return (
    <>
      {locations.map((location, index) => {
        const position = latLonToVector3(location.lat, location.lon, 2.02)
        return (
          <group key={index} position={[position.x, position.y, position.z]}>
            {/* City marker */}
            <mesh>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>

            {/* City label */}
            <Html position={[0, 0.1, 0]} center distanceFactor={6}>
              <div className="bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono border border-cyan-400/50 whitespace-nowrap pointer-events-none">
                {location.name}
              </div>
            </Html>
          </group>
        )
      })}
    </>
  )
}

interface AsteroidProps {
  diameter: number
  angle: number
  impactLat: number
  impactLon: number
  animate: boolean
  onImpact: () => void
  enableParticles: boolean
}

function Asteroid({ diameter, angle, impactLat, impactLon, animate, onImpact, enableParticles }: AsteroidProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [position, setPosition] = useState<[number, number, number]>([10, 10, 10])
  const targetPositionRef = useRef<THREE.Vector3>(new THREE.Vector3())
  const startPositionRef = useRef<THREE.Vector3>(new THREE.Vector3())
  const currentPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(10, 10, 10))
  const hasImpactedRef = useRef(false)

  useEffect(() => {
    const phi = (90 - impactLat) * (Math.PI / 180)
    const theta = (impactLon + 180) * (Math.PI / 180)
    const radius = 2

    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    targetPositionRef.current.set(x, y, z)

    const distance = 8
    const angleRad = angle * (Math.PI / 180)
    const startX = x - distance * Math.cos(angleRad)
    const startY = y + distance * Math.sin(angleRad)
    const startZ = z

    startPositionRef.current.set(startX, startY, startZ)
    currentPositionRef.current.set(startX, startY, startZ)
    setPosition([startX, startY, startZ])

    hasImpactedRef.current = false
  }, [impactLat, impactLon, angle])

  useFrame(() => {
    if (animate && !hasImpactedRef.current) {
      const direction = new THREE.Vector3()
        .subVectors(targetPositionRef.current, currentPositionRef.current)
        .normalize()
      const speed = 0.05

      currentPositionRef.current.add(direction.multiplyScalar(speed))
      setPosition([currentPositionRef.current.x, currentPositionRef.current.y, currentPositionRef.current.z])

      if (currentPositionRef.current.distanceTo(targetPositionRef.current) < 0.2) {
        hasImpactedRef.current = true
        onImpact()
      }
    }
  })

  const scale = Math.max(0.05, Math.min(0.3, diameter / 1000))

  return (
    <>
      {/* Trajectory line */}
      <TrajectoryLine startPos={startPositionRef.current} endPos={targetPositionRef.current} show={animate} />

      {/* Angle indicator at entry point */}
      <AngleIndicator position={targetPositionRef.current} angle={angle} show={animate} />

      {enableParticles ? (
        <Trail width={3} length={12} color="#ff6600" attenuation={(t) => t * t}>
          <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[scale, 16, 16]} />
            <meshStandardMaterial color="#8b4513" roughness={0.9} emissive="#ff4400" emissiveIntensity={0.5} />
          </mesh>
        </Trail>
      ) : (
        <mesh ref={meshRef} position={position}>
          <sphereGeometry args={[scale, 16, 16]} />
          <meshStandardMaterial color="#8b4513" roughness={0.9} emissive="#ff4400" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* Glow effect around asteroid */}
      {animate && enableParticles && (
        <mesh position={position}>
          <sphereGeometry args={[scale * 1.5, 16, 16]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.3} />
        </mesh>
      )}
    </>
  )
}

interface TrajectoryLineProps {
  startPos: THREE.Vector3
  endPos: THREE.Vector3
  show: boolean
}

function TrajectoryLine({ startPos, endPos, show }: TrajectoryLineProps) {
  const lineRef = useRef<THREE.Line>(null)
  const [dashOffset, setDashOffset] = useState(0)

  useFrame(() => {
    if (lineRef.current && show) {
      const material = lineRef.current.material as THREE.LineDashedMaterial
      material.dashOffset = dashOffset
      setDashOffset((prev) => prev - 0.02)
    }
  })

  if (!show) return null

  const points = []
  points.push(startPos)
  points.push(endPos)

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineDashedMaterial color="#00ffff" dashSize={0.2} gapSize={0.1} linewidth={2} transparent opacity={0.6} />
    </line>
  )
}

interface AngleIndicatorProps {
  position: THREE.Vector3
  angle: number
  show: boolean
}

function AngleIndicator({ position, angle, show }: AngleIndicatorProps) {
  if (!show) return null

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Angle arc */}
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.02, 16, 32, (angle * Math.PI) / 180]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.8} />
      </mesh>

      {/* Angle label */}
      <Html position={[0.4, 0.2, 0]} center distanceFactor={8}>
        <div className="bg-black/80 text-yellow-400 px-2 py-1 rounded text-xs font-mono border border-yellow-400/50 whitespace-nowrap">
          Entry: {angle}°
        </div>
      </Html>

      {/* Direction arrow */}
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, -(angle * Math.PI) / 180]}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
    </group>
  )
}

interface ImpactEffectProps {
  position: THREE.Vector3
  show: boolean
  simulationResult: SimulationResult | null
  enableParticles: boolean
}

function ImpactEffect({ position, show, simulationResult, enableParticles }: ImpactEffectProps) {
  const [stage, setStage] = useState(0) // 0: flash, 1: shockwave, 2: ejecta, 3: crater
  const flashRef = useRef(0)
  const shockwaveRef = useRef(0)
  const ejectaRef = useRef(0)
  const craterRef = useRef(0)
  const opacityRef = useRef(1)

  useEffect(() => {
    if (show) {
      setStage(0)
      flashRef.current = 0
      shockwaveRef.current = 0
      ejectaRef.current = 0
      craterRef.current = 0
      opacityRef.current = 1
    }
  }, [show])

  useFrame(() => {
    if (!show) return

    // Stage 0: Initial flash (0-20 frames)
    if (stage === 0) {
      flashRef.current += 0.3
      if (flashRef.current >= 2) {
        setStage(1)
      }
    }

    // Stage 1: Shockwave expansion (20-60 frames)
    if (stage === 1) {
      shockwaveRef.current += 0.08
      if (shockwaveRef.current >= 3) {
        setStage(2)
      }
    }

    // Stage 2: Ejecta particles (60-100 frames)
    if (stage === 2) {
      ejectaRef.current += 0.05
      if (ejectaRef.current >= 2) {
        setStage(3)
      }
    }

    // Stage 3: Crater formation (100+ frames)
    if (stage === 3) {
      craterRef.current = Math.min(craterRef.current + 0.02, 1)
    }

    opacityRef.current = Math.max(0, opacityRef.current - 0.005)
  })

  if (!show) return null

  const craterDiameter = simulationResult?.crater.diameter_km || 1
  const craterScale = Math.min(craterDiameter / 10, 0.5) // Scale relative to Earth

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Stage 0: Initial flash */}
      {stage === 0 && (
        <>
          <mesh scale={flashRef.current}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={1 - flashRef.current / 2} />
          </mesh>
          <pointLight color="#ffffff" intensity={20} distance={5} />
        </>
      )}

      {/* Stage 1: Shockwave */}
      {stage >= 1 && (
        <>
          <mesh scale={shockwaveRef.current}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshBasicMaterial color="#ff4400" transparent opacity={Math.max(0, 0.8 - shockwaveRef.current / 3)} />
          </mesh>

          <mesh scale={shockwaveRef.current * 1.2} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.5, 32]} />
            <meshBasicMaterial
              color="#ff6600"
              transparent
              opacity={Math.max(0, 0.6 - shockwaveRef.current / 3)}
              side={THREE.DoubleSide}
            />
          </mesh>

          <pointLight color="#ff6600" intensity={15 * (1 - shockwaveRef.current / 3)} distance={5} />
        </>
      )}

      {/* Stage 2: Ejecta particles */}
      {stage >= 2 && enableParticles && (
        <>
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const distance = ejectaRef.current * 0.5
            const x = Math.cos(angle) * distance
            const z = Math.sin(angle) * distance
            const y = ejectaRef.current * 0.3

            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color="#8b4513" transparent opacity={Math.max(0, 1 - ejectaRef.current / 2)} />
              </mesh>
            )
          })}
        </>
      )}

      {/* Stage 3: Crater formation */}
      {stage >= 3 && (
        <>
          {/* Crater depression */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05 * craterRef.current, 0]}>
            <cylinderGeometry
              args={[craterScale * craterRef.current, craterScale * 0.7 * craterRef.current, 0.1, 32]}
            />
            <meshStandardMaterial color="#3d2817" roughness={1} />
          </mesh>

          {/* Crater rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[craterScale * craterRef.current, 0.02, 16, 32]} />
            <meshStandardMaterial color="#5d4427" roughness={0.9} />
          </mesh>

          {/* Damage zones visualization */}
          {simulationResult && (
            <DamageZones position={position} result={simulationResult} opacity={craterRef.current} />
          )}
        </>
      )}
    </group>
  )
}

interface DamageZonesProps {
  position: THREE.Vector3
  result: SimulationResult
  opacity: number
}

function DamageZones({ position, result, opacity }: DamageZonesProps) {
  const totalDestructionRadius = (result.blast.total_destruction_km / 6371) * 2 // Convert to Earth scale
  const severeDamageRadius = (result.blast.severe_damage_km / 6371) * 2
  const moderateDamageRadius = (result.blast.moderate_damage_km / 6371) * 2

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Total destruction zone (red) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, totalDestructionRadius, 64]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={opacity * 0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Severe damage zone (orange) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[totalDestructionRadius, severeDamageRadius, 64]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={opacity * 0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Moderate damage zone (yellow) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[severeDamageRadius, moderateDamageRadius, 64]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={opacity * 0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Labels for damage zones */}
      <Html position={[totalDestructionRadius / 2, 0, 0]} center distanceFactor={8}>
        <div className="bg-red-900/90 text-red-100 px-2 py-1 rounded text-xs font-mono border border-red-400/50 whitespace-nowrap">
          Total Destruction: {result.blast.total_destruction_km.toFixed(1)} km
        </div>
      </Html>

      <Html position={[(totalDestructionRadius + severeDamageRadius) / 2, 0, 0]} center distanceFactor={8}>
        <div className="bg-orange-900/90 text-orange-100 px-2 py-1 rounded text-xs font-mono border border-orange-400/50 whitespace-nowrap">
          Severe Damage: {result.blast.severe_damage_km.toFixed(1)} km
        </div>
      </Html>

      <Html position={[(severeDamageRadius + moderateDamageRadius) / 2, 0, 0]} center distanceFactor={8}>
        <div className="bg-yellow-900/90 text-yellow-100 px-2 py-1 rounded text-xs font-mono border border-yellow-400/50 whitespace-nowrap">
          Moderate Damage: {result.blast.moderate_damage_km.toFixed(1)} km
        </div>
      </Html>
    </group>
  )
}

interface ImpactVisualizationProps {
  latitude: number
  longitude: number
  angle: number
  diameter: number
  showAnimation: boolean
  simulationResult: SimulationResult | null
  qualitySettings: QualitySettings
}

export function ImpactVisualization({
  latitude,
  longitude,
  angle,
  diameter,
  showAnimation,
  simulationResult,
  qualitySettings,
}: ImpactVisualizationProps) {
  const [showImpact, setShowImpact] = useState(false)
  const [textureLoaded, setTextureLoaded] = useState(false)
  const impactPositionRef = useRef<THREE.Vector3>(new THREE.Vector3())

  useEffect(() => {
    if (showAnimation) {
      setShowImpact(false)
    }
  }, [showAnimation])

  const handleImpact = () => {
    setShowImpact(true)

    const phi = (90 - latitude) * (Math.PI / 180)
    const theta = (longitude + 180) * (Math.PI / 180)
    const radius = 2

    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    impactPositionRef.current.set(x, y, z)
  }

  const earthDetail =
    qualitySettings.graphicsQuality === "low" ? 32 : qualitySettings.graphicsQuality === "medium" ? 48 : 64

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden relative bg-gradient-to-b from-slate-950 via-blue-950/20 to-purple-950/20">
      {!textureLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-10">
          <div className="text-purple-400 text-sm animate-pulse">Loading Earth textures...</div>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{
          antialias: qualitySettings.graphicsQuality !== "low",
          powerPreference: qualitySettings.graphicsQuality === "low" ? "low-power" : "high-performance",
        }}
      >
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-3, 2, -4]} intensity={0.4} color="#6699ff" />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#4466ff" />
        <pointLight position={[3, -2, 4]} intensity={0.3} color="#8899ff" />

        <Stars
          radius={150}
          depth={60}
          count={qualitySettings.starDensity * 1.5}
          factor={5}
          saturation={0.2}
          fade
          speed={0.5}
        />

        <Earth
          impactLat={latitude}
          impactLon={longitude}
          showImpact={showImpact}
          onTextureLoaded={() => setTextureLoaded(true)}
          detail={earthDetail}
        />

        {showAnimation && qualitySettings.enableAnimations && (
          <Asteroid
            diameter={diameter}
            angle={angle}
            impactLat={latitude}
            impactLon={longitude}
            animate={showAnimation}
            onImpact={handleImpact}
            enableParticles={qualitySettings.enableParticles}
          />
        )}

        <ImpactEffect
          position={impactPositionRef.current}
          show={showImpact}
          simulationResult={simulationResult}
          enableParticles={qualitySettings.enableParticles}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={4}
          maxDistance={15}
          autoRotate={qualitySettings.enableAutoRotate && !showAnimation}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}

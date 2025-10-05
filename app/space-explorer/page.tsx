"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { LogOut, Rocket, Sparkles, Zap, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

interface SpaceObject {
  name: string
  definition: string
  facts: string[]
  image: string
  color: string
}

const spaceObjects: SpaceObject[] = [
  {
    name: "Asteroid",
    definition:
      "Asteroids are rocky, airless remnants left over from the early formation of our solar system about 4.6 billion years ago. Most asteroids orbit the Sun in the asteroid belt between Mars and Jupiter.",
    facts: [
      "The largest asteroid is Ceres, which is about 590 miles (950 km) in diameter",
      "Most asteroids are made of rock, but some are composed of clay or metal",
      "NASA tracks over 1 million asteroids in our solar system",
      "The asteroid belt contains millions of asteroids, but their total mass is less than our Moon",
      "Some asteroids have their own moons orbiting around them",
    ],
    image: "/realistic-asteroid-in-space-with-craters.jpg",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Meteor",
    definition:
      'A meteor is the streak of light we see in the night sky when a small chunk of interplanetary debris burns up as it enters Earth\'s atmosphere. Commonly called "shooting stars," meteors are not stars at all.',
    facts: [
      "Meteors can travel at speeds up to 160,000 mph (257,000 km/h)",
      "Most meteors are smaller than a grain of sand",
      "About 48.5 tons of meteoritic material falls on Earth each day",
      "The brightest meteors are called fireballs or bolides",
      "Meteor showers occur when Earth passes through debris trails left by comets",
    ],
    image: "/bright-meteor-shooting-star-in-night-sky.jpg",
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Meteorite",
    definition:
      "A meteorite is a piece of space rock that survives its journey through Earth's atmosphere and lands on the surface. These are fragments of asteroids or comets that provide valuable information about the early solar system.",
    facts: [
      "Only about 5% of meteors survive to become meteorites",
      "The largest meteorite ever found weighs about 60 tons (Hoba meteorite in Namibia)",
      "Meteorites are classified into three main types: stony, iron, and stony-iron",
      "Some meteorites contain organic compounds and amino acids",
      "Antarctica is one of the best places to find meteorites due to the ice preservation",
    ],
    image: "/meteorite-rock-specimen-on-display.jpg",
    color: "from-slate-500 to-gray-700",
  },
  {
    name: "Comet",
    definition:
      "Comets are cosmic snowballs of frozen gases, rock, and dust that orbit the Sun. When a comet's orbit brings it close to the Sun, it heats up and spews dust and gases, forming a giant glowing head and often two tails.",
    facts: [
      "Comet tails always point away from the Sun due to solar wind",
      "Halley's Comet returns to Earth's vicinity every 75-76 years",
      "Comets can have tails millions of miles long",
      "The nucleus of a comet is typically a few miles across",
      "Comets are thought to be leftovers from the formation of the solar system 4.6 billion years ago",
    ],
    image: "/comet-with-bright-tail-in-space.jpg",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Near-Earth Object (NEO)",
    definition:
      "Near-Earth Objects are asteroids and comets with orbits that bring them within 30 million miles (50 million kilometers) of Earth's orbit. NASA tracks these objects to assess potential impact hazards.",
    facts: [
      "Over 30,000 NEOs have been discovered so far",
      "About 100 new NEOs are discovered each month",
      "Potentially Hazardous Asteroids (PHAs) are NEOs larger than 460 feet that come within 4.6 million miles of Earth",
      "NASA's DART mission successfully changed an asteroid's orbit in 2022",
      "Most NEOs are asteroids, but about 5% are comets",
    ],
    image: "/near-earth-asteroid-approaching-planet.jpg",
    color: "from-red-500 to-rose-600",
  },
  {
    name: "Impact Crater",
    definition:
      "An impact crater is a circular depression formed when a meteorite, asteroid, or comet collides with a planet or moon. These craters provide evidence of cosmic collisions throughout history.",
    facts: [
      "The Chicxulub crater in Mexico is 93 miles wide and linked to dinosaur extinction",
      "Earth has about 190 confirmed impact craters",
      "The Moon has millions of impact craters due to lack of atmosphere",
      "Meteor Crater in Arizona is one of the best-preserved impact sites on Earth",
      "Impact craters can be billions of years old on bodies without erosion",
    ],
    image: "/large-impact-crater-from-above.jpg",
    color: "from-purple-500 to-violet-600",
  },
]

export default function SpaceExplorerPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [selectedObject, setSelectedObject] = useState<SpaceObject>(spaceObjects[0])
  const [expandedFacts, setExpandedFacts] = useState<{ [key: string]: boolean }>({})
  const [imageZoomed, setImageZoomed] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const toggleFact = (objectName: string) => {
    setExpandedFacts((prev) => ({
      ...prev,
      [objectName]: !prev[objectName],
    }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Animated starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-transparent to-transparent animate-pulse-slow"></div>

      <div className="relative z-10">
        <header className="border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-md shadow-lg shadow-purple-500/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg shadow-purple-500/50 animate-pulse-glow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Space Explorer</h1>
                <p className="text-sm text-purple-300">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/home">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 text-purple-200 hover:text-white transition-all duration-300 bg-transparent"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  NASA Data
                </Button>
              </Link>
              <Link href="/simulator">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10 text-blue-200 hover:text-white transition-all duration-300 bg-transparent"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Simulator
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-200 hover:text-white transition-all duration-300 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white border-0 shadow-2xl shadow-purple-500/30 animate-gradient-x overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-3xl font-bold animate-fade-in">Welcome to Space Explorer</CardTitle>
                <CardDescription className="text-purple-100 text-lg leading-relaxed">
                  Discover the fascinating world of asteroids, meteors, comets, and other celestial objects
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaceObjects.map((obj, index) => (
                <Card
                  key={obj.name}
                  className={`bg-slate-900/80 backdrop-blur-md border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedObject(obj)}
                >
                  <CardHeader className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${obj.color}"></div>
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${obj.color} mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                      ></div>
                      <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:${obj.color} transition-all duration-300">
                        {obj.name}
                      </CardTitle>
                      <CardDescription className="text-purple-200 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {obj.definition}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {selectedObject && (
              <Card className="bg-slate-900/90 backdrop-blur-md border-purple-500/30 shadow-2xl shadow-purple-500/20 animate-fade-in">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedObject.color} shadow-lg shadow-${selectedObject.color}/50 animate-pulse-glow`}
                    ></div>
                    <div>
                      <CardTitle className="text-3xl text-white">{selectedObject.name}</CardTitle>
                      <CardDescription className="text-purple-200 text-base leading-relaxed mt-2">
                        {selectedObject.definition}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className={`rounded-lg overflow-hidden border-2 border-purple-500/30 cursor-pointer transition-all duration-500 ${
                      imageZoomed
                        ? "scale-105 shadow-2xl shadow-purple-500/50"
                        : "hover:scale-102 hover:border-purple-500/50"
                    }`}
                    onClick={() => setImageZoomed(!imageZoomed)}
                  >
                    <img
                      src={selectedObject.image || "/placeholder.svg"}
                      alt={selectedObject.name}
                      className="w-full h-[400px] object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Sparkles className={`h-5 w-5 text-purple-400 animate-pulse`} />
                        Fascinating Facts
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFact(selectedObject.name)}
                        className="text-purple-300 hover:text-white hover:bg-purple-500/20"
                      >
                        {expandedFacts[selectedObject.name] ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Collapse
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Expand All
                          </>
                        )}
                      </Button>
                    </div>
                    <ul className="space-y-3">
                      {selectedObject.facts.map((fact, index) => (
                        <li
                          key={index}
                          className={`flex gap-3 p-4 rounded-lg bg-slate-800/50 border border-purple-500/20 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:translate-x-2 animate-fade-in-up ${
                            expandedFacts[selectedObject.name] ? "scale-100" : ""
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span
                            className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${selectedObject.color} text-white flex items-center justify-center text-sm font-bold shadow-lg`}
                          >
                            {index + 1}
                          </span>
                          <span className="text-sm leading-relaxed text-purple-100">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-slate-900/90 backdrop-blur-md border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Ready to Simulate?</CardTitle>
                <CardDescription className="text-purple-200 leading-relaxed">
                  Now that you've learned about space objects, try our asteroid impact simulator to see the effects of
                  cosmic collisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Link href="/simulator">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105">
                      <Zap className="h-4 w-4 mr-2" />
                      Launch Simulator
                    </Button>
                  </Link>
                  <Link href="/home">
                    <Button
                      variant="outline"
                      className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 text-purple-200 hover:text-white transition-all duration-300 bg-transparent"
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      View NASA Data
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { NasaDataDisplay } from "@/components/nasa-data-display"
import { NasaApod } from "@/components/nasa-apod"
import { Rocket, Moon, Zap, Globe, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-space-dark smooth-scroll">
      {/* Animated starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
      </div>

      {/* Nebula effect */}
      <div className="absolute inset-0 nebula-dark"></div>

      <header className="relative z-10 border-b border-purple-500/30 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 cursor-pointer hover:opacity-80 transition-opacity">
              Asteroid Impact Simulator
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/simulator">
              <Button
                variant="outline"
                className="border-purple-400 text-purple-300 hover:bg-purple-500/20 bg-transparent rounded-xl"
              >
                Launch Simulator
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            Explore the Power of Cosmic Impacts
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover the science behind asteroid impacts, simulate realistic collisions, and understand the potential
            consequences of near-Earth objects.
          </p>
          <Link href="/simulator">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl animate-button-glow"
            >
              Launch Simulator
            </Button>
          </Link>
        </section>

        <section className="mb-16">
          <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                Amazing Space Facts
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Discover fascinating facts about our universe and cosmic events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 p-6 rounded-xl border border-blue-500/30">
                  <div className="mb-4">
                    <img
                      src="/big-bang-universe-creation.jpg"
                      alt="Big Bang"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-blue-400 mb-3">The Big Bang</h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    The universe was created about <strong>13.8 billion years ago</strong> in a massive explosion called
                    the Big Bang. Everything we see today—stars, planets, and galaxies—came from this incredible event!
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-950/50 to-red-950/50 p-6 rounded-xl border border-orange-500/30">
                  <div className="mb-4">
                    <img
                      src="/dinosaur-extinction-asteroid-impact.jpg"
                      alt="Dinosaur Extinction"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-orange-400 mb-3">Dinosaur Extinction</h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    About <strong>66 million years ago</strong>, a huge asteroid hit Earth near Mexico. It was so
                    powerful that it wiped out the dinosaurs and changed life on Earth forever!
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 p-6 rounded-xl border border-purple-500/30">
                  <div className="mb-4">
                    <img
                      src="/earth-mass-extinction-events.jpg"
                      alt="Mass Extinctions"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-purple-400 mb-3">Mass Extinctions</h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Earth has experienced <strong>5 major mass extinctions</strong> in its history. Many were caused by
                    asteroid impacts and volcanic eruptions that changed the climate dramatically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* NASA Near-Earth Objects live data section */}
        <section className="mb-16">
          <NasaDataDisplay />
        </section>

        {/* NASA Astronomy Picture of the Day */}
        <section className="mb-16">
          <NasaApod />
        </section>

        {/* Educational Content Tabs */}
        <section className="mb-16">
          <Tabs defaultValue="asteroids" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-900/50 border border-purple-500/30 mb-8">
              <TabsTrigger value="asteroids" className="text-base data-[state=active]:bg-purple-600">
                Asteroids
              </TabsTrigger>
              <TabsTrigger value="meteors" className="text-base data-[state=active]:bg-purple-600">
                Meteors
              </TabsTrigger>
              <TabsTrigger value="comets" className="text-base data-[state=active]:bg-purple-600">
                Comets
              </TabsTrigger>
              <TabsTrigger value="debris" className="text-base data-[state=active]:bg-purple-600">
                Space Debris
              </TabsTrigger>
            </TabsList>

            <TabsContent value="asteroids">
              <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Asteroids: Rocky Remnants of the Solar System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src="/asteroid-in-space-nasa-realistic.jpg"
                        alt="Asteroid in space"
                        className="rounded-lg w-full h-64 object-cover border border-purple-500/30"
                      />
                    </div>
                    <div className="space-y-4 text-slate-300 text-base leading-relaxed">
                      <p>
                        Asteroids are rocky, airless remnants left over from the early formation of our solar system
                        about 4.6 billion years ago. Most asteroids orbit the Sun in the asteroid belt between Mars and
                        Jupiter.
                      </p>
                      <p>
                        <strong className="text-purple-400">Size Range:</strong> From a few meters to hundreds of
                        kilometers in diameter. The largest asteroid, Ceres, is about 940 km across.
                      </p>
                      <p>
                        <strong className="text-purple-400">Composition:</strong> Primarily made of rock and metal.
                        C-type (carbonaceous), S-type (silicate), and M-type (metallic) are the main classifications.
                      </p>
                      <p>
                        <strong className="text-purple-400">Impact Threat:</strong> Near-Earth Asteroids (NEAs) that
                        cross Earth's orbit pose potential impact risks. NASA tracks over 30,000 NEAs.
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-400 mb-3">Famous Asteroid Impacts</h3>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>
                        <strong>Chicxulub Impact (66 million years ago):</strong> 10-15 km asteroid caused the
                        extinction of dinosaurs
                      </li>
                      <li>
                        <strong>Tunguska Event (1908):</strong> 50-60 meter object exploded over Siberia, flattening
                        2,000 km² of forest
                      </li>
                      <li>
                        <strong>Chelyabinsk Meteor (2013):</strong> 20-meter asteroid exploded over Russia, injuring
                        1,500 people
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meteors">
              <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Meteors: Shooting Stars and Fireballs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src="/meteor-fireball-entering-atmosphere-nasa.jpg"
                        alt="Meteor entering atmosphere"
                        className="rounded-lg w-full h-64 object-cover border border-purple-500/30"
                      />
                    </div>
                    <div className="space-y-4 text-slate-300 text-base leading-relaxed">
                      <p>
                        A meteor is the visible streak of light that occurs when a meteoroid (small piece of space
                        debris) enters Earth's atmosphere at high speed and burns up due to friction.
                      </p>
                      <p>
                        <strong className="text-purple-400">Meteoroid:</strong> The object in space (typically
                        millimeters to meters in size)
                      </p>
                      <p>
                        <strong className="text-purple-400">Meteor:</strong> The light phenomenon as it burns in the
                        atmosphere (shooting star)
                      </p>
                      <p>
                        <strong className="text-purple-400">Meteorite:</strong> The fragment that survives and reaches
                        Earth's surface
                      </p>
                      <p>
                        <strong className="text-purple-400">Entry Speed:</strong> Typically 11-72 km/s (25,000-160,000
                        mph)
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-400 mb-3">Meteor Showers</h3>
                    <p className="text-slate-300 text-base mb-3">
                      Annual meteor showers occur when Earth passes through debris trails left by comets:
                    </p>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>
                        <strong>Perseids (August):</strong> Up to 100 meteors per hour, from Comet Swift-Tuttle
                      </li>
                      <li>
                        <strong>Geminids (December):</strong> Up to 120 meteors per hour, from asteroid 3200 Phaethon
                      </li>
                      <li>
                        <strong>Leonids (November):</strong> Occasional meteor storms with thousands per hour
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comets">
              <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Comets: Icy Wanderers of the Solar System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src="/comet-with-tail-nasa-space.jpg"
                        alt="Comet with tail"
                        className="rounded-lg w-full h-64 object-cover border border-purple-500/30"
                      />
                    </div>
                    <div className="space-y-4 text-slate-300 text-base leading-relaxed">
                      <p>
                        Comets are cosmic snowballs of frozen gases, rock, and dust that orbit the Sun. When a comet's
                        orbit brings it close to the Sun, it heats up and spews dust and gases, forming a giant glowing
                        head and tail.
                      </p>
                      <p>
                        <strong className="text-purple-400">Composition:</strong> Ice (water, CO₂, methane, ammonia),
                        dust, and rocky material - often called "dirty snowballs"
                      </p>
                      <p>
                        <strong className="text-purple-400">Nucleus:</strong> Solid core typically 1-50 km in diameter
                      </p>
                      <p>
                        <strong className="text-purple-400">Tail:</strong> Can extend millions of kilometers, always
                        points away from the Sun due to solar wind
                      </p>
                      <p>
                        <strong className="text-purple-400">Origin:</strong> Kuiper Belt (short-period) and Oort Cloud
                        (long-period comets)
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-400 mb-3">Famous Comets</h3>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>
                        <strong>Halley's Comet:</strong> Returns every 76 years, last seen in 1986, next in 2061
                      </li>
                      <li>
                        <strong>Comet Hale-Bopp:</strong> One of the brightest comets of the 20th century (1997)
                      </li>
                      <li>
                        <strong>Comet Shoemaker-Levy 9:</strong> Collided with Jupiter in 1994, providing insights into
                        impact dynamics
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="debris">
              <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Space Debris: Human-Made Hazards in Orbit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src="/space-debris-satellites-orbit-earth.jpg"
                        alt="Space debris around Earth"
                        className="rounded-lg w-full h-64 object-cover border border-purple-500/30"
                      />
                    </div>
                    <div className="space-y-4 text-slate-300 text-base leading-relaxed">
                      <p>
                        Space debris consists of defunct satellites, spent rocket stages, and fragments from collisions
                        and explosions. These objects pose risks to operational spacecraft and the International Space
                        Station.
                      </p>
                      <p>
                        <strong className="text-purple-400">Current Count:</strong> Over 34,000 objects larger than 10
                        cm are tracked, millions of smaller pieces exist
                      </p>
                      <p>
                        <strong className="text-purple-400">Orbital Speed:</strong> Up to 28,000 km/h (17,500 mph) in
                        low Earth orbit
                      </p>
                      <p>
                        <strong className="text-purple-400">Impact Energy:</strong> Even small debris can cause
                        catastrophic damage due to extreme velocities
                      </p>
                      <p>
                        <strong className="text-purple-400">Kessler Syndrome:</strong> Theoretical scenario where debris
                        density triggers cascading collisions
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-400 mb-3">Notable Incidents</h3>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>
                        <strong>2009 Iridium-Cosmos Collision:</strong> First major satellite collision, created
                        thousands of debris pieces
                      </li>
                      <li>
                        <strong>2007 Chinese ASAT Test:</strong> Destroyed satellite created over 3,000 trackable
                        fragments
                      </li>
                      <li>
                        <strong>ISS Maneuvers:</strong> Space station regularly adjusts orbit to avoid debris
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Asteroid Parameters Section */}
        <section className="mb-16">
          <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Understanding Impact Parameters
              </CardTitle>
              <CardDescription className="text-slate-300 text-base">
                Key factors that determine the severity of an asteroid impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400">Diameter</h3>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed">
                    The size of the asteroid determines its mass and potential energy. Objects larger than 1 km can
                    cause global catastrophes.
                  </p>
                  <p className="text-slate-400 text-sm mt-2">Typical range: 10m - 10km</p>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400">Velocity</h3>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Impact velocity dramatically affects energy release. Faster objects deliver exponentially more
                    destructive force.
                  </p>
                  <p className="text-slate-400 text-sm mt-2">Typical range: 11-72 km/s</p>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Moon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400">Density</h3>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Material composition affects mass. Iron asteroids (7800 kg/m³) are much denser than rocky ones (3000
                    kg/m³).
                  </p>
                  <p className="text-slate-400 text-sm mt-2">Typical range: 2000-8000 kg/m³</p>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Rocket className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400">Impact Angle</h3>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Steep angles (90°) create deeper craters with localized damage. Shallow angles (30°) spread
                    destruction over wider areas.
                  </p>
                  <p className="text-slate-400 text-sm mt-2">Range: 0-90 degrees</p>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400">Composition</h3>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Rocky, metallic, or icy composition affects atmospheric entry and ground impact. Metal asteroids
                    penetrate deeper.
                  </p>
                  <p className="text-slate-400 text-sm mt-2">Types: Stone, Iron, Ice</p>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400">Impact Location</h3>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Ocean impacts create massive tsunamis. Land impacts produce craters, ejecta, and seismic waves.
                    Urban areas face catastrophic casualties.
                  </p>
                  <p className="text-slate-400 text-sm mt-2">Ocean vs Land vs Urban</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Impact Background Images Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Impact Consequences</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30 overflow-hidden">
              <div className="relative h-48">
                <img
                  src="/asteroid-impact-explosion-fireball.jpg"
                  alt="Impact explosion"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-xl font-bold text-purple-400 mb-2">Initial Fireball</h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  The impact creates a massive fireball with temperatures exceeding 10,000°C, vaporizing the asteroid
                  and surrounding material instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30 overflow-hidden">
              <div className="relative h-48">
                <img
                  src="/impact-crater-formation-aerial-view.jpg"
                  alt="Crater formation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-xl font-bold text-purple-400 mb-2">Crater Formation</h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  The impact excavates a massive crater, ejecting millions of tons of material into the atmosphere and
                  creating a bowl-shaped depression.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30 overflow-hidden">
              <div className="relative h-48">
                <img src="/placeholder-l9mqb.png" alt="Shockwave destruction" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-xl font-bold text-purple-400 mb-2">Shockwave Devastation</h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  A powerful shockwave radiates outward at supersonic speeds, flattening structures and causing
                  widespread destruction for hundreds of kilometers.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-950/80 to-purple-950/80 backdrop-blur-xl border-purple-500/30">
            <CardContent className="py-12">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Simulate an Impact?</h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Use our advanced simulator to model asteroid impacts with realistic physics, 3D visualizations, and
                detailed consequence analysis.
              </p>
              <Link href="/simulator">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl animate-button-glow"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Launch Impact Simulator
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/30 bg-slate-950/50 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400 text-base">
          <p>Asteroid Impact Simulator - Educational Tool for Understanding Cosmic Threats</p>
          <p className="text-sm mt-2">Data sources: NASA, ESA, and scientific research</p>
        </div>
      </footer>
    </div>
  )
}

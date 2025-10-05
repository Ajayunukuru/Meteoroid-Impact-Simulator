import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-space-dark">
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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tight">
            Asteroid Impact
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Simulator
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience the power of cosmic collisions. Simulate asteroid impacts with realistic physics and stunning 3D
            visualizations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/login">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl animate-button-glow"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-purple-400 text-purple-300 hover:bg-purple-500/20 bg-transparent rounded-xl"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

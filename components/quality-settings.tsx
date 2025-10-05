"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"

export interface QualitySettings {
  graphicsQuality: "low" | "medium" | "high"
  starDensity: number
  enableAnimations: boolean
  enableAutoRotate: boolean
  enableParticles: boolean
}

interface QualitySettingsProps {
  settings: QualitySettings
  onSettingsChange: (settings: QualitySettings) => void
}

export function QualitySettingsPanel({ settings, onSettingsChange }: QualitySettingsProps) {
  const handleQualityChange = (quality: "low" | "medium" | "high") => {
    const newSettings = { ...settings, graphicsQuality: quality }

    // Adjust other settings based on quality preset
    if (quality === "low") {
      newSettings.starDensity = 1000
      newSettings.enableParticles = false
    } else if (quality === "medium") {
      newSettings.starDensity = 3000
      newSettings.enableParticles = true
    } else {
      newSettings.starDensity = 5000
      newSettings.enableParticles = true
    }

    onSettingsChange(newSettings)
  }

  return (
    <Card className="bg-slate-950/80 backdrop-blur-xl border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          <Settings className="h-5 w-5 text-purple-400" />
          Quality Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-200">Graphics Quality</Label>
          <Select value={settings.graphicsQuality} onValueChange={handleQualityChange}>
            <SelectTrigger className="bg-slate-900/50 border-purple-500/30 text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (Mobile)</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High (Desktop)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-400">
            {settings.graphicsQuality === "low" && "Optimized for mobile devices and lower-end hardware"}
            {settings.graphicsQuality === "medium" && "Balanced performance and visual quality"}
            {settings.graphicsQuality === "high" && "Maximum visual quality for powerful devices"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-slate-200">Enable Animations</Label>
          <Switch
            checked={settings.enableAnimations}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, enableAnimations: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-slate-200">Auto-Rotate Globe</Label>
          <Switch
            checked={settings.enableAutoRotate}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, enableAutoRotate: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-slate-200">Particle Effects</Label>
          <Switch
            checked={settings.enableParticles}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, enableParticles: checked })}
          />
        </div>

        <div className="pt-2 border-t border-purple-500/30">
          <p className="text-xs text-slate-400">
            Lower quality settings improve performance on mobile devices and older hardware.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function detectMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function getDefaultQualitySettings(): QualitySettings {
  const isMobile = detectMobileDevice()

  return {
    graphicsQuality: isMobile ? "low" : "high",
    starDensity: isMobile ? 1000 : 5000,
    enableAnimations: true,
    enableAutoRotate: !isMobile,
    enableParticles: !isMobile,
  }
}

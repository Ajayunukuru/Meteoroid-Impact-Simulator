"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  show: boolean
  progress: number
  message?: string
}

export function LoadingOverlay({ show, progress, message = "Loading..." }: LoadingOverlayProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    if (show) {
      setDisplayProgress(progress)
    }
  }, [show, progress])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center space-y-6">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          <div className="w-full space-y-3">
            <p className="text-center text-lg font-medium text-slate-200">{message}</p>
            <Progress value={displayProgress} className="h-2" />
            <p className="text-center text-sm text-slate-400">{Math.round(displayProgress)}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

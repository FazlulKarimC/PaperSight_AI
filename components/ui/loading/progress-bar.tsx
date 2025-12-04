'use client'

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ProgressBarProps {
  progress?: number // 0-100, undefined for indeterminate
  className?: string
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (progress !== undefined) {
      setWidth(Math.min(100, Math.max(0, progress)))
    } else {
      // Indeterminate animation
      setWidth(30)
    }
  }, [progress])

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-1 bg-border z-50",
        className
      )}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300 ease-out",
          progress === undefined && "animate-pulse"
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

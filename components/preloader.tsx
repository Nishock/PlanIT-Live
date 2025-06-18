"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-lg animate-pulse"></div>
          <div className="absolute inset-1 bg-background rounded-md flex items-center justify-center">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-cyan-400">
              P
            </span>
          </div>
        </div>
        <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-1500"
            style={{ width: isLoading ? "0%" : "100%" }}
          ></div>
        </div>
      </div>
    </div>
  )
}

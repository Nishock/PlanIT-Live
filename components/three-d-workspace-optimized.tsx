"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export function ThreeDWorkspaceOptimized() {
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }, 500)

    return () => {
      isMounted.current = false
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border shadow-lg">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-400/20 z-10"></div>

      {/* Static background - much more performant than video */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-cyan-800">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/20 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Welcome to PLANIT</h2>
          <p className="text-muted-foreground">
            Your AI-powered workspace for seamless task management and collaboration
          </p>
        </div>
      </div>
    </div>
  )
} 
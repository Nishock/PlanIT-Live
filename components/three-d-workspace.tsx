"use client"

import { useEffect, useRef, useState } from "react"

export function ThreeDWorkspace() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    // Set isMounted ref to true when component mounts
    isMounted.current = true

    // Set a timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (isMounted.current && videoRef.current) {
        // Only attempt to play if component is still mounted
        setIsLoading(false)

        // Use a separate function for play attempt to handle errors properly
        const attemptPlay = async () => {
          try {
            if (videoRef.current && isMounted.current) {
              await videoRef.current.play()
            }
          } catch (error) {
            console.error("Video autoplay failed:", error)
            if (isMounted.current) {
              setVideoError(true)
            }
          }
        }

        attemptPlay()
      }
    }, 300) // Short delay to ensure DOM is ready

    // Cleanup function
    return () => {
      isMounted.current = false
      clearTimeout(timer)

      if (videoRef.current) {
        // Properly cleanup video element
        const video = videoRef.current
        video.pause()
        video.removeAttribute("src")
        video.load()
      }
    }
  }, [])

  // Handle video load event
  const handleVideoLoaded = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border shadow-lg">
      {/* Gradient overlay - always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-400/20 z-10"></div>

      {/* Fallback gradient background - always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-cyan-800"></div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/20 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* Video element - conditionally rendered */}
      {!videoError && (
        <div className="absolute inset-0 z-5">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={handleVideoLoaded}
            onError={() => {
              setVideoError(true)
              setIsLoading(false)
            }}
          >
            {/* Static placeholder image while video loads */}
            <source src="/videos/digital-background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Content overlay - always on top */}
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

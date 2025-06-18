import { useEffect, useRef } from 'react'
import { optimizedApiService } from '@/lib/api-service-optimized'

export function useDataPreload() {
  const preloadedRef = useRef(false)

  useEffect(() => {
    if (preloadedRef.current) return

    // Preload critical data in the background
    const preloadData = async () => {
      try {
        await optimizedApiService.preloadData()
        preloadedRef.current = true
      } catch (error) {
        console.warn('Data preload failed:', error)
      }
    }

    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => preloadData())
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(preloadData, 100)
    }
  }, [])

  return preloadedRef.current
} 
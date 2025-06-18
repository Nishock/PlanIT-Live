class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()

  constructor() {
    this.initializeObservers()
  }

  private initializeObservers() {
    // Monitor navigation timing
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.recordMetric('navigation', navEntry.loadEventEnd - navEntry.loadEventStart)
            this.recordMetric('domContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart)
            this.recordMetric('firstPaint', navEntry.loadEventEnd - navEntry.fetchStart)
          }
        }
      })
      
      try {
        navigationObserver.observe({ entryTypes: ['navigation'] })
        this.observers.set('navigation', navigationObserver)
      } catch (e) {
        console.warn('Navigation timing not supported')
      }

      // Monitor paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            this.recordMetric(entry.name, entry.startTime)
          }
        }
      })

      try {
        paintObserver.observe({ entryTypes: ['paint'] })
        this.observers.set('paint', paintObserver)
      } catch (e) {
        console.warn('Paint timing not supported')
      }

      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            this.recordMetric('resourceLoad', resourceEntry.duration)
          }
        }
      })

      try {
        resourceObserver.observe({ entryTypes: ['resource'] })
        this.observers.set('resource', resourceObserver)
      } catch (e) {
        console.warn('Resource timing not supported')
      }
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {}
    for (const [name] of this.metrics) {
      result[name] = this.getAverageMetric(name)
    }
    return result
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    return fn().finally(() => {
      const duration = performance.now() - start
      this.recordMetric(name, duration)
    })
  }

  measureSync<T>(name: string, fn: () => T): T {
    const start = performance.now()
    try {
      return fn()
    } finally {
      const duration = performance.now() - start
      this.recordMetric(name, duration)
    }
  }

  // Monitor React component render times
  measureComponentRender(componentName: string, renderFn: () => void) {
    return this.measureSync(`component_${componentName}`, renderFn)
  }

  // Monitor API call performance
  measureApiCall(endpoint: string, apiCall: () => Promise<any>) {
    return this.measureAsync(`api_${endpoint}`, apiCall)
  }

  // Get performance report
  getReport(): PerformanceReport {
    const metrics = this.getMetrics()
    const report: PerformanceReport = {
      timestamp: new Date().toISOString(),
      metrics,
      summary: {
        averageNavigationTime: metrics.navigation || 0,
        averagePaintTime: metrics['first-paint'] || 0,
        averageResourceLoadTime: metrics.resourceLoad || 0,
        totalMetrics: Object.keys(metrics).length,
      },
      recommendations: this.generateRecommendations(metrics)
    }
    return report
  }

  private generateRecommendations(metrics: Record<string, number>): string[] {
    const recommendations: string[] = []

    if (metrics.navigation > 3000) {
      recommendations.push('Navigation time is slow. Consider code splitting and lazy loading.')
    }

    if (metrics['first-paint'] > 1000) {
      recommendations.push('First paint is slow. Optimize critical rendering path.')
    }

    if (metrics.resourceLoad > 2000) {
      recommendations.push('Resource loading is slow. Consider CDN and compression.')
    }

    return recommendations
  }

  // Cleanup observers
  destroy() {
    for (const observer of this.observers.values()) {
      observer.disconnect()
    }
    this.observers.clear()
    this.metrics.clear()
  }
}

interface PerformanceReport {
  timestamp: string
  metrics: Record<string, number>
  summary: {
    averageNavigationTime: number
    averagePaintTime: number
    averageResourceLoadTime: number
    totalMetrics: number
  }
  recommendations: string[]
}

export const performanceMonitor = new PerformanceMonitor()

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.destroy()
  })
} 
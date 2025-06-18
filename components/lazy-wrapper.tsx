"use client"

import { Suspense, lazy, ComponentType } from 'react'

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LazyWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  )
}

function DefaultFallback() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>
  )
}

// Lazy load heavy components
export const LazyAnalyticsDashboard = lazy(() => 
  import('./analytics/analytics-dashboard').then(module => ({ 
    default: module.AnalyticsDashboard 
  }))
)

export const LazyKanbanBoard = lazy(() => 
  import('./tasks/kanban-board').then(module => ({ 
    default: module.KanbanBoard 
  }))
)

export const LazyDocumentEditor = lazy(() => 
  import('./document-editor/document-editor').then(module => ({ 
    default: module.DocumentEditor 
  }))
)

export const LazyThreeDWorkspace = lazy(() => 
  import('./three-d-workspace').then(module => ({ 
    default: module.ThreeDWorkspace 
  }))
)

export const LazyWhiteboard = lazy(() => 
  import('./whiteboard/whiteboard').then(module => ({ 
    default: module.Whiteboard 
  }))
)

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function LazyComponent(props: T) {
    return (
      <LazyWrapper fallback={fallback}>
        <Component {...props} />
      </LazyWrapper>
    )
  }
} 
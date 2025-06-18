"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

// --- Context and Provider ---
type CursorEffectsContextType = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

const CursorEffectsContext = createContext<CursorEffectsContextType | undefined>(undefined);

export function CursorEffectsProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const toggle = () => setEnabled((v) => !v);
  return (
    <CursorEffectsContext.Provider value={{ enabled, setEnabled, toggle }}>
      {children}
    </CursorEffectsContext.Provider>
  );
}

export function useCursorEffectsContext() {
  const ctx = useContext(CursorEffectsContext);
  if (!ctx) throw new Error("useCursorEffectsContext must be used within CursorEffectsProvider");
  return ctx;
}

// --- Main CursorEffects component ---
interface CursorEffectsProps {
  trailCount?: number
  glowIntensity?: number
}

export function CursorEffects({ trailCount = 3, glowIntensity = 0.8 }: CursorEffectsProps) {
  const { enabled } = useCursorEffectsContext();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [hoverTarget, setHoverTarget] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [loadingPos, setLoadingPos] = useState({ x: 0, y: 0 })
  const [loadingAngle, setLoadingAngle] = useState(0)
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const animationFrameRef = useRef<number>()
  const loadingAnimationRef = useRef<number>()
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname();

  // Hide loading animation on route change
  useEffect(() => {
    setLoading(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  }, [pathname]);

  // Animate loading dots in a circle
  useEffect(() => {
    if (!loading) {
      if (loadingAnimationRef.current) cancelAnimationFrame(loadingAnimationRef.current)
      return;
    }
    let angle = 0;
    const animate = () => {
      setLoadingAngle(angle);
      angle += 0.07; // speed
      loadingAnimationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (loadingAnimationRef.current) cancelAnimationFrame(loadingAnimationRef.current)
    }
  }, [loading]);

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
      trailRefs.current.forEach((trail, index) => {
        if (trail) {
          const delay = index * 50
          setTimeout(() => {
            trail.style.left = `${e.clientX}px`
            trail.style.top = `${e.clientY}px`
          }, delay)
        }
      })
    }

    const handleClick = (e: MouseEvent) => {
      setLoadingPos({ x: e.clientX, y: e.clientY })
      setLoading(true)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      loadingTimeoutRef.current = setTimeout(() => setLoading(false), 1500);
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovering(true)
      if (
        (target instanceof Element && target.tagName === 'BUTTON') ||
        (target instanceof Element && target.closest('button'))
      ) {
        setHoverTarget('button')
      } else if (
        (target instanceof Element && target.tagName === 'A') ||
        (target instanceof Element && target.closest('a'))
      ) {
        setHoverTarget('link')
      } else if (
        (target instanceof Element && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) ||
        (target instanceof Element && target.closest('input, textarea'))
      ) {
        setHoverTarget('input')
      } else if (
        target instanceof Element && target.closest('.card, [role="button"]')
      ) {
        setHoverTarget('card')
      } else {
        setHoverTarget('default')
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setHoverTarget('default')
    }

    document.body.classList.add('cursor-glow')
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('mouseenter', handleMouseEnter as EventListener)
    document.addEventListener('mouseleave', handleMouseLeave as EventListener)
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, .card, [role="button"]')
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter as EventListener)
      element.addEventListener('mouseleave', handleMouseLeave as EventListener)
    })
    return () => {
      document.body.classList.remove('cursor-glow')
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('mouseenter', handleMouseEnter as EventListener)
      document.removeEventListener('mouseleave', handleMouseLeave as EventListener)
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter as EventListener)
        element.removeEventListener('mouseleave', handleMouseLeave as EventListener)
      })
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || !cursorRef.current) return
    const animate = () => {
      if (cursorRef.current) {
        if (isHovering) {
          cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1.2)'
        } else {
          cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)'
        }
        switch (hoverTarget) {
          case 'button':
            cursorRef.current.style.background = '#3b82f6'
            cursorRef.current.style.boxShadow = `0 0 30px rgba(59, 130, 246, ${glowIntensity})`
            break
          case 'link':
            cursorRef.current.style.background = '#8b5cf6'
            cursorRef.current.style.boxShadow = `0 0 30px rgba(139, 92, 246, ${glowIntensity})`
            break
          case 'input':
            cursorRef.current.style.background = '#22c55e'
            cursorRef.current.style.boxShadow = `0 0 30px rgba(34, 197, 94, ${glowIntensity})`
            break
          case 'card':
            cursorRef.current.style.background = '#f59e0b'
            cursorRef.current.style.boxShadow = `0 0 30px rgba(245, 158, 11, ${glowIntensity})`
            break
          default:
            cursorRef.current.style.background = '#9333ea'
            cursorRef.current.style.boxShadow = `0 0 20px rgba(147, 51, 234, ${glowIntensity})`
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enabled, isHovering, hoverTarget, glowIntensity])

  if (!enabled) return null

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10000] w-3 h-3 bg-purple-500 rounded-full transition-all duration-150 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Cursor trail */}
      {Array.from({ length: trailCount }).map((_, index) => (
        <div
          key={index}
          ref={(el) => { trailRefs.current[index] = el || null; }}
          className="fixed pointer-events-none z-[9999] w-2 h-2 bg-purple-400 rounded-full opacity-60 transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
            transitionDelay: `${index * 50}ms`,
          }}
        />
      ))}
      {/* Cursor glow effect */}
      <div
        className="fixed pointer-events-none z-[9998] rounded-full transition-all duration-200 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: isHovering ? '60px' : '40px',
          height: isHovering ? '60px' : '40px',
          background: `radial-gradient(circle, rgba(147, 51, 234, ${glowIntensity * 0.6}) 0%, rgba(147, 51, 234, ${glowIntensity * 0.3}) 50%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Floating particles */}
      <div
        className="fixed pointer-events-none z-[9997] w-1 h-1 bg-purple-300 rounded-full animate-pulse"
        style={{
          left: mousePosition.x + 10,
          top: mousePosition.y - 10,
          animationDelay: '0.5s',
        }}
      />
      <div
        className="fixed pointer-events-none z-[9997] w-1 h-1 bg-pink-300 rounded-full animate-pulse"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y + 8,
          animationDelay: '1s',
        }}
      />
      {/* 4-dot circular loading animation on click */}
      {loading && (
        <div
          className="fixed pointer-events-none z-[10001]"
          style={{
            left: loadingPos.x,
            top: loadingPos.y,
            width: 48,
            height: 48,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {[0, 1, 2, 3].map((i) => {
            const radius = 18;
            const angle = loadingAngle + (i * Math.PI / 2);
            const x = 24 + radius * Math.cos(angle) - 4;
            const y = 24 + radius * Math.sin(angle) - 4;
            const colors = [
              '#a855f7', // purple
              '#06b6d4', // cyan
              '#ec4899', // pink
              '#10b981', // green
            ];
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: colors[i],
                  boxShadow: `0 0 8px 2px ${colors[i]}55`,
                  transition: 'background 0.2s',
                }}
              />
            );
          })}
        </div>
      )}
      <style jsx global>{`
        .dot-loader {
          display: flex;
          gap: 6px;
          align-items: center;
          justify-content: center;
          animation: dot-rotate 1s linear infinite;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a855f7;
          animation: dot-pulse 1s infinite alternate;
        }
        .dot:nth-child(2) { animation-delay: 0.15s; background: #06b6d4; }
        .dot:nth-child(3) { animation-delay: 0.3s; background: #ec4899; }
        .dot:nth-child(4) { animation-delay: 0.45s; background: #10b981; }
        @keyframes dot-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0.7; }
        }
        @keyframes dot-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

// --- Hook for toggle ---
export function useCursorEffects() {
  const ctx = useCursorEffectsContext();
  return {
    enabled: ctx.enabled,
    toggleCursorEffects: ctx.toggle,
    enableCursorEffects: () => ctx.setEnabled(true),
    disableCursorEffects: () => ctx.setEnabled(false),
  }
} 
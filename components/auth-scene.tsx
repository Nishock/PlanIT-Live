"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export function AuthScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sceneError, setSceneError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Scene setup
      const scene = new THREE.Scene()

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000,
      )
      camera.position.z = 5

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.setClearColor(0x000000, 0)
      containerRef.current.appendChild(renderer.domElement)

      // Responsive handling
      const handleResize = () => {
        if (!containerRef.current) return

        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      }

      window.addEventListener("resize", handleResize)

      // Create particles
      const particlesCount = 1000
      const particlesGeometry = new THREE.BufferGeometry()
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x9333ea, // Purple
        transparent: true,
        opacity: 0.8,
      })

      const particlesPositions = new Float32Array(particlesCount * 3)
      const particlesSpeeds = new Float32Array(particlesCount)

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3

        // Position particles in a sphere
        const radius = 3 + Math.random() * 2
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI

        particlesPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        particlesPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        particlesPositions[i3 + 2] = radius * Math.cos(phi)

        // Random speeds
        particlesSpeeds[i] = 0.01 + Math.random() * 0.02
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesPositions, 3))
      const particles = new THREE.Points(particlesGeometry, particlesMaterial)
      scene.add(particles)

      // Create a glowing sphere in the center
      const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4, // Cyan
        transparent: true,
        opacity: 0.7,
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      scene.add(sphere)

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)

      // Add point light
      const pointLight = new THREE.PointLight(0x9333ea, 1, 10)
      pointLight.position.set(0, 0, 0)
      scene.add(pointLight)

      // Animation
      const animate = () => {
        requestAnimationFrame(animate)

        // Rotate the particles
        particles.rotation.y += 0.001

        // Pulse the sphere
        const time = Date.now() * 0.001
        sphere.scale.set(1 + Math.sin(time) * 0.1, 1 + Math.sin(time) * 0.1, 1 + Math.sin(time) * 0.1)

        // Update particles positions
        const positions = particlesGeometry.attributes.position.array as Float32Array

        for (let i = 0; i < particlesCount; i++) {
          const i3 = i * 3

          // Move particles in a spiral pattern
          const x = positions[i3]
          const y = positions[i3 + 1]
          const z = positions[i3 + 2]

          const speed = particlesSpeeds[i]

          // Calculate new position
          positions[i3] = x * Math.cos(speed) - z * Math.sin(speed)
          positions[i3 + 2] = x * Math.sin(speed) + z * Math.cos(speed)
        }

        particlesGeometry.attributes.position.needsUpdate = true

        renderer.render(scene, camera)
      }

      animate()

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize)
        if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement)
        }

        // Dispose resources
        sphereGeometry.dispose()
        sphereMaterial.dispose()
        particlesGeometry.dispose()
        particlesMaterial.dispose()
        renderer.dispose()
      }
    } catch (error) {
      console.error("Error initializing 3D scene:", error)
      setSceneError(true)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full">
      {sceneError && (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-cyan-800 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/30 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-purple-600/60 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-purple-600 animate-pulse"></div>
              </div>
            </div>
            <p className="text-lg font-medium">Interactive background unavailable</p>
          </div>
        </div>
      )}
    </div>
  )
}

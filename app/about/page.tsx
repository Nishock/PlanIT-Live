"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckSquare, Menu, X, Users, Target, Award, Globe, Heart, Lightbulb, Rocket, Shield, Star, TrendingUp } from 'lucide-react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

export default function AboutPage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Initialize particles
  useEffect(() => {
    const initParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          color: ["#8B5CF6", "#06B6D4", "#EC4899", "#10B981"][Math.floor(Math.random() * 4)],
        })
      }
      setParticles(newParticles)
    }

    initParticles()
    window.addEventListener("resize", initParticles)
    return () => window.removeEventListener("resize", initParticles)
  }, [])

  // Animate particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY

          if (newX < 0 || newX > canvas.width) particle.speedX *= -1
          if (newY < 0 || newY > canvas.height) particle.speedY *= -1

          newX = Math.max(0, Math.min(canvas.width, newX))
          newY = Math.max(0, Math.min(canvas.height, newY))

          // Draw particle
          ctx.beginPath()
          ctx.arc(newX, newY, particle.size, 0, Math.PI * 2)
          ctx.fillStyle =
            particle.color +
            Math.floor(particle.opacity * 255)
              .toString(16)
              .padStart(2, "0")
          ctx.fill()

          // Draw connections
          prevParticles.forEach((otherParticle) => {
            const distance = Math.sqrt(Math.pow(newX - otherParticle.x, 2) + Math.pow(newY - otherParticle.y, 2))
            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(newX, newY)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = particle.color + "20"
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          })

          return { ...particle, x: newX, y: newY }
        }),
      )

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const values = [
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation First",
      description: "We constantly push boundaries to create cutting-edge solutions that transform how teams work.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "We believe the best results come from diverse teams working together towards common goals.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "User-Centric",
      description: "Every feature we build is designed with our users' needs and experiences at the forefront.",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Trust & Security",
      description: "We maintain the highest standards of security and privacy to protect our users' data.",
      color: "from-green-500 to-emerald-500",
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former VP of Product at TechCorp with 15+ years in productivity software. Passionate about AI and team dynamics.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer specializing in machine learning and distributed systems. PhD in Computer Science from MIT.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      bio: "Award-winning UX designer with expertise in human-computer interaction. Previously at Apple and Airbnb.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "David Kim",
      role: "VP of Engineering",
      bio: "Full-stack architect with experience scaling platforms to millions of users. Former lead at Spotify.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to revolutionize task management using AI technology.",
    },
    {
      year: "2021",
      title: "First Product Launch",
      description: "Released our MVP to 100 beta users and received overwhelming positive feedback.",
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Raised $10M to accelerate product development and team expansion.",
    },
    {
      year: "2023",
      title: "AI Integration",
      description: "Launched advanced AI features that transformed how teams manage their workflows.",
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Reached 100,000+ users across 50 countries with enterprise-grade features.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ background: "transparent" }} />

      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full blur-3xl opacity-20 transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transform: `rotate(${scrollY * 0.1}deg)`,
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"
          style={{
            animationDuration: "6s",
            transform: `translateX(${Math.sin(scrollY * 0.01) * 50}px) translateY(${Math.cos(scrollY * 0.01) * 30}px)`,
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between relative z-10">
          <Link href="/" className="flex items-center gap-3 animate-in slide-in-from-left duration-700">
            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 rounded-xl overflow-hidden shadow-lg shadow-purple-500/25">
              <div className="absolute inset-0.5 bg-black rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-400" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              PlanIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: "Features", href: "/features" },
              { name: "Pricing", href: "/pricing" },
              { name: "Integrations", href: "/integrations" },
              { name: "About", href: "/about" },
              { name: "Blog", href: "/blog" },
              { name: "Contact", href: "/contact" },
            ].map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all duration-500 hover:text-purple-400 relative group animate-in slide-in-from-top duration-700 ${
                  item.href === "/about" ? "text-purple-400" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-purple-400 transition-colors animate-in slide-in-from-right duration-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 animate-in slide-in-from-right duration-700">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-purple-300 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 hover:rotate-1"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 animate-in slide-in-from-top duration-300">
            <div className="container py-6 space-y-4">
              {[
                { name: "Features", href: "/features" },
                { name: "Pricing", href: "/pricing" },
                { name: "Integrations", href: "/integrations" },
                { name: "About", href: "/about" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "/contact" },
              ].map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-lg font-medium text-white hover:text-purple-400 transition-colors animate-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-32 md:py-40 relative z-10">
        <div className="text-center space-y-8 animate-in slide-in-from-bottom duration-1000">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 animate-pulse"
          >
            <Users className="mr-2 h-4 w-4" />
            About PlanIT
          </Badge>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none leading-tight">
            Building the{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Future
            </span>{" "}
            of Work
          </h1>
          <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            We're on a mission to transform how teams collaborate and manage tasks. Through cutting-edge AI technology
            and intuitive design, we're making productivity tools that actually make work more enjoyable.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container px-4 py-32 relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div
            className="space-y-8 animate-in slide-in-from-left duration-1000"
            style={{ transform: `translateX(${Math.sin(scrollY * 0.005) * 10}px)` }}
          >
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300"
            >
              <Target className="mr-2 h-4 w-4" />
              Our Mission
            </Badge>
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Empowering Teams to Achieve More
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We believe that great work happens when teams have the right tools to collaborate effectively. Our mission
              is to eliminate the friction in task management and project coordination, allowing teams to focus on what
              they do best - creating amazing products and services.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Through intelligent automation, predictive insights, and seamless collaboration features, we're building
              the next generation of productivity tools that adapt to how modern teams actually work.
            </p>
          </div>
          <div
            className="relative animate-in slide-in-from-right duration-1000"
            style={{ transform: `translateY(${Math.cos(scrollY * 0.003) * 15}px)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
            <Card className="relative bg-gray-900/90 border border-gray-700 overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      100K+
                    </div>
                    <div className="text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                      50+
                    </div>
                    <div className="text-gray-400">Countries</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                      99.9%
                    </div>
                    <div className="text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      4.9/5
                    </div>
                    <div className="text-gray-400">User Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.003) * 5}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 animate-pulse"
          >
            <Star className="mr-2 h-4 w-4" />
            Our Values
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
            What Drives Us Forward
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Our core values shape every decision we make and every feature we build.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.005 + index) * 8}px) rotate(${Math.sin(scrollY * 0.002 + index) * 2}deg)`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${value.color}/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}
              />
              <Card className="relative z-10 bg-gray-900/90 border border-gray-700 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4 h-full">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${value.color}/20 group-hover:${value.color}/30 transition-all duration-300 group-hover:-rotate-12`}
                    >
                      <div className={`text-white`}>{value.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 flex-1">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.cos(scrollY * 0.002) * 3}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 animate-pulse"
          >
            <Users className="mr-2 h-4 w-4" />
            Meet Our Team
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            The People Behind PlanIT
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Our diverse team of experts brings together decades of experience in technology, design, and product
            development.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-3 hover:rotate-2 animate-in slide-in-from-bottom duration-1000 overflow-hidden"
              style={{
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${Math.cos(scrollY * 0.004 + index) * 6}px) rotate(${Math.sin(scrollY * 0.003 + index) * 1}deg)`,
              }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-2xl">{member.name.charAt(0)}</span>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-white text-lg">{member.name}</h3>
                    <p className="text-purple-400 font-medium">{member.role}</p>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.001) * 2}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-300 animate-pulse"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Our Journey
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-green-200 to-cyan-200 bg-clip-text text-transparent">
            Milestones & Achievements
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            From a small startup to a global platform trusted by thousands of teams worldwide.
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-500 to-cyan-500 opacity-30" />
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center gap-8 animate-in slide-in-from-bottom duration-1000 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  transform: `translateY(${Math.sin(scrollY * 0.003 + index) * 5}px)`,
                }}
              >
                <div className="flex-1">
                  <Card
                    className={`bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 ${
                      index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{milestone.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full relative z-10 animate-pulse" />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-8 relative animate-in slide-in-from-bottom duration-1000"
          style={{
            transform: `translateY(${Math.sin(scrollY * 0.002) * 8}px) rotate(${Math.cos(scrollY * 0.001) * 0.5}deg)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-3xl blur-3xl animate-pulse" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              Ready to Join Our Mission?
            </h2>
            <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed mb-8">
              Be part of the future of work. Join thousands of teams already transforming their productivity with
              PlanIT.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link href="/careers">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white border-0 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:rotate-2 text-lg px-10 py-6 group"
                >
                  <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Join Our Team
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-300 hover:-translate-y-1 hover:-rotate-1 text-lg px-10 py-6 group"
                >
                  <Globe className="mr-2 h-5 w-5 group-hover:animate-spin" />
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl relative z-10">
        <div className="container px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4 animate-in slide-in-from-bottom duration-1000">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  PlanIT
                </span>
              </Link>
              <p className="text-gray-400">
                Intelligent task management for modern teams. Streamline your workflow with AI-powered productivity
                tools.
              </p>
            </div>
            <div className="space-y-4 animate-in slide-in-from-bottom duration-1000 delay-100">
              <h4 className="font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-purple-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-purple-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-purple-400 transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4 animate-in slide-in-from-bottom duration-1000 delay-200">
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-purple-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-purple-400 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4 animate-in slide-in-from-bottom duration-1000 delay-300">
              <h4 className="font-semibold text-white">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help-center" className="hover:text-purple-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-purple-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 animate-in fade-in duration-1000 delay-500">
            <p>&copy; 2024 PlanIT. All rights reserved. Built for productive teams.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

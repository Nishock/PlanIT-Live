"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  CheckSquare,
  Menu,
  X,
  Search,
  Globe,
  MessageSquare,
  Calendar,
  Code,
  Briefcase,
  Palette,
  BarChart3,
  Shield,
  Star,
  CheckCircle,
  ExternalLink,
  Filter,
} from "lucide-react"

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

export default function IntegrationsPage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
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

  const categories = [
    { name: "All", icon: <Globe className="h-4 w-4" />, count: 150 },
    { name: "Communication", icon: <MessageSquare className="h-4 w-4" />, count: 25 },
    { name: "Productivity", icon: <Briefcase className="h-4 w-4" />, count: 30 },
    { name: "Development", icon: <Code className="h-4 w-4" />, count: 35 },
    { name: "Design", icon: <Palette className="h-4 w-4" />, count: 20 },
    { name: "Analytics", icon: <BarChart3 className="h-4 w-4" />, count: 15 },
    { name: "Calendar", icon: <Calendar className="h-4 w-4" />, count: 12 },
    { name: "Security", icon: <Shield className="h-4 w-4" />, count: 13 },
  ]

  const popularIntegrations = [
    {
      name: "Slack",
      description: "Connect your team communication with real-time task updates and notifications.",
      logo: "💬",
      category: "Communication",
      rating: 4.9,
      users: "50K+",
      features: ["Real-time notifications", "Task updates", "Team channels", "Bot commands"],
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Google Workspace",
      description: "Seamlessly integrate with Gmail, Drive, Calendar, and other Google services.",
      logo: "📧",
      category: "Productivity",
      rating: 4.8,
      users: "100K+",
      features: ["Calendar sync", "Drive integration", "Gmail notifications", "Docs collaboration"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "GitHub",
      description: "Link your repositories and track development progress directly in PlanIT.",
      logo: "🐙",
      category: "Development",
      rating: 4.9,
      users: "75K+",
      features: ["Repository sync", "Issue tracking", "Pull request updates", "Commit history"],
      color: "from-gray-600 to-gray-800",
    },
    {
      name: "Figma",
      description: "Collaborate on designs and link design files to your project tasks.",
      logo: "🎨",
      category: "Design",
      rating: 4.7,
      users: "40K+",
      features: ["Design file linking", "Comment sync", "Version tracking", "Team collaboration"],
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Zoom",
      description: "Schedule and join meetings directly from your tasks and project boards.",
      logo: "📹",
      category: "Communication",
      rating: 4.6,
      users: "60K+",
      features: ["Meeting scheduling", "Direct join links", "Recording integration", "Calendar sync"],
      color: "from-blue-600 to-purple-600",
    },
    {
      name: "Jira",
      description: "Sync your development workflow with advanced project tracking capabilities.",
      logo: "🔧",
      category: "Development",
      rating: 4.5,
      users: "35K+",
      features: ["Issue synchronization", "Sprint planning", "Workflow automation", "Custom fields"],
      color: "from-blue-500 to-indigo-600",
    },
  ]

  const allIntegrations = [
    // Communication
    { name: "Microsoft Teams", logo: "👥", category: "Communication", rating: 4.7 },
    { name: "Discord", logo: "🎮", category: "Communication", rating: 4.6 },
    { name: "Telegram", logo: "✈️", category: "Communication", rating: 4.5 },

    // Productivity
    { name: "Notion", logo: "📝", category: "Productivity", rating: 4.8 },
    { name: "Trello", logo: "📋", category: "Productivity", rating: 4.6 },
    { name: "Asana", logo: "🎯", category: "Productivity", rating: 4.7 },
    { name: "Monday.com", logo: "📊", category: "Productivity", rating: 4.5 },

    // Development
    { name: "GitLab", logo: "🦊", category: "Development", rating: 4.6 },
    { name: "Bitbucket", logo: "🪣", category: "Development", rating: 4.4 },
    { name: "Jenkins", logo: "⚙️", category: "Development", rating: 4.3 },
    { name: "Docker", logo: "🐳", category: "Development", rating: 4.7 },

    // Design
    { name: "Adobe Creative Cloud", logo: "🎨", category: "Design", rating: 4.8 },
    { name: "Sketch", logo: "💎", category: "Design", rating: 4.6 },
    { name: "InVision", logo: "👁️", category: "Design", rating: 4.5 },

    // Analytics
    { name: "Google Analytics", logo: "📈", category: "Analytics", rating: 4.7 },
    { name: "Mixpanel", logo: "📊", category: "Analytics", rating: 4.6 },
    { name: "Amplitude", logo: "📉", category: "Analytics", rating: 4.5 },

    // Calendar
    { name: "Outlook Calendar", logo: "📅", category: "Calendar", rating: 4.6 },
    { name: "Apple Calendar", logo: "🍎", category: "Calendar", rating: 4.5 },
    { name: "Calendly", logo: "⏰", category: "Calendar", rating: 4.8 },

    // Security
    { name: "Okta", logo: "🔐", category: "Security", rating: 4.7 },
    { name: "Auth0", logo: "🛡️", category: "Security", rating: 4.6 },
    { name: "1Password", logo: "🔑", category: "Security", rating: 4.8 },
  ]

  const filteredIntegrations = allIntegrations.filter((integration) => {
    const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
              { name: "Contact", href: "/contact" },
              { name: "Blog", href: "/blog" },
            ].map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all duration-500 hover:text-purple-400 relative group animate-in slide-in-from-top duration-700 ${
                  item.href === "/integrations" ? "text-purple-400" : ""
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
                { name: "Contact", href: "/contact" },
                { name: "Blog", href: "/blog" },
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
            <Globe className="mr-2 h-4 w-4" />
            150+ Integrations
          </Badge>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none leading-tight">
            Connect Your{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Favorite
            </span>{" "}
            Tools
          </h1>
          <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Seamlessly integrate PlanIT with the tools your team already uses. From communication to development, design
            to analytics - we've got you covered.
          </p>
        </div>
      </section>

      {/* Popular Integrations */}
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
            Most Popular
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
            Top Integrations
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            The most loved integrations by our users, designed to supercharge your workflow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {popularIntegrations.map((integration, index) => (
            <div
              key={index}
              className="group relative animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.005 + index) * 8}px) rotate(${Math.sin(scrollY * 0.002 + index) * 1}deg)`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${integration.color}/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}
              />
              <Card className="relative z-10 bg-gray-900/90 border border-gray-700 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{integration.logo}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{integration.name}</h3>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                            {integration.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-300">{integration.rating}</span>
                        </div>
                        <p className="text-xs text-gray-400">{integration.users} users</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{integration.description}</p>
                    <ul className="space-y-2">
                      {integration.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 hover:-translate-y-1">
                      Connect Integration
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* All Integrations */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.cos(scrollY * 0.002) * 3}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 animate-pulse"
          >
            <Filter className="mr-2 h-4 w-4" />
            Browse All
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            All Integrations
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Explore our complete library of integrations organized by category.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/90 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                  selectedCategory === category.name
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                    : "bg-gray-900/50 border-gray-700 text-gray-300 hover:border-purple-500/30"
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
                <Badge className="bg-gray-700 text-gray-300 text-xs">{category.count}</Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Integration Grid */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filteredIntegrations.map((integration, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-in slide-in-from-bottom duration-1000 cursor-pointer"
              style={{
                animationDelay: `${index * 50}ms`,
                transform: `translateY(${Math.cos(scrollY * 0.004 + index) * 3}px)`,
              }}
            >
              <CardContent className="p-4 text-center">
                <div className="space-y-3">
                  <div className="text-3xl">{integration.logo}</div>
                  <h3 className="text-sm font-medium text-white">{integration.name}</h3>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-400">{integration.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* API Section */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-8 relative animate-in slide-in-from-bottom duration-1000"
          style={{
            transform: `translateY(${Math.sin(scrollY * 0.002) * 8}px) rotate(${Math.cos(scrollY * 0.001) * 0.5}deg)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-blue-500/10 rounded-3xl blur-3xl animate-pulse" />
          <div className="relative z-10">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-300 animate-pulse mb-6"
            >
              <Code className="mr-2 h-4 w-4" />
              Custom Integration
            </Badge>
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Build Your Own Integration
            </h2>
            <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed mb-8">
              Don't see your favorite tool? Use our powerful API to build custom integrations and connect any service to
              PlanIT.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link href="/docs/api">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-500 hover:-translate-y-1 text-lg px-8 py-6"
                >
                  <Code className="mr-2 h-5 w-5" />
                  View API Docs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-300 hover:-translate-y-1 text-lg px-8 py-6"
                >
                  Request Integration
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

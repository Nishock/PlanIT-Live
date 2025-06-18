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
  Brain,
  Kanban,
  Calendar,
  Bell,
  BarChart3,
  Users,
  Clock,
  Shield,
  Zap,
  Target,
  MessageSquare,
  FileText,
  Smartphone,
  Globe,
  Settings,
  TrendingUp,
  Eye,
  Layers,
  Workflow,
  Database,
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

export default function FeaturesPage() {
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

  const coreFeatures = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Intelligence",
      description:
        "Advanced machine learning algorithms that learn from your team's patterns and automatically optimize workflows, predict bottlenecks, and suggest improvements.",
      color: "from-purple-500 to-pink-500",
      benefits: ["Smart task prioritization", "Predictive analytics", "Automated insights", "Pattern recognition"],
    },
    {
      icon: <Kanban className="h-8 w-8" />,
      title: "Smart Kanban Boards",
      description:
        "Visualize your workflow with intelligent boards that automatically organize tasks, detect dependencies, and adapt to your team's working style.",
      color: "from-cyan-500 to-blue-500",
      benefits: ["Drag & drop interface", "Custom workflows", "Automated sorting", "Visual progress tracking"],
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Intelligent Scheduling",
      description:
        "AI-powered scheduling that analyzes team availability, workload, and priorities to suggest optimal meeting times and task assignments.",
      color: "from-green-500 to-cyan-500",
      benefits: ["Smart time blocking", "Conflict detection", "Resource optimization", "Calendar integration"],
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description:
        "Comprehensive insights into team productivity, project progress, and performance metrics with predictive forecasting and trend analysis.",
      color: "from-orange-500 to-red-500",
      benefits: ["Real-time dashboards", "Custom reports", "Performance metrics", "Trend analysis"],
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description:
        "Seamless collaboration tools including real-time chat, file sharing, video calls, and collaborative editing for enhanced teamwork.",
      color: "from-pink-500 to-purple-500",
      benefits: ["Real-time messaging", "File sharing", "Video conferencing", "Collaborative editing"],
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Smart Notifications",
      description:
        "Intelligent notification system that learns your preferences and sends contextual alerts at the right time without overwhelming you.",
      color: "from-blue-500 to-purple-500",
      benefits: ["Context-aware alerts", "Custom notification rules", "Smart timing", "Multi-channel delivery"],
    },
  ]

  const additionalFeatures = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Tracking",
      description: "Automatic time tracking with detailed reports and productivity insights.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with SSO, 2FA, and compliance certifications.",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Apps",
      description: "Native iOS and Android apps with offline sync capabilities.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Access",
      description: "Multi-language support and global CDN for fast access worldwide.",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Custom Workflows",
      description: "Build custom workflows and automation rules tailored to your needs.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Document Management",
      description: "Centralized document storage with version control and collaboration.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Goal Tracking",
      description: "Set and track team goals with progress visualization and milestones.",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Project Visibility",
      description: "Complete project transparency with stakeholder dashboards.",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Template Library",
      description: "Pre-built templates for common project types and workflows.",
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Process Automation",
      description: "Automate repetitive tasks and streamline your processes.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Export",
      description: "Export your data in multiple formats with API access.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Performance Insights",
      description: "Deep insights into team performance and productivity trends.",
    },
  ]

  const integrations = [
    { name: "Slack", logo: "💬" },
    { name: "Google Workspace", logo: "📧" },
    { name: "Microsoft Teams", logo: "👥" },
    { name: "GitHub", logo: "🐙" },
    { name: "Figma", logo: "🎨" },
    { name: "Zoom", logo: "📹" },
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
                  item.href === "/features" ? "text-purple-400" : ""
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
            <Zap className="mr-2 h-4 w-4" />
            Powerful Features
          </Badge>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none leading-tight">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Succeed
            </span>
          </h1>
          <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Discover the comprehensive suite of AI-powered features designed to transform how your team works,
            collaborates, and achieves goals.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.003) * 5}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 animate-pulse"
          >
            <Brain className="mr-2 h-4 w-4" />
            Core Features
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Intelligent Task Management
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Experience the future of productivity with AI-powered features that learn from your workflow and optimize
            your team's performance.
          </p>
        </div>

        <div className="grid gap-12 lg:gap-16">
          {coreFeatures.map((feature, index) => (
            <div
              key={index}
              className={`grid gap-12 lg:grid-cols-2 lg:gap-16 items-center animate-in slide-in-from-bottom duration-1000 ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
              style={{
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.005 + index) * 8}px)`,
              }}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${feature.color}/20 group-hover:${feature.color}/30 transition-all duration-300`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`} />
                      <span className="text-gray-200">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`relative ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color}/10 rounded-3xl blur-2xl animate-pulse`}
                />
                <Card className="relative z-10 bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                      <div className={`text-6xl opacity-20`}>{feature.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.cos(scrollY * 0.002) * 3}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-300 animate-pulse"
          >
            <Settings className="mr-2 h-4 w-4" />
            Additional Features
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-green-200 to-cyan-200 bg-clip-text text-transparent">
            Everything You Need & More
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Comprehensive tools and features to support every aspect of your team's workflow and productivity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {additionalFeatures.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.004 + index) * 5}px) rotate(${Math.cos(scrollY * 0.003 + index) * 1}deg)`,
              }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-purple-500/20 w-fit">
                    <div className="text-purple-400">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Integrations Preview */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.001) * 2}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300 animate-pulse"
          >
            <Globe className="mr-2 h-4 w-4" />
            Integrations
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
            Connect Your Favorite Tools
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Seamlessly integrate with the tools your team already uses and loves.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {integrations.map((integration, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `translateY(${Math.cos(scrollY * 0.005 + index) * 4}px)`,
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="space-y-3">
                  <div className="text-4xl">{integration.logo}</div>
                  <h3 className="text-sm font-medium text-white">{integration.name}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/integrations">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-500 hover:-translate-y-1"
            >
              View All Integrations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
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
              Ready to Experience These Features?
            </h2>
            <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed mb-8">
              Start your free trial today and discover how PlanIT's powerful features can transform your team's
              productivity.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white border-0 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:rotate-2 text-lg px-10 py-6 group"
                >
                  <Zap className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-300 hover:-translate-y-1 hover:-rotate-1 text-lg px-10 py-6 group"
                >
                  <MessageSquare className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Schedule Demo
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

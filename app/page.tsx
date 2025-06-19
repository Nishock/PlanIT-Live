"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  Sparkles,
  Brain,
  Zap,
  Rocket,
  Star,
  Menu,
  X,
  Play,
  TrendingUp,
  Calendar,
  Clock,
  CheckSquare,
  Kanban,
  Bell,
  FileText,
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

export default function PlanITLanding() {
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

  const features = [
    {
      icon: <Kanban className="h-8 w-8" />,
      title: "Smart Kanban Boards",
      description:
        "Visualize your workflow with intelligent boards that automatically organize and prioritize tasks based on deadlines and dependencies.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "AI-Powered Scheduling",
      description:
        "Let our AI optimize your team's schedule by analyzing workload patterns and suggesting the best times for tasks and meetings.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Smart Notifications",
      description:
        "Get contextual alerts that matter. Our system learns your preferences and sends notifications at the right time.",
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Progress Analytics",
      description:
        "Track team productivity with detailed insights, burndown charts, and predictive analytics for project completion.",
      color: "from-green-500 to-cyan-500",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description:
        "Real-time collaboration with task comments, file sharing, and integrated video calls for seamless teamwork.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Time Tracking",
      description:
        "Automatic time tracking with detailed reports, helping you understand where time is spent and optimize workflows.",
      color: "from-blue-500 to-purple-500",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Project Manager, TechCorp",
      content:
        "PlanIT revolutionized how our team manages projects. The AI scheduling feature alone saved us 10 hours per week.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Marcus Rodriguez",
      role: "Team Lead, StartupXYZ",
      content: "The smart Kanban boards automatically prioritize our tasks. We've increased our delivery speed by 40%.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Director, InnovateLab",
      content:
        "The analytics dashboard gives us insights we never had before. We can predict project delays weeks in advance.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const pricingPlans = [
    {
      name: "Personal",
      price: "$9",
      description: "Perfect for individual task management",
      features: ["Up to 5 projects", "Basic Kanban boards", "Task scheduling", "Mobile app access", "Email support"],
      popular: false,
    },
    {
      name: "Team",
      price: "$29",
      description: "Advanced features for growing teams",
      features: [
        "Up to 25 team members",
        "AI-powered scheduling",
        "Advanced analytics",
        "Time tracking",
        "Priority support",
        "Custom integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "Full power for large organizations",
      features: [
        "Unlimited team members",
        "Advanced AI features",
        "Custom workflows",
        "24/7 dedicated support",
        "SSO & security features",
        "API access",
      ],
      popular: false,
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
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-bounce"
          style={{
            animationDuration: "8s",
            animationDelay: "2s",
            transform: `translateX(${Math.cos(scrollY * 0.005) * 40}px) translateY(${Math.sin(scrollY * 0.005) * 20}px)`,
          }}
        />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 border border-purple-500/30 animate-pulse`}
            style={{
              left: `${15 + i * 12}%`,
              top: `${25 + i * 8}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + i * 0.5}s`,
              transform: `translateY(${Math.sin(scrollY * 0.02 + i) * 30}px) rotate(${scrollY * 0.2 + i * 45}deg)`,
              borderRadius: i % 2 === 0 ? "50%" : "0%",
            }}
          />
        ))}
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
                className="text-sm font-medium transition-all duration-500 hover:text-purple-400 relative group animate-in slide-in-from-top duration-700"
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
              <div className="pt-4 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-32 md:py-40 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div
            className="flex flex-col justify-center space-y-8 animate-in slide-in-from-left duration-1000"
            style={{ transform: `translateX(${Math.sin(scrollY * 0.005) * 10}px)` }}
          >
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="w-fit bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 hover:rotate-3 transition-transform duration-300 animate-in fade-in duration-1000"
              >
                <Sparkles className="mr-2 h-4 w-4 animate-spin" style={{ animationDuration: "3s" }} />
                AI-Powered Task Management
              </Badge>
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none leading-tight animate-in slide-in-from-bottom duration-1000 delay-200">
                Revolutionize Your{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Task Management
                </span>{" "}
                with Smart{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Automation
                </span>
              </h1>
              <p className="max-w-[600px] text-gray-300 md:text-xl leading-relaxed animate-in slide-in-from-bottom duration-1000 delay-400">
                Transform how your team works with PlanIT's intelligent task management platform. AI-powered scheduling,
                smart prioritization, and seamless collaboration in one beautiful interface.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row animate-in slide-in-from-bottom duration-1000 delay-600">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white border-0 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-1 text-lg px-8 py-6 group cursor-magnetic"
                >
                  <Zap className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Start Managing Tasks
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-200 transition-all duration-300 hover:-translate-y-1 text-lg px-8 py-6 group cursor-magnetic"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Watch Demo
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              {[
                { icon: CheckCircle, text: "14-day free trial" },
                { icon: CheckCircle, text: "No credit card required" },
                { icon: CheckCircle, text: "Cancel anytime" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 animate-in slide-in-from-bottom duration-1000"
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <item.icon className="h-5 w-5 text-green-400 animate-pulse" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="flex items-center justify-center relative animate-in slide-in-from-right duration-1000"
            style={{
              transform: `translateY(${Math.cos(scrollY * 0.003) * 15}px) rotateY(${Math.sin(scrollY * 0.002) * 5}deg)`,
            }}
          >
            <div className="w-full max-w-lg h-[500px] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl animate-pulse" />
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-purple-500/20 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
                <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center space-y-6">
                  <div
                    className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center animate-spin"
                    style={{ animationDuration: "10s" }}
                  >
                    <Kanban className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Smart Dashboard
                    </h3>
                    <p className="text-gray-400">AI Task Management</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 w-full">
                    {[Calendar, Clock, FileText].map((Icon, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Icon className="w-6 h-6 text-purple-400 mx-auto animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.003) * 5}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 animate-pulse"
          >
            <Brain className="mr-2 h-4 w-4 animate-bounce" />
            Smart Features
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Intelligent Task Management
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Experience the future of productivity with AI-powered features that learn from your workflow and optimize
            your team's performance.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative animate-in slide-in-from-bottom duration-1000 cursor-magnetic"
              style={{
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.005 + index) * 8}px) rotate(${Math.sin(scrollY * 0.002 + index) * 2}deg)`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color.replace("to-", "to-").replace("from-", "from-")}/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}
              />
              <Card className="relative z-10 bg-gray-900/90 border border-gray-700 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col items-start space-y-4">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${feature.color}/20 group-hover:${feature.color}/30 transition-all duration-300 group-hover:-rotate-12`}
                    >
                      <div className={`text-white`}>{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.cos(scrollY * 0.002) * 3}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 animate-pulse"
          >
            <Star className="mr-2 h-4 w-4 animate-spin" style={{ animationDuration: "4s" }} />
            Success Stories
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
            Loved by Teams Worldwide
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            See how teams are transforming their productivity with PlanIT's intelligent task management.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-3 hover:rotate-2 animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${Math.cos(scrollY * 0.004 + index) * 6}px) rotate(${Math.sin(scrollY * 0.003 + index) * 1}deg)`,
              }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-200 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.001) * 2}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-300 animate-pulse"
          >
            <TrendingUp className="mr-2 h-4 w-4 animate-bounce" />
            Simple Pricing
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-green-200 to-cyan-200 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Start free and scale as you grow. All plans include our core task management features.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-gray-900/90 border transition-all duration-500 hover:-translate-y-4 hover:rotate-1 animate-in slide-in-from-bottom duration-1000 ${
                plan.popular
                  ? "border-purple-500/50 shadow-2xl shadow-purple-500/20"
                  : "border-gray-700 hover:border-purple-500/30"
              }`}
              style={{
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.003 + index) * 5}px) rotate(${Math.cos(scrollY * 0.002 + index) * 1}deg)`,
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white animate-pulse">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-gray-400">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 animate-pulse" />
                        <span className="text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full transition-all duration-300 hover:-translate-y-1 hover:rotate-1 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25"
                        : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                    }`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6 animate-pulse">
              Ready to Transform Your Workflow?
            </h2>
            <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed mb-8">
              Join thousands of teams already using PlanIT to manage tasks smarter, collaborate better, and achieve more
              together.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white border-0 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:rotate-2 text-lg px-10 py-6 group"
                >
                  <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
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
                  <Star className="mr-2 h-5 w-5 group-hover:animate-spin" />
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

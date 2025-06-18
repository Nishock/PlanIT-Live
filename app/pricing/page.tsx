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
  Check,
  Star,
  Zap,
  Users,
  Shield,
  Globe,
  Clock,
  TrendingUp,
  Crown,
  Sparkles,
  Building,
  CreditCard,
  Calendar,
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

export default function PricingPage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")
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

  const plans = [
    {
      name: "Free",
      description: "Perfect for individuals and small teams getting started",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Up to 5 team members",
        "Basic task management",
        "Simple project boards",
        "Email support",
        "1GB storage",
        "Basic integrations",
      ],
      limitations: ["No AI features", "Limited analytics", "No priority support"],
      color: "from-gray-500 to-slate-500",
      popular: false,
      icon: <CheckSquare className="h-6 w-6" />,
    },
    {
      name: "Pro",
      description: "Ideal for growing teams that need advanced features",
      price: { monthly: 12, yearly: 10 },
      features: [
        "Up to 50 team members",
        "AI-powered scheduling",
        "Advanced analytics",
        "Priority support",
        "10GB storage",
        "All integrations",
        "Custom workflows",
        "Time tracking",
        "Advanced reporting",
        "API access",
      ],
      limitations: [],
      color: "from-purple-500 to-pink-500",
      popular: true,
      icon: <Star className="h-6 w-6" />,
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced security needs",
      price: { monthly: 25, yearly: 20 },
      features: [
        "Unlimited team members",
        "Advanced AI features",
        "Custom AI training",
        "Dedicated support",
        "Unlimited storage",
        "Custom integrations",
        "Advanced security",
        "SSO & 2FA",
        "Compliance reporting",
        "Custom branding",
        "On-premise option",
        "SLA guarantee",
      ],
      limitations: [],
      color: "from-cyan-500 to-blue-500",
      popular: false,
      icon: <Crown className="h-6 w-6" />,
    },
  ]

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning for smart task scheduling and insights",
      available: { free: false, pro: true, enterprise: true },
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Real-time collaboration tools for seamless teamwork",
      available: { free: true, pro: true, enterprise: true },
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with SSO, 2FA, and compliance",
      available: { free: false, pro: true, enterprise: true },
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Access",
      description: "Multi-language support and global CDN for fast access",
      available: { free: true, pro: true, enterprise: true },
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Time Tracking",
      description: "Automatic time tracking with detailed reports",
      available: { free: false, pro: true, enterprise: true },
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Comprehensive insights and predictive analytics",
      available: { free: false, pro: true, enterprise: true },
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      content: "PlanIT Pro has transformed how our team works. The AI scheduling alone saved us 10 hours per week.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      company: "StartupXYZ",
      content: "The Enterprise plan gives us everything we need for our growing team. Excellent support and features.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Team Lead",
      company: "DesignStudio",
      content: "We started with the free plan and upgraded to Pro. The transition was seamless and worth every penny.",
      rating: 5,
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
                  item.href === "/pricing" ? "text-purple-400" : ""
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
            <CreditCard className="mr-2 h-4 w-4" />
            Simple Pricing
          </Badge>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none leading-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Plan
            </span>
          </h1>
          <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Start free and scale as you grow. No hidden fees, no surprises. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-white" : "text-gray-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                billingCycle === "yearly" ? "bg-purple-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                  billingCycle === "yearly" ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === "yearly" ? "text-white" : "text-gray-400"}`}>
              Yearly
              <Badge className="ml-2 bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="container px-4 py-32 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative animate-in slide-in-from-bottom duration-1000 ${
                plan.popular ? "lg:scale-105" : ""
              }`}
              style={{
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.005 + index) * 8}px)`,
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-2">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${plan.color}/10 rounded-3xl blur-xl ${
                  plan.popular ? "blur-2xl" : ""
                } transition-all duration-500`}
              />
              <Card
                className={`relative z-10 bg-gray-900/90 border transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full ${
                  plan.popular
                    ? "border-purple-500/50 shadow-2xl shadow-purple-500/25"
                    : "border-gray-700 hover:border-purple-500/30"
                }`}
              >
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${plan.color}/20 transition-all duration-300`}
                        >
                          <div className="text-white">{plan.icon}</div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                          <p className="text-gray-400 text-sm">{plan.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-white">
                            ${plan.price[billingCycle]}
                          </span>
                          {plan.price[billingCycle] > 0 && (
                            <span className="text-gray-400">
                              /{billingCycle === "monthly" ? "mo" : "mo, billed yearly"}
                            </span>
                          )}
                        </div>
                        {plan.price[billingCycle] === 0 && (
                          <span className="text-gray-400">Forever free</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">What's included:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
                            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {plan.limitations.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-gray-700">
                          <h4 className="font-semibold text-gray-400">Not included:</h4>
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation, limitationIndex) => (
                              <li key={limitationIndex} className="flex items-center gap-3">
                                <div className="h-4 w-4 rounded-full border border-gray-600 flex-shrink-0" />
                                <span className="text-gray-500">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <Button
                      className={`w-full transition-all duration-500 hover:-translate-y-1 ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                          : plan.price[billingCycle] === 0
                          ? "bg-gray-700 hover:bg-gray-600 text-white border-0"
                          : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border-0"
                      }`}
                    >
                      {plan.price[billingCycle] === 0 ? "Get Started Free" : "Start Free Trial"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.003) * 5}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 animate-pulse"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Feature Comparison
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Compare Plans
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            See exactly what's included in each plan to make the best choice for your team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `translateY(${Math.cos(scrollY * 0.003 + index) * 3}px)`,
              }}
            >
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-4 items-center">
                  <div className="md:col-span-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <div className="text-purple-400">{feature.icon}</div>
                      </div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-3 gap-4">
                    {["free", "pro", "enterprise"].map((plan, planIndex) => (
                      <div key={plan} className="text-center">
                        {feature.available[plan as keyof typeof feature.available] ? (
                          <Check className="h-6 w-6 text-green-400 mx-auto" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border border-gray-600 mx-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <Star className="mr-2 h-4 w-4" />
            Customer Stories
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
            Loved by Teams Worldwide
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            See how teams are transforming their productivity with PlanIT.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.004 + index) * 5}px)`,
              }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.001) * 2}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-300 animate-pulse"
          >
            <Building className="mr-2 h-4 w-4" />
            Common Questions
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-green-200 to-cyan-200 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-gray-900/90 border border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/90 border border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Is there a free trial?</h3>
              <p className="text-gray-300">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/90 border border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-300">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are processed securely.
              </p>
            </CardContent>
          </Card>
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
              Ready to Get Started?
            </h2>
            <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed mb-8">
              Join thousands of teams already using PlanIT to boost their productivity and achieve more together.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white border-0 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:rotate-2 text-lg px-10 py-6 group"
                >
                  <Sparkles className="mr-2 h-5 w-5 group-hover:animate-bounce" />
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
                  <Building className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Contact Sales
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
                Intelligent task management for modern teams. Streamline your workflow with AI-powered productivity tools.
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
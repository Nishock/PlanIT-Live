"use client"

import type React from "react"

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
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Globe,
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

export default function ContactPage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const contactMethods = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Us",
      description: "Get in touch via email for general inquiries",
      contact: "hello@planit.com",
      action: "Send Email",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Call Us",
      description: "Speak directly with our support team",
      contact: "+1 (555) 123-4567",
      action: "Call Now",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Live Chat",
      description: "Chat with us in real-time for instant help",
      contact: "Available 24/7",
      action: "Start Chat",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Support Center",
      description: "Browse our knowledge base and tutorials",
      contact: "help.planit.com",
      action: "Visit Center",
      color: "from-orange-500 to-red-500",
    },
  ]

  const offices = [
    {
      city: "San Francisco",
      address: "123 Innovation Drive, Suite 100",
      zipcode: "San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
    },
    {
      city: "New York",
      address: "456 Business Ave, Floor 25",
      zipcode: "New York, NY 10001",
      phone: "+1 (555) 987-6543",
    },
    {
      city: "London",
      address: "789 Tech Street, Level 5",
      zipcode: "London, UK EC1A 1BB",
      phone: "+44 20 7123 4567",
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
              { name: "Blog", href: "/blog" },
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
            <Mail className="mr-2 h-4 w-4" />
            Contact Us
          </Badge>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none leading-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Touch
            </span>{" "}
            with Us
          </h1>
          <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Have questions about PlanIT? Need help getting started? Our team is here to help you succeed. Reach out to
            us through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container px-4 py-32 relative z-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="group relative animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.005 + index) * 8}px) rotate(${Math.sin(scrollY * 0.002 + index) * 2}deg)`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${method.color}/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}
              />
              <Card className="relative z-10 bg-gray-900/90 border border-gray-700 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4 h-full">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${method.color}/20 group-hover:${method.color}/30 transition-all duration-300 group-hover:-rotate-12`}
                    >
                      <div className="text-white">{method.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                      {method.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 flex-1">
                      {method.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-purple-400 font-medium">{method.contact}</p>
                      <Button
                        size="sm"
                        className={`bg-gradient-to-r ${method.color} hover:opacity-90 text-white border-0 transition-all duration-300 hover:-translate-y-1`}
                      >
                        {method.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="container px-4 py-32 relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 items-start">
          <div
            className="space-y-8 animate-in slide-in-from-left duration-1000"
            style={{ transform: `translateX(${Math.sin(scrollY * 0.005) * 10}px)` }}
          >
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Badge>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Drop Us a Line
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Fill out the form below and we'll get back to you within 24 hours. For urgent matters, please use our
                live chat or call us directly.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="h-5 w-5 text-purple-400" />
                <span>Response time: Within 24 hours</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Globe className="h-5 w-5 text-cyan-400" />
                <span>Available in multiple languages</span>
              </div>
            </div>
          </div>

          <div
            className="animate-in slide-in-from-right duration-1000"
            style={{ transform: `translateY(${Math.cos(scrollY * 0.003) * 15}px)` }}
          >
            <Card className="bg-gray-900/90 border border-gray-700 overflow-hidden">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 hover:-translate-y-1 group"
                  >
                    <Send className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Send Message
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.003) * 5}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-300 animate-pulse"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Our Offices
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-green-200 to-cyan-200 bg-clip-text text-transparent">
            Visit Us Worldwide
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            We have offices around the globe to better serve our international community.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {offices.map((office, index) => (
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
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {office.city}
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p>{office.address}</p>
                        <p>{office.zipcode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-cyan-400" />
                      <p>{office.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                <li>
                  <Link href="/careers" className="hover:text-purple-400 transition-colors">
                    Careers
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
                <li>
                  <Link href="/status" className="hover:text-purple-400 transition-colors">
                    Status
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

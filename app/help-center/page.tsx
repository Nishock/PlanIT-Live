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
  HelpCircle,
  BookOpen,
  MessageSquare,
  Video,
  FileText,
  Users,
  Settings,
  Zap,
  Shield,
  BarChart3,
  ChevronRight,
  ExternalLink,
  Download,
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

export default function HelpCenterPage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
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

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics and set up your account",
      icon: <Zap className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
      articles: 12,
      popular: true,
    },
    {
      title: "Task Management",
      description: "Master task creation, organization, and tracking",
      icon: <CheckSquare className="h-8 w-8" />,
      color: "from-cyan-500 to-blue-500",
      articles: 18,
      popular: true,
    },
    {
      title: "Team Collaboration",
      description: "Work effectively with your team members",
      icon: <Users className="h-8 w-8" />,
      color: "from-green-500 to-cyan-500",
      articles: 15,
      popular: false,
    },
    {
      title: "Integrations",
      description: "Connect PlanIT with your favorite tools",
      icon: <Settings className="h-8 w-8" />,
      color: "from-orange-500 to-red-500",
      articles: 25,
      popular: false,
    },
    {
      title: "Analytics & Reports",
      description: "Understand your team's productivity metrics",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "from-pink-500 to-purple-500",
      articles: 10,
      popular: false,
    },
    {
      title: "Account & Security",
      description: "Manage your account settings and security",
      icon: <Shield className="h-8 w-8" />,
      color: "from-blue-500 to-purple-500",
      articles: 8,
      popular: false,
    },
  ]

  const popularArticles = [
    {
      title: "How to Create Your First Project",
      description: "Step-by-step guide to setting up your first project in PlanIT",
      category: "Getting Started",
      readTime: "3 min read",
      views: "15.2K",
      helpful: 245,
    },
    {
      title: "Setting Up Team Permissions",
      description: "Learn how to manage team access and permissions effectively",
      category: "Team Collaboration",
      readTime: "5 min read",
      views: "12.8K",
      helpful: 189,
    },
    {
      title: "Connecting Slack to PlanIT",
      description: "Complete guide to integrating Slack with your workspace",
      category: "Integrations",
      readTime: "4 min read",
      views: "11.5K",
      helpful: 167,
    },
    {
      title: "Understanding Task Dependencies",
      description: "Master task relationships and project workflows",
      category: "Task Management",
      readTime: "6 min read",
      views: "9.7K",
      helpful: 134,
    },
    {
      title: "Creating Custom Reports",
      description: "Build personalized reports for your team's needs",
      category: "Analytics & Reports",
      readTime: "7 min read",
      views: "8.3K",
      helpful: 112,
    },
  ]

  const quickActions = [
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: <Video className="h-6 w-6" />,
      action: "Watch Now",
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Download Resources",
      description: "Get templates and guides",
      icon: <Download className="h-6 w-6" />,
      action: "Download",
      color: "from-green-500 to-cyan-500",
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: <MessageSquare className="h-6 w-6" />,
      action: "Contact Us",
      color: "from-blue-500 to-purple-500",
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: <Users className="h-6 w-6" />,
      action: "Join Forum",
      color: "from-orange-500 to-red-500",
    },
  ]

  const faqs = [
    {
      question: "How do I invite team members to my workspace?",
      answer:
        "You can invite team members by going to Settings > Team Management and clicking 'Invite Members'. Enter their email addresses and select their permission level.",
    },
    {
      question: "Can I use PlanIT offline?",
      answer:
        "PlanIT requires an internet connection for real-time collaboration features. However, our mobile apps support limited offline functionality for viewing and editing tasks.",
    },
    {
      question: "How do I backup my data?",
      answer:
        "Your data is automatically backed up in real-time. You can also export your data anytime from Settings > Data Export. Enterprise plans include additional backup options.",
    },
    {
      question: "What integrations are available?",
      answer:
        "PlanIT integrates with 150+ tools including Slack, Google Workspace, GitHub, Figma, Zoom, and many more. Check our Integrations page for the complete list.",
    },
    {
      question: "How do I upgrade my plan?",
      answer:
        "You can upgrade your plan anytime from Settings > Billing. Changes take effect immediately, and you'll only pay the prorated difference.",
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
            <HelpCircle className="mr-2 h-4 w-4" />
            Help Center
          </Badge>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none leading-tight">
            How Can We{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Help
            </span>{" "}
            You?
          </h1>
          <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Find answers, get support, and learn how to make the most of PlanIT with our comprehensive help resources.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/90 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container px-4 py-16 relative z-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-in slide-in-from-bottom duration-1000 cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.005 + index) * 5}px)`,
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${action.color}/20 w-fit mx-auto`}>
                    <div className="text-white">{action.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                  <p className="text-gray-300 text-sm">{action.description}</p>
                  <Button
                    size="sm"
                    className={`bg-gradient-to-r ${action.color} hover:opacity-90 text-white border-0 transition-all duration-300 hover:-translate-y-1`}
                  >
                    {action.action}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Help Categories */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.003) * 5}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 animate-pulse"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Browse by Category
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Find What You Need
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Explore our organized help categories to quickly find the information you're looking for.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((category, index) => (
            <div
              key={index}
              className="group relative animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.005 + index) * 8}px) rotate(${Math.sin(scrollY * 0.002 + index) * 1}deg)`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${category.color}/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}
              />
              <Card className="relative z-10 bg-gray-900/90 border border-gray-700 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 overflow-hidden h-full cursor-pointer">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${category.color}/20 group-hover:${category.color}/30 transition-all duration-300 group-hover:-rotate-12`}
                      >
                        <div className="text-white">{category.icon}</div>
                      </div>
                      {category.popular && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">Popular</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                      {category.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{category.articles} articles</span>
                      <ChevronRight className="h-5 w-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Articles */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.cos(scrollY * 0.002) * 3}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 animate-pulse"
          >
            <FileText className="mr-2 h-4 w-4" />
            Most Popular
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
            Popular Articles
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            The most helpful articles based on user feedback and views.
          </p>
        </div>

        <div className="space-y-4">
          {popularArticles.map((article, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1 animate-in slide-in-from-bottom duration-1000 cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.004 + index) * 3}px)`,
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white hover:text-purple-300 transition-colors">
                        {article.title}
                      </h3>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        {article.category}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm">{article.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{article.readTime}</span>
                      <span>{article.views} views</span>
                      <span>{article.helpful} found helpful</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-purple-400 hover:translate-x-1 transition-transform" />
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
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-green-200 to-cyan-200 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Quick answers to the most common questions about PlanIT.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1 animate-in slide-in-from-bottom duration-1000"
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.003 + index) * 3}px)`,
              }}
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Support */}
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
              Still Need Help?
            </h2>
            <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed mb-8">
              Can't find what you're looking for? Our support team is here to help you succeed with PlanIT.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white border-0 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:rotate-2 text-lg px-10 py-6 group"
                >
                  <MessageSquare className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Contact Support
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-300 hover:-translate-y-1 hover:-rotate-1 text-lg px-10 py-6 group"
              >
                <Users className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Join Community
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
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

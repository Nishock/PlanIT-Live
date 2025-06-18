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
  Calendar,
  User,
  Clock,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Eye,
  ThumbsUp,
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

export default function BlogPage() {
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
    { name: "All", count: 45 },
    { name: "Productivity", count: 12 },
    { name: "AI & Technology", count: 8 },
    { name: "Team Management", count: 10 },
    { name: "Best Practices", count: 9 },
    { name: "Case Studies", count: 6 },
  ]

  const featuredPost = {
    title: "The Future of AI-Powered Task Management: 2024 Trends and Predictions",
    excerpt:
      "Explore how artificial intelligence is revolutionizing the way teams manage tasks, collaborate, and achieve their goals. From predictive analytics to automated workflows, discover what's next in productivity technology.",
    author: "Sarah Johnson",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "AI & Technology",
    image: "/placeholder.svg?height=400&width=800",
    views: "2.5K",
    likes: "156",
  }

  const blogPosts = [
    {
      title: "10 Proven Strategies to Boost Team Productivity in Remote Work",
      excerpt:
        "Discover actionable strategies that successful remote teams use to maintain high productivity and strong collaboration.",
      author: "Michael Chen",
      date: "December 12, 2024",
      readTime: "6 min read",
      category: "Productivity",
      image: "/placeholder.svg?height=300&width=400",
      views: "1.8K",
      likes: "89",
    },
    {
      title: "How to Build Effective Workflows with Smart Automation",
      excerpt:
        "Learn how to leverage automation tools to streamline your team's workflow and eliminate repetitive tasks.",
      author: "Emily Rodriguez",
      date: "December 10, 2024",
      readTime: "5 min read",
      category: "Best Practices",
      image: "/placeholder.svg?height=300&width=400",
      views: "1.2K",
      likes: "67",
    },
    {
      title: "Case Study: How TechCorp Increased Efficiency by 40% with PlanIT",
      excerpt:
        "A detailed look at how a 500-person company transformed their project management and achieved remarkable results.",
      author: "David Kim",
      date: "December 8, 2024",
      readTime: "7 min read",
      category: "Case Studies",
      image: "/placeholder.svg?height=300&width=400",
      views: "2.1K",
      likes: "134",
    },
    {
      title: "The Psychology of Task Management: Why Some Teams Excel",
      excerpt: "Understanding the psychological factors that drive successful task management and team performance.",
      author: "Dr. Lisa Wang",
      date: "December 5, 2024",
      readTime: "9 min read",
      category: "Team Management",
      image: "/placeholder.svg?height=300&width=400",
      views: "1.5K",
      likes: "92",
    },
    {
      title: "Integrating AI into Your Daily Workflow: A Practical Guide",
      excerpt:
        "Step-by-step instructions for incorporating AI tools into your existing workflow without disrupting productivity.",
      author: "Alex Thompson",
      date: "December 3, 2024",
      readTime: "6 min read",
      category: "AI & Technology",
      image: "/placeholder.svg?height=300&width=400",
      views: "1.9K",
      likes: "108",
    },
    {
      title: "Building High-Performance Teams: Lessons from Top Companies",
      excerpt:
        "Insights from industry leaders on creating and maintaining high-performance teams in the modern workplace.",
      author: "Rachel Green",
      date: "December 1, 2024",
      readTime: "8 min read",
      category: "Team Management",
      image: "/placeholder.svg?height=300&width=400",
      views: "1.7K",
      likes: "95",
    },
  ]

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
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
                  item.href === "/blog" ? "text-purple-400" : ""
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
            <BookOpen className="mr-2 h-4 w-4" />
            PlanIT Blog
          </Badge>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none leading-tight">
            Insights &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Ideas
            </span>{" "}
            for Better Work
          </h1>
          <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Discover the latest trends, best practices, and insights to help your team work smarter, collaborate better,
            and achieve more.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.sin(scrollY * 0.003) * 5}px)` }}
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 animate-pulse mb-8"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Featured Article
          </Badge>

          <Card className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                  <div className="text-6xl opacity-30">📊</div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 w-fit">
                      {featuredPost.category}
                    </Badge>
                    <h2 className="text-3xl font-bold text-white leading-tight">{featuredPost.title}</h2>
                    <p className="text-gray-300 leading-relaxed">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{featuredPost.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{featuredPost.likes}</span>
                      </div>
                    </div>
                    <Button className="w-fit bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 hover:-translate-y-1">
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
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
                className={`px-4 py-2 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                  selectedCategory === category.name
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                    : "bg-gray-900/50 border-gray-700 text-gray-300 hover:border-purple-500/30"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-6 mb-20 animate-in slide-in-from-bottom duration-1000"
          style={{ transform: `translateY(${Math.cos(scrollY * 0.002) * 3}px)` }}
        >
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Latest Articles
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed">
            Stay up to date with the latest insights, tips, and best practices for modern teams.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <Card
              key={index}
              className="bg-gray-900/90 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-3 hover:rotate-1 animate-in slide-in-from-bottom duration-1000 overflow-hidden cursor-pointer"
              style={{
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin(scrollY * 0.004 + index) * 5}px) rotate(${Math.cos(scrollY * 0.003 + index) * 1}deg)`,
              }}
            >
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-4xl opacity-30">
                    {post.category === "Productivity" && "⚡"}
                    {post.category === "AI & Technology" && "🤖"}
                    {post.category === "Team Management" && "👥"}
                    {post.category === "Best Practices" && "✨"}
                    {post.category === "Case Studies" && "📈"}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 w-fit text-xs">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-white leading-tight hover:text-purple-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-200 transition-all duration-300 hover:-translate-y-1"
          >
            Load More Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container px-4 py-32 relative z-10">
        <div
          className="text-center space-y-8 relative animate-in slide-in-from-bottom duration-1000"
          style={{
            transform: `translateY(${Math.sin(scrollY * 0.002) * 8}px) rotate(${Math.cos(scrollY * 0.001) * 0.5}deg)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-3xl blur-3xl animate-pulse" />
          <div className="relative z-10">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-300 animate-pulse mb-6"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Stay Updated
            </Badge>
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Never Miss an Update
            </h2>
            <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl leading-relaxed mb-8">
              Subscribe to our newsletter and get the latest insights, tips, and best practices delivered directly to
              your inbox.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-900/90 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <Button className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-500 hover:-translate-y-1">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
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

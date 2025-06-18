"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "PLANIT has transformed how our team collaborates. The AI features save us hours every week, and the interface is incredibly intuitive.",
    company: "TechCorp",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Engineering Lead at DevStudio",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "We've tried many project management tools, but PLANIT stands out with its powerful AI capabilities and seamless integration with our workflow.",
    company: "DevStudio",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Creative Director at DesignHub",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "The visual planning tools and 3D interface make PLANIT not just functional but a joy to use. It's become an essential part of our creative process.",
    company: "DesignHub",
  },
]

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [current, autoplay])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-none bg-background/50 backdrop-blur-sm shadow-md">
            <CardContent className="p-6 md:p-8">
              <Quote className="h-10 w-10 text-purple-500 mb-4 opacity-50" />
              <p className="text-lg md:text-xl mb-6">"{testimonials[current].content}"</p>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={testimonials[current].avatar || "/placeholder.svg"}
                    alt={testimonials[current].name}
                  />
                  <AvatarFallback>
                    {testimonials[current].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                </div>
                <div className="ml-auto">
                  <img
                    src="/placeholder.svg?height=30&width=100"
                    alt={testimonials[current].company}
                    className="h-8 opacity-70"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => {
            prev()
            setAutoplay(false)
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        {testimonials.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`w-2 h-2 p-0 rounded-full ${index === current ? "bg-primary" : "bg-muted"}`}
            onClick={() => {
              setCurrent(index)
              setAutoplay(false)
            }}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => {
            next()
            setAutoplay(false)
          }}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}

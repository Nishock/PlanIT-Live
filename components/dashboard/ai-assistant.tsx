"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, Sparkles, Loader2 } from "lucide-react"
import { aiService } from "@/lib/api-service"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get AI response
      const response = await aiService.generateResponse(input)

      // Add AI response
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Quick suggestions
  const suggestions = ["What tasks are overdue?", "Summarize my week", "Create a new task", "Schedule a meeting"]

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
        </div>
        <CardDescription>Ask me anything about your tasks and projects</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-3 py-2 bg-muted">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => handleSuggestion(suggestion)}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
      <CardFooter className="pt-0">
        <form
          className="flex w-full items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
        >
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

export { AIAssistant as AiAssistant }

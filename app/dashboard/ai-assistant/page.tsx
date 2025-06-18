"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { aiService } from "@/lib/api-service"
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  MessageSquare,
  FileText,
  ListTodo,
  Calendar,
  BarChart3,
  Lightbulb,
  Zap,
  Clock,
  Mic,
  ImageIcon,
  Paperclip,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  attachments?: {
    type: "image" | "file"
    url: string
    name: string
  }[]
}

interface Suggestion {
  id: string
  text: string
  icon: React.ReactNode
}

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Suggestions for quick prompts
  const suggestions: Suggestion[] = [
    { id: "tasks", text: "What tasks are overdue?", icon: <Clock className="h-4 w-4" /> },
    { id: "summary", text: "Summarize my week", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "create", text: "Create a new task", icon: <ListTodo className="h-4 w-4" /> },
    { id: "schedule", text: "Schedule a meeting", icon: <Calendar className="h-4 w-4" /> },
    { id: "document", text: "Draft a project proposal", icon: <FileText className="h-4 w-4" /> },
    { id: "ideas", text: "Generate ideas for my project", icon: <Lightbulb className="h-4 w-4" /> },
  ]

  // AI capabilities
  const capabilities = [
    {
      title: "Task Management",
      description: "Create, organize, and prioritize tasks with natural language",
      icon: <ListTodo className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Smart Scheduling",
      description: "Schedule meetings and events with context awareness",
      icon: <Calendar className="h-6 w-6 text-cyan-500" />,
    },
    {
      title: "Document Creation",
      description: "Generate and edit documents based on your requirements",
      icon: <FileText className="h-6 w-6 text-pink-500" />,
    },
    {
      title: "Data Analysis",
      description: "Analyze project data and provide actionable insights",
      icon: <BarChart3 className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Automated Workflows",
      description: "Create and manage automated workflows for repetitive tasks",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
    },
    {
      title: "Conversational Interface",
      description: "Natural language interaction for all your project needs",
      icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
    },
  ]

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
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
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] py-6 px-2 md:px-0">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bot className="h-7 w-7 text-primary" /> AI Assistant
            </h1>
            <p className="text-muted-foreground">Your intelligent productivity companion</p>
          </div>
        </div>
        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Chat
            </TabsTrigger>
            <TabsTrigger value="capabilities" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Capabilities
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {activeTab === "chat" ? (
          <div className="relative w-full">
            <Card className="h-[70vh] flex flex-col border-2 border-muted/30 shadow-xl bg-background/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" /> AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask me anything about your tasks, projects, or for help with your work
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto">
                <ScrollArea className="h-[45vh]">
                  <div className="p-4 space-y-4">
                    {messages.map((message, idx) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        aria-live={idx === messages.length - 1 ? "polite" : undefined}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-md border transition-colors duration-200 animate-fade-in ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-purple-600 to-cyan-400 text-white border-none"
                              : message.role === "system"
                              ? "bg-muted/50 text-muted-foreground border-muted"
                              : "bg-white dark:bg-muted text-foreground border-muted"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-base">{message.content}</p>
                          {message.attachments?.map((attachment, index) => (
                            <div key={index} className="mt-2">
                              {attachment.type === "image" ? (
                                <img
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="rounded-md max-w-full h-auto"
                                />
                              ) : (
                                <div className="flex items-center gap-2 p-2 rounded-md bg-background">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-sm">{attachment.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                          <p className="text-xs opacity-70 mt-1 text-right">{formatTime(message.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl px-4 py-2 bg-muted shadow-md border border-muted flex items-center gap-2 animate-pulse">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p>Thinking...</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4 bg-background/80 sticky bottom-0 z-10">
                <div className="w-full space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <Button
                        key={suggestion.id}
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => handleSuggestion(suggestion.text)}
                        aria-label={`Use suggestion: ${suggestion.text}`}
                      >
                        {suggestion.icon}
                        <span className="ml-2">{suggestion.text}</span>
                      </Button>
                    ))}
                  </div>
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                    aria-label="Send a message to the AI assistant"
                  >
                    <Button variant="outline" size="icon" className="shrink-0" tabIndex={-1} aria-label="Voice input (not implemented)">
                      <Mic className="h-5 w-5" />
                    </Button>
                    <div className="relative flex-1">
                      <Input
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="pr-20"
                        aria-label="Chat input"
                        autoFocus
                        disabled={isLoading}
                      />
                      <div className="absolute right-2 top-2 flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" tabIndex={-1} aria-label="Attach file (not implemented)">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" tabIndex={-1} aria-label="Attach image (not implemented)">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      className="shrink-0 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
                      size="icon"
                      type="submit"
                      aria-label="Send message"
                      disabled={!input.trim() || isLoading}
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </form>
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-muted/30 shadow-xl bg-background/80">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" /> AI Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {capabilities.map((cap, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span>{cap.icon}</span>
                      <div>
                        <p className="font-semibold">{cap.title}</p>
                        <p className="text-sm text-muted-foreground">{cap.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

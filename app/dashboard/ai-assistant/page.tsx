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
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '80vh' }}>
      <iframe
        src="https://app.relevanceai.com/agents/d7b62b/7a7db85423ce-444f-9f3b-4d2476b2bb4a/ba9d1fb6-a701-4178-8269-d91690b18c1b/share?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false"
        width="100%"
        height="700"
        style={{ border: 0, minHeight: '80vh' }}
        frameBorder="0"
        allow="clipboard-write;"
        title="AI Assistant Chatbot"
      />
    </div>
  )
}

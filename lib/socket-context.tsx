"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  newTaskCount: number
  clearNewTaskCount: () => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [newTaskCount, setNewTaskCount] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      // Disconnect socket if user is not authenticated
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    // Create socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      auth: {
        token: typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
      },
    })

    // Socket event handlers
    newSocket.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
      
      // Join user's room for private messages
      newSocket.emit("join", { userId: user.id })
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    newSocket.on("taskAssigned", (data: {
      taskId: string
      title: string
      description?: string
      dueDate?: string
      priority: string
    }) => {
      console.log("New task assigned:", data)
      
      // Increment new task count
      setNewTaskCount(prev => prev + 1)
      
      // Show toast notification
      toast({
        title: "New Task Assigned",
        description: `You have a new task: ${data.title}`,
        action: {
          label: "View",
          onClick: () => {
            // Navigate to tasks or specific task
            window.location.href = "/dashboard/tasks"
          },
        },
      })
    })

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setIsConnected(false)
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.disconnect()
    }
  }, [user, toast])

  const clearNewTaskCount = () => {
    setNewTaskCount(0)
  }

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      newTaskCount,
      clearNewTaskCount,
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

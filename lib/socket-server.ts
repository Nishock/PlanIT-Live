import { Server as SocketIOServer } from "socket.io"
import { verifyToken } from "./jwt"

export function createSocketServer(httpServer: any) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error("Authentication error"))
      }

      const payload = verifyToken(token)
      if (!payload || !payload.id) {
        return next(new Error("Invalid token"))
      }

      socket.data.userId = payload.id
      next()
    } catch (error) {
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.data.userId)

    // Join user's personal room
    socket.join(socket.data.userId)

    // Handle join events (for additional rooms)
    socket.on("join", (data: { userId: string }) => {
      socket.join(data.userId)
      console.log(`User ${socket.data.userId} joined room: ${data.userId}`)
    })

    // Handle task assignment events
    socket.on("taskAssigned", (data: {
      taskId: string
      assignedToUserId: string
      title: string
      description?: string
      dueDate?: string
      priority: string
    }) => {
      // Emit to the assigned user's room
      io.to(data.assignedToUserId).emit("taskAssigned", {
        taskId: data.taskId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: data.priority,
      })
      
      console.log(`Task assigned to user ${data.assignedToUserId}: ${data.title}`)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.data.userId)
    })
  })

  return io
}

// Helper function to emit task assignment events from API routes
export function emitTaskAssigned(io: SocketIOServer, data: {
  taskId: string
  assignedToUserId: string
  title: string
  description?: string
  dueDate?: string
  priority: string
}) {
  io.to(data.assignedToUserId).emit("taskAssigned", {
    taskId: data.taskId,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
  })
  
  console.log(`Task assigned to user ${data.assignedToUserId}: ${data.title}`)
}

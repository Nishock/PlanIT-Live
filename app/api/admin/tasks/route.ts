import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Task from "@/lib/models/Task"
import User from "@/lib/models/User"
import Workspace from "@/lib/models/Workspace"
import { requireRole } from "@/lib/middleware/auth"
import { sendTaskAssignedEmail } from "@/lib/email"

// GET /api/admin/tasks - List all tasks
export const GET = requireRole(["admin", "manager"])(async (request: NextRequest, authUser) => {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")
    const dueDate = searchParams.get("dueDate")
    
    // Build filter object
    const filter: any = {}
    
    if (status && status !== "all") {
      filter.status = status
    }
    
    if (userId && userId !== "all") {
      filter.$or = [
        { assignee: userId },
        { assignedTo: userId },
        { createdBy: userId }
      ]
    }
    
    if (dueDate) {
      const date = new Date(dueDate)
      filter.dueDate = {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) // Next day
      }
    }
    
    const tasks = await Task.find(filter)
      .populate("assignee", "name email avatar")
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("workspace", "name")
      .populate("project", "name")
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Admin tasks GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// POST /api/admin/tasks - Assign a task
export const POST = requireRole(["admin", "manager"])(async (request: NextRequest, authUser) => {
  try {
    await connectDB()
    
    const { title, description, dueDate, priority, assignedToUserId, workspaceId } = await request.json()
    
    // Validate required fields
    if (!title || !assignedToUserId || !workspaceId) {
      return NextResponse.json({ 
        error: "Title, assigned user, and workspace are required" 
      }, { status: 400 })
    }
    
    // Verify assigned user exists
    const assignedUser = await User.findById(assignedToUserId)
    if (!assignedUser) {
      return NextResponse.json({ error: "Assigned user not found" }, { status: 404 })
    }
    
    // Verify workspace exists
    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }
    
    // Create the task
    const task = new Task({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || "medium",
      assignedTo: assignedToUserId,
      createdBy: authUser.userId,
      workspace: workspaceId,
      status: "todo"
    })
    
    await task.save()
    
    // Populate the task for response
    await task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "workspace", select: "name" }
    ])
    
    // Send email notification
    try {
      await sendTaskAssignedEmail(assignedUser.email, {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority || "medium",
        assignedBy: authUser.userId
      })
    } catch (emailError) {
      console.error("Failed to send task assignment email:", emailError)
      // Don't fail the request if email fails
    }
    
    // Emit Socket.IO event for real-time notification
    try {
      const { emitTaskAssigned } = await import("@/lib/socket-server")
      const io = (global as any).io
      if (io) {
        emitTaskAssigned(io, {
          taskId: task._id.toString(),
          assignedToUserId: assignedToUserId,
          title: title,
          description: description,
          dueDate: dueDate,
          priority: priority || "medium"
        })
      }
    } catch (socketError) {
      console.error("Failed to emit Socket.IO event:", socketError)
      // Don't fail the request if Socket.IO fails
    }
    
    return NextResponse.json({ 
      task,
      message: "Task assigned successfully" 
    }, { status: 201 })
    
  } catch (error) {
    console.error("Admin task assignment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

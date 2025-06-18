import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Task from "@/lib/models/Task"
import { requireAuth } from "@/lib/middleware/auth"

export const GET = requireAuth(async (request: NextRequest, authUser, { params }: { params: { id: string } }) => {
  try {
    await connectDB()

    const task = await Task.findById(params.id)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name")
      .populate("comments.user", "name email avatar")

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const PUT = requireAuth(async (request: NextRequest, authUser, { params }: { params: { id: string } }) => {
  try {
    await connectDB()

    const updateData = await request.json()

    const task = await Task.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name")

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request: NextRequest, authUser, { params }: { params: { id: string } }) => {
  try {
    await connectDB()

    const task = await Task.findByIdAndDelete(params.id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

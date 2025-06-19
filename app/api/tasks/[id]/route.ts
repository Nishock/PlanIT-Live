import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Task from "@/lib/models/Task"
import { requireAuth } from "@/lib/middleware/auth"

function getTaskIdFromRequest(request: NextRequest) {
  return request.nextUrl.pathname.split("/").filter(Boolean).pop();
}

// ✅ PUT: Update task by ID
export const PUT = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()
    const id = getTaskIdFromRequest(request);
    const updateData = await request.json()
    // Only update if the user is the creator
    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: authUser.userId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name")

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Map _id to id
    const obj = task.toObject ? task.toObject() : task
    obj.id = obj._id?.toString()

    return NextResponse.json(obj)
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// ✅ DELETE: Delete task by ID
export const DELETE = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()
    const id = getTaskIdFromRequest(request);
    // Only delete if the user is the creator
    const task = await Task.findOneAndDelete({ _id: id, createdBy: authUser.userId })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Map _id to id
    const obj = task.toObject ? task.toObject() : task
    obj.id = obj._id?.toString()

    return NextResponse.json({ message: "Task deleted successfully", task: obj })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()
    const id = getTaskIdFromRequest(request);
    const task = await Task.findOne({ _id: id, createdBy: authUser.userId })
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name")
      .populate("comments.user", "name email avatar")

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Map _id to id
    const obj = task.toObject ? task.toObject() : task
    obj.id = obj._id?.toString()

    return NextResponse.json(obj)
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

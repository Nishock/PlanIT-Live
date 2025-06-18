import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Project from "@/lib/models/Project"
import { requireAuth } from "@/lib/middleware/auth"

function getProjectIdFromRequest(request: NextRequest): string | null {
  // /api/projects/[id] => extract id
  const id = request.nextUrl.pathname.split("/").pop()
  return id || null
}

function projectToClient(project: any) {
  if (!project) return project
  const obj = project.toObject ? project.toObject() : project
  obj.id = obj._id?.toString()
  return obj
}

export const GET = requireAuth(async (request) => {
  try {
    await connectDB()
    const id = getProjectIdFromRequest(request)
    if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 })
    const project = await Project.findById(id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("workspace", "name")
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json(projectToClient(project))
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const PUT = requireAuth(async (request) => {
  try {
    await connectDB()
    const id = getProjectIdFromRequest(request)
    if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 })
    const updateData = await request.json()
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("workspace", "name")
    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json(projectToClient(updatedProject))
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request) => {
  try {
    await connectDB()
    const id = getProjectIdFromRequest(request)
    if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 })
    const deleted = await Project.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Project deleted", id: deleted._id?.toString() })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

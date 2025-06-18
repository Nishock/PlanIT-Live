import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Workspace from "@/lib/models/Workspace"
import Project from "@/lib/models/Project"
import { requireAuth } from "@/lib/middleware/auth"

function workspaceToClient(workspace, projects = [], events = []) {
  if (!workspace) return workspace;
  const obj = workspace.toObject ? workspace.toObject() : workspace;
  obj.id = obj._id?.toString();
  obj.projects = projects;
  obj.events = events;
  return obj;
}

export const GET = requireAuth(async (request) => {
  try {
    await connectDB()
    const id = request.nextUrl.pathname.split("/").filter(Boolean).pop()
    if (!id) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 })
    const workspace = await Workspace.findById(id)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar")
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }
    const projects = await Project.find({ workspace: workspace._id })
    const events = workspace.events || []
    return NextResponse.json(workspaceToClient(workspace, projects, events))
  } catch (error) {
    console.error("Get workspace error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const PUT = requireAuth(async (request) => {
  try {
    await connectDB()
    const id = request.nextUrl.pathname.split("/").filter(Boolean).pop()
    if (!id) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 })
    const updateData = await request.json()
    const updatedWorkspace = await Workspace.findByIdAndUpdate(id, updateData, { new: true })
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar")
    if (!updatedWorkspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }
    return NextResponse.json(workspaceToClient(updatedWorkspace))
  } catch (error) {
    console.error("Update workspace error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request) => {
  try {
    await connectDB()
    const id = request.nextUrl.pathname.split("/").filter(Boolean).pop()
    if (!id) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 })
    const deleted = await Workspace.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Workspace deleted", id: deleted._id?.toString() })
  } catch (error) {
    console.error("Delete workspace error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

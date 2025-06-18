import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Project from "@/lib/models/Project"
import Workspace from "@/lib/models/Workspace"
import { requireAuth } from "@/lib/middleware/auth"

function projectToClient(project: any) {
  if (!project) return project;
  const obj = project.toObject ? project.toObject() : project;
  obj.id = obj._id?.toString();
  return obj;
}

export const GET = requireAuth(async (request) => {
  try {
    await connectDB()
    const workspaceId = request.nextUrl.pathname.split("/").filter(Boolean).reverse()[1]
    if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 })
    const projects = await Project.find({ workspace: workspaceId })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("workspace", "name")
    return NextResponse.json(projects.map(projectToClient))
  } catch (error) {
    console.error("Get workspace projects error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request, user) => {
  try {
    await connectDB()
    const workspaceId = request.nextUrl.pathname.split("/").filter(Boolean).reverse()[1]
    if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 })
    const data = await request.json()
    const project = new Project({
      ...data,
      workspace: workspaceId,
      owner: user.userId,
      members: [user.userId],
    })
    await project.save()
    const populated = await Project.findById(project._id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("workspace", "name")
    return NextResponse.json(projectToClient(populated), { status: 201 })
  } catch (error) {
    console.error("Create workspace project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

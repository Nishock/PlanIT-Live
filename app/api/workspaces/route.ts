import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Workspace from "@/lib/models/Workspace"
import Project from "@/lib/models/Project"
import { requireAuth } from "@/lib/middleware/auth"

function workspaceToClient(workspace, projects = [], events = []) {
  if (!workspace) return workspace
  const obj = workspace.toObject ? workspace.toObject() : workspace
  obj.id = obj._id?.toString()
  obj.projects = projects
  obj.events = events
  return obj
}

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()
    const workspaces = await Workspace.find({
      "members.user": authUser.userId,
    })
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar")
      .sort({ createdAt: -1 })
    // For each workspace, fetch projects and use workspace.events
    const results = await Promise.all(
      workspaces.map(async (ws) => {
        const projects = await Project.find({ workspace: ws._id })
        const events = ws.events || []
        return workspaceToClient(ws, projects, events)
      })
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("Get workspaces error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const workspaceData = await request.json()

    const workspace = new Workspace({
      ...workspaceData,
      owner: authUser.userId,
      members: [
        {
          user: authUser.userId,
          role: "admin",
          joinedAt: new Date(),
        },
      ],
    })

    await workspace.save()

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar")

    return NextResponse.json(workspaceToClient(populatedWorkspace), { status: 201 })
  } catch (error) {
    console.error("Create workspace error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

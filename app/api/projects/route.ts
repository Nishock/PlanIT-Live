import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Project from "@/lib/models/Project"
import { requireAuth } from "@/lib/middleware/auth"
import Workspace from "@/lib/models/Workspace"

function projectToClient(project: any) {
  if (!project) return project
  const obj = project.toObject ? project.toObject() : project
  obj.id = obj._id?.toString()
  return obj
}

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get("workspace")

    let query: any = {}
    if (workspaceId) {
      query.workspace = workspaceId
    } else {
      // Find the user's Personal workspace
      const personalWorkspace = await Workspace.findOne({
        name: "Personal",
        owner: authUser.userId,
      })
      // Show projects that are either:
      // - Not associated with any workspace (legacy)
      // - Associated with the user's Personal workspace
      query = {
        $or: [
          { owner: authUser.userId, workspace: { $exists: false } },
          { owner: authUser.userId, workspace: null },
          personalWorkspace ? { owner: authUser.userId, workspace: personalWorkspace._id } : {},
        ],
      }
    }

    const projects = await Project.find(query)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .sort({ createdAt: -1 })

    return NextResponse.json(projects.map(projectToClient))
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const projectData = await request.json()
    console.log("Creating project with data:", projectData)

    // Get or create default workspace for the user
    let workspaceId = null
    
    // Find or create a default workspace for the user
    let defaultWorkspace = await Workspace.findOne({
      name: "Personal",
      owner: authUser.userId,
    })

    if (!defaultWorkspace) {
      defaultWorkspace = new Workspace({
        name: "Personal",
        description: "Default personal workspace",
        type: "personal",
        owner: authUser.userId,
        members: [
          {
            user: authUser.userId,
            role: "admin",
            joinedAt: new Date(),
          },
        ],
      })
      await defaultWorkspace.save()
      console.log("Created default workspace:", defaultWorkspace._id)
    }

    workspaceId = defaultWorkspace._id

    const project = new Project({
      ...projectData,
      workspace: workspaceId,
      owner: authUser.userId,
      members: [authUser.userId],
    })

    await project.save()
    console.log("Project created successfully:", project._id)

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("workspace", "name")

    return NextResponse.json(projectToClient(populatedProject), { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

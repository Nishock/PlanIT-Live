import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Task from "@/lib/models/Task"
import User from "@/lib/models/User"
import Workspace from "@/lib/models/Workspace"
import { requireAuth } from "@/lib/middleware/auth"
import mongoose from "mongoose"
import "@/lib/models/Project"

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get("workspace")
    const projectId = searchParams.get("project")
    const status = searchParams.get("status")
    const assignee = searchParams.get("assignee")

    const query: any = { createdBy: authUser.userId }

    let effectiveWorkspaceId = workspaceId
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      // Find or create the user's Personal workspace
      let personalWorkspace = await Workspace.findOne({
        name: "Personal",
        owner: authUser.userId,
      })
      if (!personalWorkspace) {
        personalWorkspace = new Workspace({
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
        await personalWorkspace.save()
      }
      effectiveWorkspaceId = personalWorkspace._id.toString()
    }
    if (effectiveWorkspaceId && mongoose.Types.ObjectId.isValid(effectiveWorkspaceId)) {
      query.workspace = effectiveWorkspaceId
    }
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      query.project = projectId
    }
    if (status) query.status = status
    if (assignee && mongoose.Types.ObjectId.isValid(assignee)) {
      query.assignee = assignee
    }

    const tasks = await Task.find(query)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name")
      .populate("workspace", "name")
      .sort({ createdAt: -1 })

    // Map _id to id for frontend compatibility
    const tasksWithId = tasks.map((task) => {
      const obj = task.toObject ? task.toObject() : task
      obj.id = obj._id?.toString()
      return obj
    })

    return NextResponse.json(tasksWithId)
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const taskData = await request.json()
    console.log("Creating task with data:", taskData)

    // Get or create default workspace for the user
    let workspaceId = null
    if (taskData.workspace && mongoose.Types.ObjectId.isValid(taskData.workspace)) {
      workspaceId = taskData.workspace
    } else {
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
    }

    // Determine assignee
    let assigneeId = null
    if (taskData.assignee && mongoose.Types.ObjectId.isValid(taskData.assignee)) {
      assigneeId = taskData.assignee
    } else if (taskData.assigneeEmail && taskData.assigneeEmail.trim()) {
      const assignee = await User.findOne({ email: taskData.assigneeEmail.trim() })
      if (assignee) {
        assigneeId = assignee._id
        console.log(`Found assignee: ${assignee.name} (${assignee.email})`)
      } else {
        console.log(`Assignee with email ${taskData.assigneeEmail} not found - task will be unassigned`)
      }
    }

    const task = new Task({
      title: taskData.title,
      description: taskData.description || "",
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
      workspace: workspaceId,
      project: taskData.project && mongoose.Types.ObjectId.isValid(taskData.project) ? taskData.project : null,
      assignee: assigneeId,
      createdBy: authUser.userId,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      estimatedHours: taskData.estimatedHours ? Number(taskData.estimatedHours) : null,
      storyPoints: taskData.storyPoints ? Number(taskData.storyPoints) : null,
      tags: Array.isArray(taskData.tags) ? taskData.tags : [],
    })

    await task.save()
    console.log("Task created successfully:", task._id)

    const populatedTask = await Task.findById(task._id)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name")
      .populate("workspace", "name")

    return NextResponse.json(populatedTask, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})

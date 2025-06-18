import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Task from "@/lib/models/Task"
import Project from "@/lib/models/Project"
import Workspace from "@/lib/models/Workspace"
import { requireAuth } from "@/lib/middleware/auth"

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    // Get all users with their task and project counts
    const users = await User.find({ isActive: true }).select("-password").sort({ createdAt: -1 })

    const membersWithStats = await Promise.all(
      users.map(async (user) => {
        const tasksAssigned = await Task.countDocuments({ assignee: user._id })
        const tasksCompleted = await Task.countDocuments({
          assignee: user._id,
          status: "done",
        })
        const projectsCount = await Project.countDocuments({
          $or: [{ owner: user._id }, { "members.user": user._id }],
        })
        const workspaces = await Workspace.find({
          "members.user": user._id,
        }).select("name")

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          jobTitle: user.jobTitle,
          department: user.department,
          phone: user.phone,
          location: user.location,
          joinedAt: user.createdAt,
          lastActive: user.lastLogin,
          isActive: user.isActive,
          tasksAssigned,
          tasksCompleted,
          projectsCount,
          workspaces: workspaces.map((w) => w.name),
        }
      }),
    )

    return NextResponse.json(membersWithStats)
  } catch (error) {
    console.error("Get team members error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

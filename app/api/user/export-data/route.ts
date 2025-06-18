import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Task from "@/lib/models/Task"
import Project from "@/lib/models/Project"
import Document from "@/lib/models/Document"
import { requireAuth } from "@/lib/middleware/auth"

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    // Get user data
    const user = await User.findById(authUser.userId).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's tasks
    const tasks = await Task.find({ assignee: authUser.userId })

    // Get user's projects
    const projects = await Project.find({
      $or: [{ owner: authUser.userId }, { "members.user": authUser.userId }],
    })

    // Get user's documents
    const documents = await Document.find({ author: authUser.userId })

    const exportData = {
      user: user.toObject(),
      tasks: tasks.map((task) => task.toObject()),
      projects: projects.map((project) => project.toObject()),
      documents: documents.map((doc) => doc.toObject()),
      exportedAt: new Date().toISOString(),
    }

    const jsonData = JSON.stringify(exportData, null, 2)

    return new NextResponse(jsonData, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="planit-data-${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    console.error("Export data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

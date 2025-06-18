import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Task from "@/lib/models/Task"
import Project from "@/lib/models/Project"
import Document from "@/lib/models/Document"
import { requireAuth } from "@/lib/middleware/auth"

export const DELETE = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    // Delete user's tasks
    await Task.deleteMany({ assignee: authUser.userId })

    // Delete user's documents
    await Document.deleteMany({ author: authUser.userId })

    // Remove user from projects (but don't delete projects)
    await Project.updateMany({ "members.user": authUser.userId }, { $pull: { members: { user: authUser.userId } } })

    // Delete projects owned by user
    await Project.deleteMany({ owner: authUser.userId })

    // Finally delete the user
    await User.findByIdAndDelete(authUser.userId)

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

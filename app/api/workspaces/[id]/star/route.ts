import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Workspace from "@/lib/models/Workspace"
import { requireAuth } from "@/lib/middleware/auth"

export const PUT = requireAuth(async (request) => {
  try {
    await connectDB()
    const id = request.nextUrl.pathname.split("/").filter(Boolean).reverse()[1]
    if (!id) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 })
    const workspace = await Workspace.findById(id)
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }
    // Toggle isStarred
    workspace.isStarred = !workspace.isStarred
    await workspace.save()
    return NextResponse.json({ id: workspace._id.toString(), isStarred: workspace.isStarred })
  } catch (error) {
    console.error("Star workspace error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

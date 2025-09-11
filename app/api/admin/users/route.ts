import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireRole } from "@/lib/middleware/auth"

// GET /api/admin/users - List all users
export const GET = requireRole(["admin", "manager"])(async (request: NextRequest, authUser) => {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const isActive = searchParams.get("isActive")
    
    // Build filter object
    const filter: any = {}
    
    if (role && role !== "all") {
      filter.role = role
    }
    
    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === "true"
    }
    
    const users = await User.find(filter)
      .select("name email avatar role jobTitle department isActive lastLogin")
      .sort({ name: 1 })
      .lean()
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Admin users GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

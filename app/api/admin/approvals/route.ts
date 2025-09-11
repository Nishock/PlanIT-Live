import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireRole } from "@/lib/middleware/auth"

// GET /api/admin/approvals - List admin approval requests
export const GET = requireRole(["admin"])(async (request: NextRequest, authUser) => {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const role = searchParams.get("role")
    
    // Build filter object
    const filter: any = {
      $or: [
        { role: "admin" },
        { role: "manager" }
      ]
    }
    
    if (status && status !== "all") {
      filter.adminRequestStatus = status
    }
    
    if (role && role !== "all") {
      filter.role = role
    }
    
    const requests = await User.find(filter)
      .select("name email role jobTitle department company adminRequestReason adminRequestDate adminRequestStatus isActive isApproved")
      .sort({ adminRequestDate: -1 })
      .lean()
    
    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Admin approvals GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

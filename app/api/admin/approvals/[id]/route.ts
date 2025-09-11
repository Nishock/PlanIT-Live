import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireRole } from "@/lib/middleware/auth"

// PATCH /api/admin/approvals/[id] - Approve or reject admin request
export const PATCH = requireRole(["admin"])(async (request: NextRequest, authUser, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    
    const { action } = await request.json()
    
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ 
        error: "Invalid action. Must be 'approve' or 'reject'" 
      }, { status: 400 })
    }
    
    const user = await User.findById(params.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Update user based on action
    if (action === "approve") {
      user.isApproved = true
      user.isActive = true
      user.adminRequestStatus = "approved"
    } else {
      user.isApproved = false
      user.isActive = false
      user.adminRequestStatus = "rejected"
    }
    
    await user.save()
    
    return NextResponse.json({ 
      message: `Request ${action}d successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive,
        adminRequestStatus: user.adminRequestStatus
      }
    })
    
  } catch (error) {
    console.error("Admin approval PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

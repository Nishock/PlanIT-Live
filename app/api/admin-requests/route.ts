import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/middleware/auth"
import connectDB from "@/lib/database"
import AdminAccessRequest from "@/lib/models/AdminAccessRequest"

async function handler(request: NextRequest, user: any) {
  try {
    await connectDB()

    // Fetch all admin access requests with user details
    const requests = await AdminAccessRequest.find()
      .populate("userId", "name email")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 })

    const formattedRequests = requests.map((req) => ({
      id: req._id,
      userId: req.userId,
      name: req.name,
      email: req.email,
      company: req.company,
      roleRequested: (req as any).roleRequested,
      status: req.status,
      reason: req.reason,
      approvedBy: req.approvedBy,
      approvedAt: req.approvedAt,
      createdAt: req.createdAt,
      updatedAt: req.updatedAt,
    }))

    return NextResponse.json(formattedRequests)
  } catch (error) {
    console.error("Error fetching admin requests:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Only super-admin can access this endpoint
export const GET = requireRole(["super-admin"])(handler)

import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import connectDB from "@/lib/database"
import AdminAccessRequest from "@/lib/models/AdminAccessRequest"
import User from "@/lib/models/User"

async function handler(request: NextRequest, user: any) {
  try {
    const { company, reason, roleRequested } = await request.json()

    if (!company) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user already has a pending request
    const existingRequest = await AdminAccessRequest.findOne({
      userId: user.userId,
      status: "pending"
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending admin access request" },
        { status: 400 }
      )
    }

    // Get user details
    const userDoc = await User.findById(user.userId)
    if (!userDoc) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const normalizedRole = roleRequested === 'manager' ? 'manager' : 'admin'

    // Create admin access request
    const adminRequest = new AdminAccessRequest({
      userId: user.userId,
      name: userDoc.name,
      email: userDoc.email,
      company,
      reason,
      roleRequested: normalizedRole,
      status: "pending"
    })

    await adminRequest.save()

    return NextResponse.json({
      message: "Admin access request submitted successfully",
      request: {
        id: adminRequest._id,
        company,
        status: "pending",
        createdAt: adminRequest.createdAt
      }
    })
  } catch (error) {
    console.error("Error submitting admin request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler)

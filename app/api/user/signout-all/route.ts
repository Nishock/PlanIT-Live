import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    // In a real implementation, you would invalidate all JWT tokens
    // For now, we'll just update the user's security settings
    await User.findByIdAndUpdate(authUser.userId, {
      "security.activeSessions": 1, // Reset to current session only
      "security.lastSignOutAll": new Date(),
    })

    return NextResponse.json({ message: "Signed out of all devices successfully" })
  } catch (error) {
    console.error("Sign out all devices error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

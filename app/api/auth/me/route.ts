import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const user = await User.findById(authUser.userId).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      emailVerified: user.emailVerified,
      notificationPreferences: user.notificationPreferences,
      lastLogin: user.lastLogin,
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

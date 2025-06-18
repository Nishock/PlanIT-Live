import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const { enable } = await request.json()

    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { "security.twoFactorAuth": enable },
      { new: true, runValidators: true },
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: enable ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
    })
  } catch (error) {
    console.error("Toggle 2FA error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

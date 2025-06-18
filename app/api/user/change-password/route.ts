import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 })
    }

    const user = await User.findById(authUser.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password and security info
    await User.findByIdAndUpdate(authUser.userId, {
      password: hashedNewPassword,
      "security.passwordLastChanged": new Date(),
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

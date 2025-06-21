import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    console.log("Change password request for user:", authUser.userId)
    await connectDB()

    const { currentPassword, newPassword } = await request.json()
    console.log("Request body received:", { currentPassword: !!currentPassword, newPassword: !!newPassword })

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 })
    }

    // Explicitly select the password field since it has select: false
    const user = await User.findById(authUser.userId).select("+password")
    if (!user) {
      console.log("User not found:", authUser.userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.password) {
      console.log("User has no password set")
      return NextResponse.json({ error: "User has no password set" }, { status: 400 })
    }

    console.log("User found, verifying current password...")

    // Verify current password using the User model's comparePassword method
    let isCurrentPasswordValid = false
    try {
      isCurrentPasswordValid = await user.comparePassword(currentPassword)
    } catch (bcryptError) {
      console.error("Password comparison error:", bcryptError)
      return NextResponse.json({ error: "Error verifying current password" }, { status: 500 })
    }
    
    if (!isCurrentPasswordValid) {
      console.log("Current password verification failed")
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    console.log("Current password verified, hashing new password...")

    // Hash new password
    let hashedNewPassword = ""
    try {
      const saltRounds = 12
      hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)
    } catch (bcryptError) {
      console.error("Bcrypt hash error:", bcryptError)
      return NextResponse.json({ error: "Error hashing new password" }, { status: 500 })
    }

    console.log("Updating user password...")

    // Update password and security info using findByIdAndUpdate with runValidators: false
    const updateResult = await User.findByIdAndUpdate(
      authUser.userId,
      {
        password: hashedNewPassword,
        "security.passwordLastChanged": new Date(),
      },
      {
        new: true,
        runValidators: false, // Disable validators to avoid pre-save hook issues
      }
    )

    if (!updateResult) {
      console.log("No user found to update")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Password updated successfully")

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
})

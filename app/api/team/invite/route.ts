import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const { email, role, workspaces } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // In a real app, you would send an email invitation here
    // For now, we'll create a placeholder user
    const tempPassword = Math.random().toString(36).slice(-8)

    const newUser = new User({
      name: email.split("@")[0], // Use email prefix as temporary name
      email,
      password: tempPassword,
      role,
      isActive: false, // User needs to activate account
      emailVerified: false,
    })

    await newUser.save()

    // TODO: Send email invitation with activation link
    console.log(`Invitation sent to ${email} with temporary password: ${tempPassword}`)

    return NextResponse.json({
      message: "Invitation sent successfully",
      userId: newUser._id,
    })
  } catch (error) {
    console.error("Invite team member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

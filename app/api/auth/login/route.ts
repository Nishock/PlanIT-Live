import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { generateToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email: rawEmail, password } = await request.json()
    const email = rawEmail.trim().toLowerCase()

    console.log("🔐 Login attempt for email:", email)

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user with password explicitly selected
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      console.log("❌ User not found:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check account status
    if (!user.isActive) {
      return NextResponse.json({ error: "Account is deactivated. Please contact support." }, { status: 401 })
    }

    // Check approval status for admin/manager roles
    if ((user.role === "admin" || user.role === "manager") && !user.isApproved) {
      return NextResponse.json({ 
        error: "Your admin access request is pending approval. Please contact support." 
      }, { status: 401 })
    }

    // Compare password securely
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Update last login timestamp
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT
    const token = generateToken(user)

    // Prepare sanitized user response
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      role: user.role,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
    }

    console.log("✅ Login successful:", email)

    return NextResponse.json({ user: userData, token }, { status: 200 })

  } catch (error: any) {
    console.error("🔥 Login error:", error, error?.stack ?? "")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

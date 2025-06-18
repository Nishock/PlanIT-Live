import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { generateToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    console.log("Login attempt for email:", email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
    if (!user) {
      console.log("User not found:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("User found:", user.email)

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: "Account is deactivated. Please contact support." }, { status: 401 })
    }

    // Compare password using the user method
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      console.log("Password comparison failed for user:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("Password comparison successful for user:", email)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = generateToken(user)

    // Return user data (without password)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      role: user.role,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
    }

    console.log("Login successful for user:", email)

    return NextResponse.json({
      user: userData,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 })
  }
}

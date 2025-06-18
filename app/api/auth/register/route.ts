import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Workspace from "@/lib/models/Workspace"
import { generateToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, password } = await request.json()

    console.log("Registration attempt for:", { name, email })

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create user with plain password - let pre-save middleware handle hashing
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // Plain password - will be hashed by pre-save middleware
      role: "member",
      isActive: true,
      emailVerified: false,
    })

    // Save user (pre-save middleware will hash the password)
    await user.save()
    console.log("User created successfully:", user.email)

    // Create personal workspace
    const workspace = new Workspace({
      name: `${name.trim()}'s Workspace`,
      description: "Personal workspace",
      type: "personal",
      owner: user._id,
      members: [
        {
          user: user._id,
          role: "admin",
          joinedAt: new Date(),
        },
      ],
      subscription: {
        plan: "free",
        status: "active",
      },
    })

    await workspace.save()
    console.log("Workspace created for user:", user.email)

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
    }

    return NextResponse.json(
      {
        user: userData,
        token,
        workspace: {
          id: workspace._id.toString(),
          name: workspace.name,
          type: workspace.type,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}

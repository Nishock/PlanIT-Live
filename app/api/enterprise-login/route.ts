import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { generateToken } from "@/lib/jwt"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    console.log('=== ENTERPRISE LOGIN ATTEMPT ===')
    const { email, password } = await request.json()
    console.log('Login attempt for email:', email)

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected successfully')

    // Normalize email to lowercase for consistent lookup
    const lookupEmail = String(email).trim().toLowerCase()

    // Find user with password (select +password to include hashed password)
    console.log('Searching for user in database...', lookupEmail)
    const user = await User.findOne({ email: lookupEmail }).select("+password")
    console.log('User search result:', user ? 'User found' : 'User not found')

    if (!user) {
      console.log('No user found with email:', lookupEmail)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    console.log('User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      passwordLength: user.password ? user.password.length : 'undefined'
    })

    // Check if user has enterprise role
    console.log('User role:', user.role)
    console.log('Allowed roles:', ["super-admin", "company-admin"])
    console.log('Role check result:', ["super-admin", "company-admin"].includes(user.role as any))

    if (!["super-admin", "company-admin"].includes(user.role as any)) {
      console.log('Role check failed for user:', user.role)
      return NextResponse.json(
        { error: "Access denied. Enterprise login only." },
        { status: 403 }
      )
    }

    // Verify password - handle both User model method and direct bcrypt comparison
    console.log('Attempting password verification...')
    let isPasswordValid = false
    
    try {
      if (typeof (user as any).comparePassword === 'function') {
        isPasswordValid = await (user as any).comparePassword(password)
        console.log('Using User.comparePassword method, result:', isPasswordValid)
      } else {
        isPasswordValid = await bcrypt.compare(password, (user as any).password)
        console.log('Using direct bcrypt comparison, result:', isPasswordValid)
      }
    } catch (error) {
      console.error('Password verification error:', error)
      isPasswordValid = await bcrypt.compare(password, (user as any).password)
      console.log('Fallback bcrypt comparison result:', isPasswordValid)
    }
    
    if (!isPasswordValid) {
      console.log('Password verification failed')
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (!(user as any).isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      )
    }

    ;(user as any).lastLogin = new Date()
    await (user as any).save()

    const token = generateToken(user as any)

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: (user as any)._id,
          name: (user as any).name,
          email: (user as any).email,
          role: (user as any).role,
          company: (user as any).company,
          avatar: (user as any).avatar,
        },
      },
      { status: 200 }
    )

    response.cookies.set("enterprise_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Enterprise login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

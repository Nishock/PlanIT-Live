import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"

// POST /api/admin/signup - Register admin/manager user
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { name, email, password, role, jobTitle, department, reason, company } = await request.json()
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json({ 
        error: "Name, email, password, and role are required" 
      }, { status: 400 })
    }
    
    // Validate role
    if (!["admin", "manager"].includes(role)) {
      return NextResponse.json({ 
        error: "Invalid role. Must be 'admin' or 'manager'" 
      }, { status: 400 })
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ 
        error: "User with this email already exists" 
      }, { status: 409 })
    }
    
    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    // Create user with pending status for admin role
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role,
      jobTitle: jobTitle || "",
      department: department || "",
      company: company || "",
      isActive: role === "manager", // Managers are active by default, admins need approval
      isApproved: role === "manager", // Managers are approved by default
      adminRequestReason: reason || "",
      adminRequestDate: new Date(),
      adminRequestStatus: role === "admin" ? "pending" : "approved"
    }
    
    const user = new User(userData)
    await user.save()
    
    // Return success response
    const responseData = {
      message: role === "admin" 
        ? "Admin access request submitted successfully. Please wait for approval." 
        : "Manager account created successfully. You can now sign in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isApproved: user.isApproved
      }
    }
    
    return NextResponse.json(responseData, { status: 201 })
    
  } catch (error) {
    console.error("Admin signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

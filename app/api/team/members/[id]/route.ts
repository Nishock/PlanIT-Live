import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

export const PUT = requireAuth(async (request: NextRequest, authUser, { params }) => {
  try {
    await connectDB()

    const { id } = params
    const updateData = await request.json()

    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Update team member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request: NextRequest, authUser, { params }) => {
  try {
    await connectDB()

    const { id } = params

    // Don't allow users to delete themselves
    if (id === authUser.userId) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
    }

    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deactivated successfully" })
  } catch (error) {
    console.error("Delete team member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

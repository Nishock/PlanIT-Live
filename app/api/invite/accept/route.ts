import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Invitation from "@/lib/models/Invitation"
import Workspace from "@/lib/models/Workspace"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

// GET /api/invite/accept?token=...
export const GET = async (request: NextRequest) => {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    // Find invitation
    const invitation = await Invitation.findOne({ token })
    if (!invitation) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 400 })
    }
    if (invitation.status !== "pending" || invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invitation expired or already used" }, { status: 400 })
    }

    // Check if user is logged in
    const authHeader = request.headers.get("authorization") || request.cookies.get("token")?.value
    let user = null
    if (authHeader) {
      // Use requireAuth logic to get user
      const jwt = require("@/lib/jwt")
      const payload = jwt.verifyToken(authHeader.replace("Bearer ", ""))
      if (payload && payload.id) {
        user = await User.findById(payload.id)
      }
    }

    if (user) {
      // Add user to workspace if not already a member
      const workspace = await Workspace.findById(invitation.workspace)
      if (!workspace) {
        return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
      }
      const alreadyMember = workspace.members.some(
        (m: any) => m.user.toString() === user._id.toString()
      )
      if (!alreadyMember) {
        workspace.members.push({ user: user._id, role: invitation.role, joinedAt: new Date() })
        await workspace.save()
      }
      // Mark invitation as accepted
      invitation.status = "accepted"
      await invitation.save()
      return NextResponse.json({ message: "Joined workspace successfully" })
    } else {
      // Not logged in: frontend should redirect to signup with prefilled email
      return NextResponse.json({
        requireSignup: true,
        email: invitation.email,
        message: "User must sign up or log in to accept invitation"
      }, { status: 200 })
    }
  } catch (error) {
    console.error("Accept invite error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
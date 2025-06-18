import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Workspace from "@/lib/models/Workspace"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

function memberToClient(member: any) {
  if (!member) return member
  const obj = member.toObject ? member.toObject() : member
  obj.id = obj.user?._id?.toString() || obj.user?.toString() || obj.id
  return obj
}

export const GET = requireAuth(async (request) => {
  try {
    await connectDB()
    const id = request.nextUrl.pathname.split("/").filter(Boolean).reverse()[1]
    const workspace = await Workspace.findById(id).populate("members.user", "name email avatar")

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    return NextResponse.json((workspace.members || []).map(memberToClient))
  } catch (error) {
    console.error("Get workspace members error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request) => {
  try {
    await connectDB()
    const id = request.nextUrl.pathname.split("/").filter(Boolean).reverse()[1]
    const { email, role = "member" } = await request.json()
    const workspace = await Workspace.findById(id)

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is already a member
    const existingMember = workspace.members.find((member) => member.user.toString() === user._id.toString())

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member" }, { status: 400 })
    }

    workspace.members.push({
      user: user._id,
      role,
      joinedAt: new Date(),
    })

    await workspace.save()

    const populatedWorkspace = await Workspace.findById(id).populate("members.user", "name email avatar")

    return NextResponse.json((populatedWorkspace.members || []).map(memberToClient), { status: 201 })
  } catch (error) {
    console.error("Invite workspace member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

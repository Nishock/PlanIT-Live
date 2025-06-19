import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Workspace from "@/lib/models/Workspace"
import Invitation from "@/lib/models/Invitation"
import { requireAuth } from "@/lib/middleware/auth"
import crypto from "crypto"

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const { email, workspaceId, role } = await request.json()
    if (!email || !workspaceId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find workspace
    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Check if requester is owner or admin
    const isOwner = workspace.owner.toString() === authUser._id
    const isAdmin = workspace.members.some(
      (m: any) => m.user.toString() === authUser._id && m.role === "admin"
    )
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Only workspace owner or admin can invite members" }, { status: 403 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      // Check if already a member
      const alreadyMember = workspace.members.some(
        (m: any) => m.user.toString() === existingUser._id.toString()
      )
      if (alreadyMember) {
        return NextResponse.json({ error: "User is already a member of this workspace" }, { status: 400 })
      }
      // Add to workspace
      workspace.members.push({ user: existingUser._id, role, joinedAt: new Date() })
      await workspace.save()
      return NextResponse.json({ message: "User added to workspace" })
    }

    // Prevent duplicate pending invites
    const existingInvite = await Invitation.findOne({
      email,
      workspace: workspaceId,
      status: "pending",
    })
    if (existingInvite) {
      return NextResponse.json({ error: "An invitation is already pending for this email" }, { status: 400 })
    }

    // Create invitation
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    const invitation = await Invitation.create({
      email,
      invitedBy: authUser._id,
      workspace: workspaceId,
      role,
      token,
      status: "pending",
      createdAt: new Date(),
      expiresAt,
    })

    // TODO: Send email with link (placeholder)
    const inviteLink = `https://yourapp.com/invite/accept?token=${token}`
    console.log(`Send invite to ${email}: ${inviteLink}`)

    return NextResponse.json({ message: "Invitation sent", invitationId: invitation._id })
  } catch (error) {
    console.error("Invite team member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    if (!workspaceId) {
      return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });
    }
    // Find workspace
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    // Check if requester is owner or admin
    const isOwner = workspace.owner.toString() === authUser._id;
    const isAdmin = workspace.members.some(
      (m: any) => m.user.toString() === authUser._id && m.role === "admin"
    );
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Only workspace owner or admin can view invites" }, { status: 403 });
    }
    // List pending invites
    const invites = await Invitation.find({ workspace: workspaceId, status: "pending" });
    return NextResponse.json({ invites });
  } catch (error) {
    console.error("List invites error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

export const DELETE = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const inviteId = searchParams.get("inviteId");
    if (!inviteId) {
      return NextResponse.json({ error: "Missing inviteId" }, { status: 400 });
    }
    const invitation = await Invitation.findById(inviteId);
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }
    // Find workspace
    const workspace = await Workspace.findById(invitation.workspace);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    // Check if requester is owner or admin
    const isOwner = workspace.owner.toString() === authUser._id;
    const isAdmin = workspace.members.some(
      (m: any) => m.user.toString() === authUser._id && m.role === "admin"
    );
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Only workspace owner or admin can revoke invites" }, { status: 403 });
    }
    // Mark invite as expired
    invitation.status = "expired";
    await invitation.save();
    return NextResponse.json({ message: "Invitation revoked" });
  } catch (error) {
    console.error("Revoke invite error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

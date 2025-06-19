import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Invitation from "@/lib/models/Invitation"
import Workspace from "@/lib/models/Workspace"
import { requireAuth } from "@/lib/middleware/auth"
import crypto from "crypto"
import { Server as IOServer } from "socket.io"
// import { getSocketServer } from "@/lib/socket" // removed, not used
// import { Resend } from "resend" // removed, not used

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB();
    const { inviteId } = await request.json();
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
    const isOwner = workspace.owner.toString() === authUser.userId;
    const isAdmin = workspace.members.some(
      (m: any) => m.user.toString() === authUser.userId && m.role === "admin"
    );
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Only workspace owner or admin can resend invites" }, { status: 403 });
    }
    // Regenerate token, update expiration, set status to pending
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
    invitation.token = token;
    invitation.expiresAt = expiresAt;
    invitation.status = "pending";
    await invitation.save();
    // TODO: Send email with link (placeholder)
    const inviteLink = `https://yourapp.com/invite/accept?token=${token}`;
    console.log(`Resend invite to ${invitation.email}: ${inviteLink}`);
    // Socket emission removed (not available in API route context)
    // const io = getSocketServer(res.socket?.server);
    // io.to(workspace._id).emit("team:update", { type: "invite", action: "sent", invite: invitation });
    // Email sending (commented out if Resend is not available)
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "noreply@yourapp.com",
    //   to: invitation.email,
    //   subject: "You're invited!",
    //   html: `<a href=\"${inviteLink}\">Accept your invite</a>`,
    // });
    return NextResponse.json({ message: "Invitation resent" });
  } catch (error) {
    console.error("Resend invite error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

export const GET = requireAuth(async (request, authUser) => {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const isOwner = workspace.owner.toString() === authUser.userId;
  const isAdmin = workspace.members.some((m: any) => m.user.toString() === authUser.userId && m.role === "admin");
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const invites = await Invitation.find({ workspace: workspaceId }).sort({ createdAt: -1 });
  return NextResponse.json({ invites });
});

export const PUT = requireAuth(async (request, authUser) => {
  await connectDB();
  // Use URLSearchParams to get id if needed, or expect it in the body
  const { id, workspaceId, newRole } = await request.json();

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const isOwner = workspace.owner.toString() === authUser.userId;
  const isAdmin = workspace.members.some((m: any) => m.user.toString() === authUser.userId && m.role === "admin");
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const member = workspace.members.find((m: any) => m.user.toString() === id);
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  member.role = newRole;
  await workspace.save();
  return NextResponse.json({ message: "Role updated" });
}); 
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/middleware/auth";

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  await connectDB();
  const id = request.nextUrl.pathname.split("/").filter(Boolean).reverse()[1];
  const { email } = await request.json();

  const project = await Project.findById(id);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Only project owner can add members
  if (project.owner.toString() !== authUser.userId) {
    return NextResponse.json({ error: "Only project owner can add members" }, { status: 403 });
  }

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Check if already a member
  if (project.members.some((m) => m.toString() === user._id.toString())) {
    return NextResponse.json({ error: "User is already a member" }, { status: 400 });
  }

  project.members.push(user._id);
  await project.save();

  return NextResponse.json({ message: "Member added", user: { id: user._id, name: user.name, email: user.email } });
}); 
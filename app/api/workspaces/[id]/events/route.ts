import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Workspace from "@/lib/models/Workspace"
import { requireAuth } from "@/lib/middleware/auth"

function eventToClient(event: any) {
  if (!event) return event
  const obj = event.toObject ? event.toObject() : event
  obj.id = obj._id?.toString() || obj.id
  return obj
}

export const GET = requireAuth(async (request) => {
  try {
    await connectDB()
    const workspaceId = request.nextUrl.pathname.split("/").filter(Boolean).reverse()[1]
    if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 })
    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    let events = workspace.events || []
    // Sort events by date descending (newest first)
    events = events.map(eventToClient).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return NextResponse.json(events)
  } catch (error) {
    console.error("Get workspace events error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request) => {
  try {
    await connectDB()
    const workspaceId = request.nextUrl.pathname.split("/").filter(Boolean).reverse()[1]
    if (!workspaceId) return NextResponse.json({ error: "Workspace ID required" }, { status: 400 })
    const data = await request.json()
    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    if (!workspace.events) workspace.events = []
    const event = { ...data, id: Date.now().toString() }
    workspace.events.push(event)
    await workspace.save()
    return NextResponse.json(eventToClient(event), { status: 201 })
  } catch (error) {
    console.error("Create workspace event error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

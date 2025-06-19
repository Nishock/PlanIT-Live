import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Document from "@/lib/models/Document"
import Workspace from "@/lib/models/Workspace"
import "@/lib/models/Project" 
import { requireAuth } from "@/lib/middleware/auth"


export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get("workspace")
    const projectId = searchParams.get("project")
    const type = searchParams.get("type")

    let query: any = {}
    if (workspaceId) {
      query.workspace = workspaceId
    } else {
      // Find or create the user's Personal workspace
      let personalWorkspace = await Workspace.findOne({
        name: "Personal",
        owner: authUser.userId,
      })
      if (!personalWorkspace) {
        personalWorkspace = new Workspace({
          name: "Personal",
          description: "Default personal workspace",
          type: "personal",
          owner: authUser.userId,
          members: [
            {
              user: authUser.userId,
              role: "admin",
              joinedAt: new Date(),
            },
          ],
        })
        await personalWorkspace.save()
      }
      // Show documents that are either:
      // - Not associated with any workspace (legacy)
      // - Associated with the user's Personal workspace
      query = {
        $or: [
          { owner: authUser.userId, workspace: { $exists: false } },
          { owner: authUser.userId, workspace: null },
          { owner: authUser.userId, workspace: personalWorkspace._id },
        ],
      }
    }
    if (projectId) query.project = projectId
    if (type) query.type = type

    const documents = await Document.find(query)
      .populate("owner", "name email avatar")
      .populate("project", "name")
      .sort({ updatedAt: -1 })

    // Transform the documents to match the frontend interface
    const transformedDocuments = documents.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      type: doc.type,
      workspace: doc.workspace?.toString(),
      project: doc.project?.toString(),
      createdBy: {
        id: doc.owner._id.toString(),
        name: doc.owner.name,
        email: doc.owner.email,
        avatar: doc.owner.avatar,
      },
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
      starred: doc.isStarred || false,
      tags: doc.tags || [],
    }))

    return NextResponse.json(transformedDocuments)
  } catch (error) {
    console.error("Get documents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const documentData = await request.json()

    // Get or create default workspace for the user
    let workspaceId = documentData.workspace
    
    // If no workspace is provided or it's "default", create/get default workspace
    if (!workspaceId || workspaceId === "default") {
      let defaultWorkspace = await Workspace.findOne({
        name: "Personal",
        owner: authUser.userId,
      })

      if (!defaultWorkspace) {
        defaultWorkspace = new Workspace({
          name: "Personal",
          description: "Default personal workspace",
          type: "personal",
          owner: authUser.userId,
          members: [
            {
              user: authUser.userId,
              role: "admin",
              joinedAt: new Date(),
            },
          ],
        })
        await defaultWorkspace.save()
      }

      workspaceId = defaultWorkspace._id
    }

    const document = new Document({
      title: documentData.title,
      content: documentData.content || "",
      type: documentData.type || "document",
      workspace: workspaceId,
      project: documentData.project || null,
      owner: authUser.userId,
      tags: documentData.tags || [],
      isPublic: documentData.isPublic || false,
      lastEditedBy: authUser.userId,
      lastEditedAt: new Date(),
    })

    await document.save()

    const populatedDocument = await Document.findById(document._id)
      .populate("owner", "name email avatar")
      .populate("project", "name")

    // Transform the document to match the frontend interface
    const transformedDocument = {
      id: populatedDocument._id.toString(),
      title: populatedDocument.title,
      content: populatedDocument.content,
      type: populatedDocument.type,
      workspace: populatedDocument.workspace?.toString(),
      project: populatedDocument.project?.toString(),
      createdBy: {
        id: populatedDocument.owner._id.toString(),
        name: populatedDocument.owner.name,
        email: populatedDocument.owner.email,
        avatar: populatedDocument.owner.avatar,
      },
      createdAt: populatedDocument.createdAt.toISOString(),
      updatedAt: populatedDocument.updatedAt.toISOString(),
      starred: populatedDocument.isStarred || false,
      tags: populatedDocument.tags || [],
    }

    return NextResponse.json(transformedDocument, { status: 201 })
  } catch (error) {
    console.error("Create document error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

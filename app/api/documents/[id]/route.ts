import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Document from "@/lib/models/Document"
import { requireAuth } from "@/lib/middleware/auth"

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    // Extract document ID from URL
    const documentId = request.url.split('/').pop()?.split('?')[0]
    
    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    const document = await Document.findById(documentId)
      .populate("owner", "name email avatar")
      .populate("project", "name")

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Transform the document to match the frontend interface
    const transformedDocument = {
      id: document._id.toString(),
      title: document.title,
      content: document.content,
      type: document.type,
      workspace: document.workspace?.toString(),
      project: document.project?.toString(),
      createdBy: {
        id: document.owner._id.toString(),
        name: document.owner.name,
        email: document.owner.email,
        avatar: document.owner.avatar,
      },
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
      starred: document.isStarred || false,
      tags: document.tags || [],
    }

    return NextResponse.json(transformedDocument)
  } catch (error) {
    console.error("Get document error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const PUT = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    // Extract document ID from URL
    const documentId = request.url.split('/').pop()?.split('?')[0]
    
    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    const updateData = await request.json()

    // Handle starred field mapping
    if (updateData.starred !== undefined) {
      updateData.isStarred = updateData.starred
      delete updateData.starred
    }

    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      { ...updateData, lastEditedBy: authUser.userId, lastEditedAt: new Date() },
      { new: true }
    )
      .populate("owner", "name email avatar")
      .populate("project", "name")

    if (!updatedDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Transform the document to match the frontend interface
    const transformedDocument = {
      id: updatedDocument._id.toString(),
      title: updatedDocument.title,
      content: updatedDocument.content,
      type: updatedDocument.type,
      workspace: updatedDocument.workspace?.toString(),
      project: updatedDocument.project?.toString(),
      createdBy: {
        id: updatedDocument.owner._id.toString(),
        name: updatedDocument.owner.name,
        email: updatedDocument.owner.email,
        avatar: updatedDocument.owner.avatar,
      },
      createdAt: updatedDocument.createdAt.toISOString(),
      updatedAt: updatedDocument.updatedAt.toISOString(),
      starred: updatedDocument.isStarred || false,
      tags: updatedDocument.tags || [],
    }

    return NextResponse.json(transformedDocument)
  } catch (error) {
    console.error("Update document error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    // Extract document ID from URL
    const documentId = request.url.split('/').pop()?.split('?')[0]
    
    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    const deletedDocument = await Document.findByIdAndDelete(documentId)

    if (!deletedDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Document deleted successfully" })
  } catch (error) {
    console.error("Delete document error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Create profile-photos subdirectory
    const profilePhotosDir = join(uploadsDir, "profile-photos")
    if (!existsSync(profilePhotosDir)) {
      await mkdir(profilePhotosDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `profile-${authUser.userId}-${timestamp}.${fileExtension}`
    const filePath = join(profilePhotosDir, fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the public URL
    const publicUrl = `/uploads/profile-photos/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}) 
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

// GET - Get user profile
export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    console.log("Getting profile for user:", authUser.userId)
    await connectDB()

    const user = await User.findById(authUser.userId).select("-password")
    console.log("Found user:", user ? "Yes" : "No")

    if (!user) {
      console.log("User not found in database")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const profileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      role: user.role,
      bio: user.bio || "",
      jobTitle: user.jobTitle || "",
      department: user.department || "",
      phone: user.phone || "",
      location: user.location || "",
      website: user.website || "",
      timezone: user.timezone || "America/New_York",
      github: user.github || "",
      linkedin: user.linkedin || "",
      twitter: user.twitter || "",
      skills: user.skills || [],
      profileCompleted: user.profileCompleted || false,
      emailVerified: user.emailVerified || false,
      notificationPreferences: user.notificationPreferences || {
        email: true,
        push: true,
        inApp: true,
      },
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    console.log("Returning profile data:", profileData)
    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// PUT - Update user profile
export const PUT = requireAuth(async (request: NextRequest, authUser) => {
  try {
    console.log("Updating profile for user:", authUser.userId)
    await connectDB()

    const body = await request.json()
    console.log("Update data received:", body)

    const {
      name,
      bio,
      jobTitle,
      department,
      phone,
      location,
      website,
      timezone,
      github,
      linkedin,
      twitter,
      skills,
      notificationPreferences,
      avatar,
    } = body

    // Validate input
    if (name && (name.length < 2 || name.length > 100)) {
      return NextResponse.json({ error: "Name must be between 2 and 100 characters" }, { status: 400 })
    }

    if (bio && bio.length > 500) {
      return NextResponse.json({ error: "Bio cannot exceed 500 characters" }, { status: 400 })
    }

    if (skills && (!Array.isArray(skills) || skills.length > 20)) {
      return NextResponse.json({ error: "Skills must be an array with maximum 20 items" }, { status: 400 })
    }

    // Build update object with only provided fields
    const updateData: any = {}

    if (name !== undefined) updateData.name = name.trim()
    if (bio !== undefined) updateData.bio = bio.trim()
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle.trim()
    if (department !== undefined) updateData.department = department.trim()
    if (phone !== undefined) updateData.phone = phone.trim()
    if (location !== undefined) updateData.location = location.trim()
    if (website !== undefined) updateData.website = website.trim()
    if (timezone !== undefined) updateData.timezone = timezone
    if (github !== undefined) updateData.github = github.trim()
    if (linkedin !== undefined) updateData.linkedin = linkedin.trim()
    if (twitter !== undefined) updateData.twitter = twitter.trim()
    if (skills !== undefined) updateData.skills = skills.map((skill: string) => skill.trim()).filter(Boolean)
    if (notificationPreferences !== undefined) updateData.notificationPreferences = notificationPreferences
    if (avatar !== undefined) updateData.avatar = avatar.trim()

    console.log("Update data to save:", updateData)

    // Find and update user
    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: "-password",
      },
    )

    if (!user) {
      console.log("User not found for update")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("User updated successfully:", user._id)

    const updatedProfileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      role: user.role,
      bio: user.bio || "",
      jobTitle: user.jobTitle || "",
      department: user.department || "",
      phone: user.phone || "",
      location: user.location || "",
      website: user.website || "",
      timezone: user.timezone || "America/New_York",
      github: user.github || "",
      linkedin: user.linkedin || "",
      twitter: user.twitter || "",
      skills: user.skills || [],
      profileCompleted: user.profileCompleted || false,
      emailVerified: user.emailVerified || false,
      notificationPreferences: user.notificationPreferences || {
        email: true,
        push: true,
        inApp: true,
      },
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedProfileData,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})

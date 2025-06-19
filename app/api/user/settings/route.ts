import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware/auth"

// 👇 This line is important to fix the Vercel deployment error
export const dynamic = "force-dynamic";

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const user = await User.findById(authUser.userId).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const settings = {
      profile: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        jobTitle: user.jobTitle,
        department: user.department,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
      },
      preferences: {
        language: user.preferences?.language || "en",
        timezone: user.preferences?.timezone || "America/Los_Angeles",
        dateFormat: user.preferences?.dateFormat || "MM/DD/YYYY",
        timeFormat: user.preferences?.timeFormat || "12h",
        theme: user.preferences?.theme || "system",
      },
      notifications: {
        emailNotifications: user.notifications?.emailNotifications ?? true,
        pushNotifications: user.notifications?.pushNotifications ?? true,
        taskReminders: user.notifications?.taskReminders ?? true,
        mentionNotifications: user.notifications?.mentionNotifications ?? true,
        weeklyDigest: user.notifications?.weeklyDigest ?? true,
        marketingEmails: user.notifications?.marketingEmails ?? false,
        desktopNotifications: user.notifications?.desktopNotifications ?? true,
        mobileNotifications: user.notifications?.mobileNotifications ?? true,
      },
      privacy: {
        profileVisibility: user.privacy?.profileVisibility || "everyone",
        activityVisibility: user.privacy?.activityVisibility || "team",
        showOnlineStatus: user.privacy?.showOnlineStatus ?? true,
        allowDataCollection: user.privacy?.allowDataCollection ?? true,
        showEmail: user.privacy?.showEmail ?? false,
        showPhone: user.privacy?.showPhone ?? false,
      },
      security: {
        twoFactorAuth: user.security?.twoFactorAuth ?? false,
        sessionTimeout: user.security?.sessionTimeout || "30m",
        loginNotifications: user.security?.loginNotifications ?? true,
        passwordLastChanged: user.security?.passwordLastChanged,
        activeSessions: user.security?.activeSessions || 1,
      },
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Get user settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const PUT = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const { section, data } = await request.json()

    const updateData: any = {}
    updateData[section] = data

    const user = await User.findByIdAndUpdate(authUser.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error) {
    console.error("Update user settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

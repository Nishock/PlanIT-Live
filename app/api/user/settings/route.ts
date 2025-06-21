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
      preferences: {
        theme: user.preferences?.theme || "system",
        emailNotifications: user.notifications?.emailNotifications ?? true,
        pushNotifications: user.notifications?.pushNotifications ?? true,
        taskReminders: user.notifications?.taskReminders ?? true,
        weeklyDigest: user.notifications?.weeklyDigest ?? true,
        marketing: user.notifications?.marketingEmails ?? false,
        soundEffects: user.preferences?.soundEffects ?? true,
        autoSave: user.preferences?.autoSave ?? true,
        compactMode: user.preferences?.compactMode ?? false,
      },
      privacy: {
        profileVisibility: user.privacy?.profileVisibility || "team",
        showEmail: user.privacy?.showEmail ?? false,
        showPhone: user.privacy?.showPhone ?? false,
        showLocation: user.privacy?.showLocation ?? false,
        allowDirectMessages: user.privacy?.allowDirectMessages ?? true,
        allowMentions: user.privacy?.allowMentions ?? true,
        activityStatus: user.privacy?.showOnlineStatus ?? true,
      },
      security: {
        twoFactorEnabled: user.security?.twoFactorAuth ?? false,
        passwordLastChanged: user.security?.passwordLastChanged?.toISOString() || "2024-01-01",
        activeSessions: user.security?.activeSessions || 1,
        loginAlerts: user.security?.loginNotifications ?? true,
        deviceTrust: user.security?.deviceTrust ?? false,
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

    const body = await request.json()
    console.log("Settings update request:", body)

    // Handle different update scenarios
    let updateData: any = {}

    if (body.preferences) {
      // Map frontend preferences to database structure
      updateData.preferences = {
        theme: body.preferences.theme,
        soundEffects: body.preferences.soundEffects,
        autoSave: body.preferences.autoSave,
        compactMode: body.preferences.compactMode,
      }
      
      // Map notification preferences
      updateData.notifications = {
        emailNotifications: body.preferences.emailNotifications,
        pushNotifications: body.preferences.pushNotifications,
        taskReminders: body.preferences.taskReminders,
        weeklyDigest: body.preferences.weeklyDigest,
        marketingEmails: body.preferences.marketing,
      }
    }

    if (body.privacy) {
      updateData.privacy = {
        profileVisibility: body.privacy.profileVisibility,
        showEmail: body.privacy.showEmail,
        showPhone: body.privacy.showPhone,
        showLocation: body.privacy.showLocation,
        allowDirectMessages: body.privacy.allowDirectMessages,
        allowMentions: body.privacy.allowMentions,
        showOnlineStatus: body.privacy.activityStatus,
      }
    }

    if (body.security) {
      updateData.security = {
        twoFactorAuth: body.security.twoFactorEnabled,
        loginNotifications: body.security.loginAlerts,
        deviceTrust: body.security.deviceTrust,
      }
    }

    console.log("Updating user with data:", updateData)

    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return the updated settings in the same format as GET
    const updatedSettings = {
      preferences: {
        theme: user.preferences?.theme || "system",
        emailNotifications: user.notifications?.emailNotifications ?? true,
        pushNotifications: user.notifications?.pushNotifications ?? true,
        taskReminders: user.notifications?.taskReminders ?? true,
        weeklyDigest: user.notifications?.weeklyDigest ?? true,
        marketing: user.notifications?.marketingEmails ?? false,
        soundEffects: user.preferences?.soundEffects ?? true,
        autoSave: user.preferences?.autoSave ?? true,
        compactMode: user.preferences?.compactMode ?? false,
      },
      privacy: {
        profileVisibility: user.privacy?.profileVisibility || "team",
        showEmail: user.privacy?.showEmail ?? false,
        showPhone: user.privacy?.showPhone ?? false,
        showLocation: user.privacy?.showLocation ?? false,
        allowDirectMessages: user.privacy?.allowDirectMessages ?? true,
        allowMentions: user.privacy?.allowMentions ?? true,
        activityStatus: user.privacy?.showOnlineStatus ?? true,
      },
      security: {
        twoFactorEnabled: user.security?.twoFactorAuth ?? false,
        passwordLastChanged: user.security?.passwordLastChanged?.toISOString() || "2024-01-01",
        activeSessions: user.security?.activeSessions || 1,
        loginAlerts: user.security?.loginNotifications ?? true,
        deviceTrust: user.security?.deviceTrust ?? false,
      },
    }

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Update user settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

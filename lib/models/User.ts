import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  avatar?: string
  role: "owner" | "admin" | "manager" | "member" | "guest"
  jobTitle?: string
  department?: string
  phone?: string
  location?: string
  bio?: string
  isActive: boolean
  emailVerified: boolean
  lastLogin?: Date
  preferences?: {
    language: string
    timezone: string
    dateFormat: string
    timeFormat: string
    theme: string
  }
  notifications?: {
    emailNotifications: boolean
    pushNotifications: boolean
    taskReminders: boolean
    mentionNotifications: boolean
    weeklyDigest: boolean
    marketingEmails: boolean
    desktopNotifications: boolean
    mobileNotifications: boolean
  }
  privacy?: {
    profileVisibility: "everyone" | "team" | "workspace" | "private"
    activityVisibility: "everyone" | "team" | "workspace" | "private"
    showOnlineStatus: boolean
    allowDataCollection: boolean
    showEmail: boolean
    showPhone: boolean
  }
  security?: {
    twoFactorAuth: boolean
    sessionTimeout: string
    loginNotifications: boolean
    passwordLastChanged?: Date
    activeSessions: number
    lastSignOutAll?: Date
  }
  comparePassword(candidatePassword: string): Promise<boolean>
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["owner", "admin", "manager", "member", "guest"],
      default: "member",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      timezone: {
        type: String,
        default: "America/Los_Angeles",
      },
      dateFormat: {
        type: String,
        default: "MM/DD/YYYY",
      },
      timeFormat: {
        type: String,
        default: "12h",
      },
      theme: {
        type: String,
        default: "system",
      },
    },
    notifications: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      taskReminders: {
        type: Boolean,
        default: true,
      },
      mentionNotifications: {
        type: Boolean,
        default: true,
      },
      weeklyDigest: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
      desktopNotifications: {
        type: Boolean,
        default: true,
      },
      mobileNotifications: {
        type: Boolean,
        default: true,
      },
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["everyone", "team", "workspace", "private"],
        default: "everyone",
      },
      activityVisibility: {
        type: String,
        enum: ["everyone", "team", "workspace", "private"],
        default: "team",
      },
      showOnlineStatus: {
        type: Boolean,
        default: true,
      },
      allowDataCollection: {
        type: Boolean,
        default: true,
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: false,
      },
    },
    security: {
      twoFactorAuth: {
        type: Boolean,
        default: false,
      },
      sessionTimeout: {
        type: String,
        default: "30m",
      },
      loginNotifications: {
        type: Boolean,
        default: true,
      },
      passwordLastChanged: {
        type: Date,
      },
      activeSessions: {
        type: Number,
        default: 1,
      },
      lastSignOutAll: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Add password comparison method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    console.error("Password comparison error:", error)
    return false
  }
}

// Create indexes
userSchema.index({ isActive: 1 })
userSchema.index({ role: 1 })

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default User

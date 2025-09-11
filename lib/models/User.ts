import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  avatar?: string
  role: "super-admin" | "company-admin" | "owner" | "admin" | "manager" | "member" | "guest"
  jobTitle?: string
  department?: string
  phone?: string
  location?: string
  bio?: string
  isActive: boolean
  isApproved: boolean
  emailVerified: boolean
  lastLogin?: Date
  company?: string
  adminRequestReason?: string
  adminRequestDate?: Date
  adminRequestStatus?: "pending" | "approved" | "rejected"
  preferences?: {
    language: string
    timezone: string
    dateFormat: string
    timeFormat: string
    theme: string
    soundEffects: boolean
    autoSave: boolean
    compactMode: boolean
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
    showLocation: boolean
    allowDirectMessages: boolean
    allowMentions: boolean
  }
  security?: {
    twoFactorAuth: boolean
    sessionTimeout: string
    loginNotifications: boolean
    passwordLastChanged?: Date
    activeSessions: number
    lastSignOutAll?: Date
    deviceTrust: boolean
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
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
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
      select: false, // ✅ required to make .select('+password') work
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["super-admin", "company-admin", "owner", "admin", "manager", "member", "guest"],
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
    company: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
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
    adminRequestReason: {
      type: String,
      default: "",
    },
    adminRequestDate: {
      type: Date,
    },
    adminRequestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
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
      soundEffects: {
        type: Boolean,
        default: true,
      },
      autoSave: {
        type: Boolean,
        default: true,
      },
      compactMode: {
        type: Boolean,
        default: false,
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
      showLocation: {
        type: Boolean,
        default: false,
      },
      allowDirectMessages: {
        type: Boolean,
        default: true,
      },
      allowMentions: {
        type: Boolean,
        default: true,
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
      deviceTrust: {
        type: Boolean,
        default: false,
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

// Add password hashing before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as mongoose.CallbackError);
  }
});

// Create indexes
userSchema.index({ isActive: 1 })
userSchema.index({ role: 1 })

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default User

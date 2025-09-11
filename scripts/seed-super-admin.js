const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Define the User schema directly in the script
const userSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
})

// Add password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
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
    next(err);
  }
});

// Create indexes
userSchema.index({ isActive: 1 })
userSchema.index({ role: 1 })

const User = mongoose.models.User || mongoose.model("User", userSchema)

async function seedSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/planit')
    console.log('Connected to MongoDB')

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ 
      email: 'phaniques.admin@phaniques.com' 
    })

    if (existingAdmin) {
      console.log('Super admin already exists, skipping...')
      process.exit(0)
    }

    // Create super admin user (password will be hashed by the model's pre-save hook)
    const superAdmin = new User({
      name: 'Phaniques Super Admin',
      email: 'phaniques.admin@phaniques.com',
      password: 'planiques@admin1234', // Will be hashed automatically by the model
      role: 'super-admin',
      company: 'Phaniques',
      isActive: true,
      isApproved: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Save the super admin
    await superAdmin.save()
    console.log('✅ Super admin created successfully!')
    console.log('Email: phaniques.admin@phaniques.com')
    console.log('Password: planiques@admin1234')
    console.log('Role: super-admin')

  } catch (error) {
    console.error('❌ Error creating super admin:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the seed function
seedSuperAdmin()

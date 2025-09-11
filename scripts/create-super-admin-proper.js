const mongoose = require('mongoose')

async function createSuperAdminProper() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/planit')
    console.log('Connected to MongoDB')

    // Import the User model (we'll define it here to avoid TypeScript issues)
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      company: String,
      isActive: Boolean,
      isApproved: Boolean,
      emailVerified: Boolean,
      avatar: String,
      jobTitle: String,
      department: String,
      phone: String,
      location: String,
      bio: String,
      adminRequestReason: String,
      adminRequestDate: Date,
      adminRequestStatus: String,
      preferences: Object,
      notifications: Object,
      privacy: Object,
      security: Object,
      createdAt: Date,
      updatedAt: Date
    }, { timestamps: true })

    // Add the comparePassword method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      const bcrypt = require('bcryptjs')
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
        const bcrypt = require('bcryptjs')
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (err) {
        next(err);
      }
    });

    const User = mongoose.models.User || mongoose.model("User", userSchema)

    // Delete existing super admin if exists
    const deleteResult = await User.deleteOne({ email: 'phaniques.admin@phaniques.com' })
    if (deleteResult.deletedCount > 0) {
      console.log('✅ Existing super admin deleted')
    }

    // Create the super admin user using the User model
    const superAdmin = new User({
      name: 'Phaniques Super Admin',
      email: 'phaniques.admin@phaniques.com',
      password: 'planiques@admin1234', // Will be hashed by pre-save hook
      role: 'super-admin',
      company: 'Phaniques',
      isActive: true,
      isApproved: true,
      emailVerified: true,
      avatar: '',
      jobTitle: 'System Administrator',
      department: 'IT',
      phone: '',
      location: '',
      bio: 'Super Administrator for Phaniques',
      adminRequestReason: '',
      adminRequestDate: new Date(),
      adminRequestStatus: 'approved',
      preferences: {
        language: 'en',
        timezone: 'America/Los_Angeles',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        theme: 'system',
        soundEffects: true,
        autoSave: true,
        compactMode: false
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        taskReminders: true,
        mentionNotifications: true,
        weeklyDigest: true,
        marketingEmails: false,
        desktopNotifications: true,
        mobileNotifications: true
      },
      privacy: {
        profileVisibility: 'everyone',
        activityVisibility: 'team',
        showOnlineStatus: true,
        allowDataCollection: true,
        showEmail: false,
        showPhone: false,
        showLocation: false,
        allowDirectMessages: true,
        allowMentions: true
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: '30m',
        loginNotifications: true,
        passwordLastChanged: new Date(),
        activeSessions: 1,
        lastSignOutAll: null,
        deviceTrust: false
      }
    })

    // Save the user (this will trigger password hashing)
    await superAdmin.save()
    console.log('✅ Super admin created successfully using User model!')
    console.log('User ID:', superAdmin._id)
    console.log('Email:', superAdmin.email)
    console.log('Role:', superAdmin.role)
    console.log('Password hash length:', superAdmin.password.length)

    // Test the comparePassword method
    const testPassword = 'planiques@admin1234'
    const isMatch = await superAdmin.comparePassword(testPassword)
    console.log('✅ comparePassword method test:', isMatch)

    // Test with wrong password
    const wrongPassword = 'wrongpassword'
    const wrongMatch = await superAdmin.comparePassword(wrongPassword)
    console.log('✅ Wrong password test:', wrongMatch)

    // Verify the user can be found by the User model
    const foundUser = await User.findOne({ email: 'phaniques.admin@phaniques.com' }).select('+password')
    if (foundUser) {
      console.log('✅ User found by User model:')
      console.log('Name:', foundUser.name)
      console.log('Role:', foundUser.role)
      console.log('Is Active:', foundUser.isActive)
      console.log('Has comparePassword method:', typeof foundUser.comparePassword === 'function')
    } else {
      console.log('❌ User not found by User model')
    }

  } catch (error) {
    console.error('❌ Error creating super admin:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the function
createSuperAdminProper()

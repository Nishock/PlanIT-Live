const mongoose = require('mongoose')

async function testUserModelImport() {
  try {
    console.log('Testing User model import...')
    
    // Try to import the User model from the compiled Next.js build
    let User
    try {
      // Try to require from the compiled build
      const UserModule = require('../.next/server/app/api/enterprise-login/route.js')
      console.log('✅ User module loaded from Next.js build')
      
      // Check if User model is available
      if (mongoose.models.User) {
        User = mongoose.models.User
        console.log('✅ User model found in mongoose.models')
      } else {
        console.log('❌ User model not found in mongoose.models')
      }
    } catch (error) {
      console.log('❌ Error loading User module:', error.message)
    }

    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/planit')
    console.log('✅ Connected to MongoDB')

    // Check if User model exists after connection
    if (mongoose.models.User) {
      User = mongoose.models.User
      console.log('✅ User model found after connection')
      
      // Try to find the super admin user
      const user = await User.findOne({ email: 'phaniques.admin@phaniques.com' }).select('+password')
      if (user) {
        console.log('✅ User found with User model:')
        console.log('Name:', user.name)
        console.log('Role:', user.role)
        console.log('Is Active:', user.isActive)
        console.log('Has comparePassword method:', typeof user.comparePassword === 'function')
      } else {
        console.log('❌ User not found with User model')
      }
    } else {
      console.log('❌ User model still not found after connection')
      
      // Try to manually define the User model
      console.log('Attempting to manually define User model...')
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

      const ManualUser = mongoose.model("User", userSchema)
      console.log('✅ Manual User model created')
      
      // Test with manual model
      const manualUser = await ManualUser.findOne({ email: 'phaniques.admin@phaniques.com' }).select('+password')
      if (manualUser) {
        console.log('✅ User found with manual User model:')
        console.log('Name:', manualUser.name)
        console.log('Role:', manualUser.role)
        console.log('Is Active:', manualUser.isActive)
        console.log('Has comparePassword method:', typeof manualUser.comparePassword === 'function')
      } else {
        console.log('❌ User not found with manual User model')
      }
    }

  } catch (error) {
    console.error('❌ Error testing User model import:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

testUserModelImport()

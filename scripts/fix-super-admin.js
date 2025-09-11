const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

async function fixSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/planit')
    console.log('Connected to MongoDB')

    // Get the users collection directly
    const db = mongoose.connection.db
    const usersCollection = db.collection('users')

    // Delete existing super admin if exists
    const deleteResult = await usersCollection.deleteOne({ 
      email: 'phaniques.admin@phaniques.com' 
    })
    
    if (deleteResult.deletedCount > 0) {
      console.log('✅ Existing super admin deleted')
    }

    // Hash the password manually (since we can't use the User model in scripts)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('planiques@admin1234', salt)

    // Create the super admin user with all required fields
    const superAdmin = {
      name: 'Phaniques Super Admin',
      email: 'phaniques.admin@phaniques.com',
      password: hashedPassword,
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
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert the super admin
    const result = await usersCollection.insertOne(superAdmin)
    console.log('✅ Super admin created successfully!')
    console.log('User ID:', result.insertedId)
    console.log('Email: phaniques.admin@phaniques.com')
    console.log('Password: planiques@admin1234')
    console.log('Role: super-admin')

    // Verify the user was created
    const createdUser = await usersCollection.findOne({ email: 'phaniques.admin@phaniques.com' })
    console.log('✅ Verification - User found in database:')
    console.log('Name:', createdUser.name)
    console.log('Role:', createdUser.role)
    console.log('Is Active:', createdUser.isActive)
    console.log('Password hash length:', createdUser.password.length)

    // Test password comparison
    const testPassword = 'planiques@admin1234'
    const isMatch = await bcrypt.compare(testPassword, createdUser.password)
    console.log('✅ Password verification test:', isMatch)

    // Test wrong password
    const wrongPassword = 'wrongpassword'
    const wrongMatch = await bcrypt.compare(wrongPassword, createdUser.password)
    console.log('✅ Wrong password test:', wrongMatch)

  } catch (error) {
    console.error('❌ Error fixing super admin:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the fix
fixSuperAdmin()

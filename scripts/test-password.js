const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Import the actual User model from the project
const User = require('../lib/models/User').default

async function testPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/planit')
    console.log('Connected to MongoDB')

    // Find the super admin user
    const user = await User.findOne({ email: 'phaniques.admin@phaniques.com' })
    
    if (!user) {
      console.log('❌ Super admin user not found')
      return
    }

    console.log('✅ Super admin user found:')
    console.log('Email:', user.email)
    console.log('Role:', user.role)
    console.log('Password hash:', user.password)
    console.log('Password length:', user.password.length)

    // Test password comparison
    const testPassword = 'planiques@admin1234'
    const isMatch = await user.comparePassword(testPassword)
    
    console.log('Password comparison result:', isMatch)

    // Test direct bcrypt comparison
    const directMatch = await bcrypt.compare(testPassword, user.password)
    console.log('Direct bcrypt comparison result:', directMatch)

    // Test with wrong password
    const wrongPassword = 'wrongpassword'
    const wrongMatch = await user.comparePassword(wrongPassword)
    console.log('Wrong password comparison result:', wrongMatch)

  } catch (error) {
    console.error('❌ Error testing password:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the test
testPassword()

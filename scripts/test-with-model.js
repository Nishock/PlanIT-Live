const mongoose = require('mongoose')

// Import the actual User model
const User = require('../lib/models/User').default

async function testWithModel() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/planit')
    console.log('Connected to MongoDB')

    // Find the super admin user using the actual User model
    const user = await User.findOne({ email: 'phaniques.admin@phaniques.com' }).select('+password')
    
    if (!user) {
      console.log('❌ Super admin user not found')
      return
    }

    console.log('✅ Super admin user found using User model')
    console.log('Email:', user.email)
    console.log('Role:', user.role)
    console.log('Is Active:', user.isActive)
    console.log('Password hash:', user.password)
    console.log('Password hash length:', user.password.length)

    // Test the comparePassword method
    const testPassword = 'planiques@admin1234'
    const isMatch = await user.comparePassword(testPassword)
    console.log('User.comparePassword result:', isMatch)

    // Test with wrong password
    const wrongPassword = 'wrongpassword'
    const wrongMatch = await user.comparePassword(wrongPassword)
    console.log('Wrong password result:', wrongMatch)

    // Check if the method exists
    if (typeof user.comparePassword === 'function') {
      console.log('✅ comparePassword method exists')
    } else {
      console.log('❌ comparePassword method does not exist')
    }

    // Check the method type
    console.log('comparePassword type:', typeof user.comparePassword)

  } catch (error) {
    console.error('❌ Error testing with User model:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the test
testWithModel()

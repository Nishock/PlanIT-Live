const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

async function simpleTest() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/planit')
    console.log('Connected to MongoDB')

    // Get the users collection directly
    const db = mongoose.connection.db
    const usersCollection = db.collection('users')

    // Find the super admin user
    const user = await usersCollection.findOne({ email: 'phaniques.admin@phaniques.com' })
    
    if (!user) {
      console.log('❌ Super admin user not found')
      return
    }

    console.log('✅ Super admin user found:')
    console.log('Email:', user.email)
    console.log('Role:', user.role)
    console.log('Password hash:', user.password)
    console.log('Password hash starts with $2b$:', user.password.startsWith('$2b$'))

    // Test password comparison with bcrypt
    const testPassword = 'planiques@admin1234'
    const isMatch = await bcrypt.compare(testPassword, user.password)
    
    console.log('Password comparison result:', isMatch)

    // Test with wrong password
    const wrongPassword = 'wrongpassword'
    const wrongMatch = await bcrypt.compare(wrongPassword, user.password)
    console.log('Wrong password comparison result:', wrongMatch)

    // Check if password looks like a valid bcrypt hash
    if (user.password.startsWith('$2b$') && user.password.length === 60) {
      console.log('✅ Password appears to be a valid bcrypt hash')
    } else {
      console.log('❌ Password does not appear to be a valid bcrypt hash')
    }

  } catch (error) {
    console.error('❌ Error testing password:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the test
simpleTest()

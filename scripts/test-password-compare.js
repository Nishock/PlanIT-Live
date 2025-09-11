const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

async function testPasswordCompare() {
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

    console.log('✅ Super admin user found')
    console.log('Password hash:', user.password)
    console.log('Password hash length:', user.password.length)

    // Test the exact password from the requirements
    const testPassword = 'planiques@admin1234'
    
    // Test with bcrypt directly
    const bcryptResult = await bcrypt.compare(testPassword, user.password)
    console.log('Bcrypt comparison result:', bcryptResult)

    // Test with a slightly different password
    const wrongPassword = 'planiques@admin123'
    const wrongResult = await bcrypt.compare(wrongPassword, user.password)
    console.log('Wrong password result:', wrongResult)

    // Test with empty password
    const emptyResult = await bcrypt.compare('', user.password)
    console.log('Empty password result:', emptyResult)

    // Test with null password
    const nullResult = await bcrypt.compare(null, user.password)
    console.log('Null password result:', nullResult)

    // Check if the hash looks valid
    if (user.password && user.password.startsWith('$2b$') && user.password.length === 60) {
      console.log('✅ Password hash appears valid')
    } else {
      console.log('❌ Password hash appears invalid')
      console.log('Hash format:', user.password ? user.password.substring(0, 10) + '...' : 'undefined')
    }

  } catch (error) {
    console.error('❌ Error testing password comparison:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the test
testPasswordCompare()

const mongoose = require('mongoose')

async function testDBConnection() {
  try {
    console.log('Testing database connection...')
    await mongoose.connect('mongodb://localhost:27017/planit')
    console.log('✅ Connected to MongoDB')

    // Test if we can access the users collection
    const db = mongoose.connection.db
    const usersCollection = db.collection('users')
    
    // Count users
    const userCount = await usersCollection.countDocuments()
    console.log('Total users in database:', userCount)
    
    // Find the super admin
    const superAdmin = await usersCollection.findOne({ email: 'phaniques.admin@phaniques.com' })
    if (superAdmin) {
      console.log('✅ Super admin found in collection:')
      console.log('Name:', superAdmin.name)
      console.log('Role:', superAdmin.role)
      console.log('Is Active:', superAdmin.isActive)
      console.log('Password hash length:', superAdmin.password ? superAdmin.password.length : 'undefined')
    } else {
      console.log('❌ Super admin not found in collection')
    }

    // Test User model (if it exists)
    try {
      // This might fail if the User model isn't properly compiled
      const User = mongoose.models.User
      if (User) {
        console.log('✅ User model found in mongoose.models')
        
        // Try to find user with User model
        const userWithModel = await User.findOne({ email: 'phaniques.admin@phaniques.com' }).select('+password')
        if (userWithModel) {
          console.log('✅ User found with User model:')
          console.log('Name:', userWithModel.name)
          console.log('Role:', userWithModel.role)
          console.log('Has comparePassword method:', typeof userWithModel.comparePassword === 'function')
        } else {
          console.log('❌ User not found with User model')
        }
      } else {
        console.log('❌ User model not found in mongoose.models')
      }
    } catch (error) {
      console.log('❌ Error testing User model:', error.message)
    }

  } catch (error) {
    console.error('❌ Database connection error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

testDBConnection()

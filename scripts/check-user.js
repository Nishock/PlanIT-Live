const mongoose = require('mongoose')

async function checkUser() {
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
    console.log('Is Active:', user.isActive)
    console.log('Is Approved:', user.isApproved)
    console.log('Company:', user.company)
    console.log('Created At:', user.createdAt)
    console.log('Updated At:', user.updatedAt)

    // Check if role is correct
    if (user.role === 'super-admin') {
      console.log('✅ Role is correct: super-admin')
    } else {
      console.log('❌ Role is incorrect:', user.role)
    }

    // Check if user is active
    if (user.isActive === true) {
      console.log('✅ User is active')
    } else {
      console.log('❌ User is not active:', user.isActive)
    }

  } catch (error) {
    console.error('❌ Error checking user:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the check
checkUser()

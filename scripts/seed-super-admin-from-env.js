const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    const lines = content.split(/\r?\n/)
    for (const line of lines) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (m) {
        const key = m[1]
        let value = m[2]
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        process.env[key] = value
      }
    }
    console.log('Loaded .env.local')
  } else {
    console.log('.env.local not found, using defaults')
  }
}

async function seedFromEnv() {
  try {
    loadEnvLocal()
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/planit'
    console.log('Connecting to MongoDB URI:', uri.replace(/:\/\/[^@]+@/, '://<redacted>@'))

    await mongoose.connect(uri)
    console.log('Connected to MongoDB')

    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true, lowercase: true, trim: true },
      password: String,
      role: String,
      company: String,
      isActive: Boolean,
      isApproved: Boolean,
      emailVerified: Boolean,
      createdAt: Date,
      updatedAt: Date
    }, { timestamps: true })

    const User = mongoose.models.User || mongoose.model('User', userSchema)

    await User.deleteOne({ email: 'phaniques.admin@phaniques.com' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('planiques@admin1234', salt)

    const doc = new User({
      name: 'Phaniques Super Admin',
      email: 'phaniques.admin@phaniques.com',
      password: hashedPassword,
      role: 'super-admin',
      company: 'Phaniques',
      isActive: true,
      isApproved: true,
      emailVerified: true,
    })

    await doc.save()
    console.log('Seeded super admin to DB:', uri)
  } catch (err) {
    console.error('Seeding error:', err)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedFromEnv()

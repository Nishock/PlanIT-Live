import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/planit"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

// Extend global to include mongoose
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    }

    console.log("Connecting to MongoDB...")
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("MongoDB connection error:", e)
    throw e
  }

  // Remove googleId index if it exists
  try {
    if (mongoose.connection.db) {
      const indexes = await mongoose.connection.db.collection("users").indexes();
      const googleIdIndex = indexes.find(idx => idx.key && idx.key.googleId === 1);
      if (googleIdIndex && googleIdIndex.name) {
        await mongoose.connection.db.collection("users").dropIndex(googleIdIndex.name as string);
        console.log("Dropped duplicate googleId index from users collection.");
      } else {
        console.warn("Could not drop googleId index: mongoose.connection.db is undefined");
      }
    }
  } catch (err: any) {
    // Only log, don't crash app
    console.warn("Could not drop googleId index (may not exist):", err.message);
  }

  return cached.conn
}

export default connectDB

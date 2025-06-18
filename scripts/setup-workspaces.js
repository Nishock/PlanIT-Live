const { MongoClient } = require("mongodb")
require("dotenv").config({ path: ".env.local" })

async function setupWorkspaces() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Get all users
    const users = await db.collection("users").find({}).toArray()
    console.log(`Found ${users.length} users`)

    for (const user of users) {
      // Check if user already has a Personal workspace
      const existingWorkspace = await db.collection("workspaces").findOne({
        name: "Personal",
        createdBy: user._id,
      })

      if (!existingWorkspace) {
        // Create Personal workspace for user
        const workspace = {
          name: "Personal",
          description: "Default personal workspace",
          createdBy: user._id,
          members: [user._id],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const result = await db.collection("workspaces").insertOne(workspace)
        console.log(`Created Personal workspace for ${user.name}: ${result.insertedId}`)
      } else {
        console.log(`Personal workspace already exists for ${user.name}`)
      }
    }

    console.log("Workspace setup completed!")
  } catch (error) {
    console.error("Error setting up workspaces:", error)
  } finally {
    await client.close()
  }
}

setupWorkspaces()

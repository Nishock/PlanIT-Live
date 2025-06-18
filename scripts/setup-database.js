const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// MongoDB Atlas connection string
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://nishock03:<#Happynow#1>@cluster0.2uveg4c.mongodb.net/planit?retryWrites=true&w=majority&appName=Cluster0"

// Simple schemas for setup (we'll use the full models in the app)
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "admin" },
    emailVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
)

const WorkspaceSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    type: { type: String, default: "personal" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, default: "admin" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    settings: {
      isPublic: { type: Boolean, default: false },
      allowInvites: { type: Boolean, default: true },
      defaultTaskStatus: { type: String, default: "todo" },
    },
  },
  { timestamps: true },
)

const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, default: "active" },
    progress: { type: Number, default: 0 },
    tags: [String],
    settings: {
      isPublic: { type: Boolean, default: false },
      allowComments: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
)

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: { type: String, default: "todo" },
    priority: { type: String, default: "medium" },
    type: { type: String, default: "task" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    tags: [String],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    completedAt: Date,
  },
  { timestamps: true },
)

const DocumentSchema = new mongoose.Schema(
  {
    title: String,
    content: { type: String, default: "" },
    type: { type: String, default: "document" },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    collaborators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        permission: { type: String, default: "read" },
      },
    ],
    tags: [String],
    isPublic: { type: Boolean, default: false },
    version: { type: Number, default: 1 },
    lastEditedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastEditedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

async function setupDatabase() {
  try {
    console.log("🔄 Connecting to MongoDB Atlas...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB Atlas")

    // Create models
    const User = mongoose.model("User", UserSchema)
    const Workspace = mongoose.model("Workspace", WorkspaceSchema)
    const Project = mongoose.model("Project", ProjectSchema)
    const Task = mongoose.model("Task", TaskSchema)
    const Document = mongoose.model("Document", DocumentSchema)

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🧹 Clearing existing data...")
    await User.deleteMany({})
    await Workspace.deleteMany({})
    await Project.deleteMany({})
    await Task.deleteMany({})
    await Document.deleteMany({})

    // Create demo user
    console.log("👤 Creating demo user...")
    const hashedPassword = await bcrypt.hash("demo1234", 10)

    const demoUser = new User({
      name: "Demo User",
      email: "demo@planit.app",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
    })

    await demoUser.save()
    console.log("✅ Demo user created: demo@planit.app / demo1234")

    // Create additional demo users
    const users = []
    const userNames = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson"]

    for (let i = 0; i < userNames.length; i++) {
      const user = new User({
        name: userNames[i],
        email: `user${i + 1}@planit.app`,
        password: await bcrypt.hash("demo1234", 10),
        role: "member",
        emailVerified: true,
      })
      await user.save()
      users.push(user)
    }

    console.log("✅ Additional demo users created")

    // Create demo workspaces
    console.log("🏢 Creating demo workspaces...")

    const personalWorkspace = new Workspace({
      name: "Personal Workspace",
      description: "Your personal workspace for individual tasks and projects",
      type: "personal",
      owner: demoUser._id,
      members: [
        {
          user: demoUser._id,
          role: "admin",
          joinedAt: new Date(),
        },
      ],
    })

    const acmeWorkspace = new Workspace({
      name: "Acme Inc",
      description: "Corporate workspace for Acme Inc projects",
      type: "organization",
      owner: demoUser._id,
      members: [
        { user: demoUser._id, role: "admin", joinedAt: new Date() },
        { user: users[0]._id, role: "manager", joinedAt: new Date() },
        { user: users[1]._id, role: "member", joinedAt: new Date() },
      ],
    })

    const startupWorkspace = new Workspace({
      name: "Startup Project",
      description: "Collaborative workspace for startup initiatives",
      type: "team",
      owner: demoUser._id,
      members: [
        { user: demoUser._id, role: "admin", joinedAt: new Date() },
        { user: users[2]._id, role: "member", joinedAt: new Date() },
        { user: users[3]._id, role: "member", joinedAt: new Date() },
      ],
    })

    await personalWorkspace.save()
    await acmeWorkspace.save()
    await startupWorkspace.save()

    console.log("✅ Demo workspaces created")

    // Create demo projects
    console.log("📁 Creating demo projects...")

    const projects = [
      {
        name: "Website Redesign",
        description: "Redesign the company website with new branding and improved UX",
        workspace: acmeWorkspace._id,
        owner: demoUser._id,
        members: [demoUser._id, users[0]._id, users[1]._id],
        status: "active",
        progress: 65,
        tags: ["design", "frontend", "branding"],
      },
      {
        name: "Mobile App Development",
        description: "Develop a cross-platform mobile application",
        workspace: startupWorkspace._id,
        owner: demoUser._id,
        members: [demoUser._id, users[2]._id, users[3]._id],
        status: "active",
        progress: 30,
        tags: ["mobile", "react-native", "development"],
      },
      {
        name: "Personal Blog",
        description: "Create a personal blog to share thoughts and experiences",
        workspace: personalWorkspace._id,
        owner: demoUser._id,
        members: [demoUser._id],
        status: "planning",
        progress: 10,
        tags: ["personal", "writing", "blog"],
      },
    ]

    const createdProjects = []
    for (const projectData of projects) {
      const project = new Project(projectData)
      await project.save()
      createdProjects.push(project)
    }

    console.log("✅ Demo projects created")

    // Create demo tasks
    console.log("📋 Creating demo tasks...")

    const tasks = [
      // Website Redesign Project Tasks
      {
        title: "Research competitor websites",
        description: "Analyze top 5 competitors in the market and document their design patterns",
        status: "completed",
        priority: "medium",
        workspace: acmeWorkspace._id,
        project: createdProjects[0]._id,
        createdBy: demoUser._id,
        assignee: users[0]._id,
        tags: ["research", "analysis"],
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        title: "Create wireframes for homepage",
        description: "Design initial wireframes for the new homepage layout",
        status: "in-progress",
        priority: "high",
        workspace: acmeWorkspace._id,
        project: createdProjects[0]._id,
        createdBy: demoUser._id,
        assignee: users[1]._id,
        tags: ["design", "wireframes", "homepage"],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        title: "Implement responsive navigation",
        description: "Code the responsive navigation component with mobile menu",
        status: "todo",
        priority: "high",
        workspace: acmeWorkspace._id,
        project: createdProjects[0]._id,
        createdBy: demoUser._id,
        assignee: demoUser._id,
        tags: ["development", "responsive", "navigation"],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },

      // Mobile App Development Tasks
      {
        title: "Set up React Native project",
        description: "Initialize the React Native project with necessary dependencies",
        status: "completed",
        priority: "high",
        workspace: startupWorkspace._id,
        project: createdProjects[1]._id,
        createdBy: demoUser._id,
        assignee: users[2]._id,
        tags: ["setup", "react-native", "initialization"],
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        title: "Design app authentication flow",
        description: "Create user authentication screens and flow",
        status: "in-progress",
        priority: "medium",
        workspace: startupWorkspace._id,
        project: createdProjects[1]._id,
        createdBy: demoUser._id,
        assignee: users[3]._id,
        tags: ["authentication", "design", "user-flow"],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },

      // Personal Blog Tasks
      {
        title: "Choose blogging platform",
        description: "Research and select the best platform for the personal blog",
        status: "todo",
        priority: "low",
        workspace: personalWorkspace._id,
        project: createdProjects[2]._id,
        createdBy: demoUser._id,
        assignee: demoUser._id,
        tags: ["research", "platform", "decision"],
      },
      {
        title: "Write first blog post",
        description: "Draft and publish the inaugural blog post",
        status: "todo",
        priority: "medium",
        workspace: personalWorkspace._id,
        project: createdProjects[2]._id,
        createdBy: demoUser._id,
        assignee: demoUser._id,
        tags: ["writing", "content", "first-post"],
      },
    ]

    for (const taskData of tasks) {
      const task = new Task(taskData)
      await task.save()
    }

    console.log("✅ Demo tasks created")

    // Create demo documents
    console.log("📄 Creating demo documents...")

    const documents = [
      {
        title: "Project Requirements Document",
        content:
          "# Website Redesign Requirements\n\n## Overview\nThis document outlines the requirements for the website redesign project...\n\n## Goals\n- Improve user experience\n- Modernize design\n- Increase conversion rates",
        type: "document",
        workspace: acmeWorkspace._id,
        project: createdProjects[0]._id,
        owner: demoUser._id,
        collaborators: [
          { user: users[0]._id, permission: "write" },
          { user: users[1]._id, permission: "read" },
        ],
        tags: ["requirements", "planning"],
        lastEditedBy: demoUser._id,
      },
      {
        title: "Meeting Notes - Sprint Planning",
        content:
          "# Sprint Planning Meeting\n\n**Date:** Today\n**Attendees:** Team members\n\n## Agenda\n1. Review previous sprint\n2. Plan upcoming tasks\n3. Assign responsibilities",
        type: "note",
        workspace: startupWorkspace._id,
        project: createdProjects[1]._id,
        owner: demoUser._id,
        collaborators: [
          { user: users[2]._id, permission: "write" },
          { user: users[3]._id, permission: "write" },
        ],
        tags: ["meeting", "sprint", "planning"],
        lastEditedBy: demoUser._id,
      },
      {
        title: "Blog Post Ideas",
        content:
          "# Blog Post Ideas\n\n## Tech Topics\n- Getting started with React\n- Best practices for Node.js\n- Database design patterns\n\n## Personal Topics\n- Work-life balance\n- Remote work tips\n- Learning new technologies",
        type: "note",
        workspace: personalWorkspace._id,
        project: createdProjects[2]._id,
        owner: demoUser._id,
        tags: ["ideas", "content", "planning"],
        lastEditedBy: demoUser._id,
      },
    ]

    for (const docData of documents) {
      const document = new Document(docData)
      await document.save()
    }

    console.log("✅ Demo documents created")

    console.log("\n🎉 Database setup completed successfully!")
    console.log("\n📋 Demo Account Details:")
    console.log("Email: demo@planit.app")
    console.log("Password: demo1234")
    console.log("\n🏢 Workspaces Created:")
    console.log("- Personal Workspace")
    console.log("- Acme Inc")
    console.log("- Startup Project")
    console.log("\n📁 Projects Created:")
    console.log("- Website Redesign (Acme Inc)")
    console.log("- Mobile App Development (Startup Project)")
    console.log("- Personal Blog (Personal Workspace)")
    console.log("\n📋 Tasks Created: 7 tasks across all projects")
    console.log("📄 Documents Created: 3 documents with collaboration")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from MongoDB")
  }
}

setupDatabase()

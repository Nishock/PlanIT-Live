import mongoose, { type Document, Schema } from "mongoose"

export interface IWorkspace extends Document {
  name: string
  description?: string
  type: "personal" | "team" | "organization"
  owner: mongoose.Types.ObjectId
  members: Array<{
    user: mongoose.Types.ObjectId
    role: "admin" | "manager" | "member" | "guest"
    joinedAt: Date
  }>
  settings: {
    isPublic: boolean
    allowInvites: boolean
    defaultTaskStatus: string
  }
  events: Array<{
    id?: string
    title: string
    description?: string
    date?: string
    time?: string
    type?: "meeting" | "deadline" | "milestone" | "other"
    location?: string
    attendees?: string[]
    createdAt?: Date
  }>
  createdAt: Date
  updatedAt: Date
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: ["personal", "team", "organization"],
      default: "personal",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "manager", "member", "guest"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      isPublic: { type: Boolean, default: false },
      allowInvites: { type: Boolean, default: true },
      defaultTaskStatus: { type: String, default: "todo" },
    },
    events: [
      {
        id: { type: String },
        title: { type: String, required: true },
        description: { type: String },
        date: { type: String },
        time: { type: String },
        type: { type: String, enum: ["meeting", "deadline", "milestone", "other"], default: "meeting" },
        location: { type: String },
        attendees: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Indexes
WorkspaceSchema.index({ owner: 1 })
WorkspaceSchema.index({ "members.user": 1 })

export default mongoose.models.Workspace || mongoose.model<IWorkspace>("Workspace", WorkspaceSchema)

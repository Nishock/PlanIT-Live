import mongoose, { Schema, Document, models, model } from "mongoose"

export interface IProject extends Document {
  name: string
  description?: string
  workspace: mongoose.Types.ObjectId
  owner: mongoose.Types.ObjectId
  members: mongoose.Types.ObjectId[]
  status: "planning" | "active" | "on-hold" | "completed" | "archived"
  progress: number
  startDate?: Date
  endDate?: Date
  budget?: number
  tags: string[]
  settings: {
    isPublic: boolean
    allowComments: boolean
  }
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "archived"],
      default: "planning",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    startDate: Date,
    endDate: Date,
    budget: {
      type: Number,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    settings: {
      isPublic: { type: Boolean, default: false },
      allowComments: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
)

ProjectSchema.index({ workspace: 1 })
ProjectSchema.index({ owner: 1 })
ProjectSchema.index({ members: 1 })

// ✅ Proper global registration
const Project = models.Project || model<IProject>("Project", ProjectSchema)
export default Project

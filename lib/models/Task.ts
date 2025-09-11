import mongoose, { type Document, Schema } from "mongoose"

export interface ITask extends Document {
  title: string
  description?: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  type: "epic" | "story" | "task" | "subtask"
  assignee?: mongoose.Types.ObjectId
  assignedTo?: mongoose.Types.ObjectId // For admin assignment
  createdBy: mongoose.Types.ObjectId
  workspace: mongoose.Types.ObjectId
  project?: mongoose.Types.ObjectId
  parent?: mongoose.Types.ObjectId
  dueDate?: Date
  estimatedHours?: number
  storyPoints?: number
  tags: string[]
  attachments: mongoose.Types.ObjectId[]
  comments: Array<{
    user: mongoose.Types.ObjectId
    content: string
    createdAt: Date
  }>
  sprint?: string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    type: {
      type: String,
      enum: ["epic", "story", "task", "subtask"],
      default: "task",
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    dueDate: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },
    storyPoints: {
      type: Number,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: [1000, "Comment cannot exceed 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    sprint: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
TaskSchema.index({ workspace: 1, status: 1 })
TaskSchema.index({ assignee: 1 })
TaskSchema.index({ assignedTo: 1 })
TaskSchema.index({ createdBy: 1 })
TaskSchema.index({ project: 1 })
TaskSchema.index({ dueDate: 1 })

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema)

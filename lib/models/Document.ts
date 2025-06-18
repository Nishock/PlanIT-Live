import mongoose, { type Document, Schema } from "mongoose"

export interface IDocument extends Document {
  title: string
  content: string
  type: "document" | "note" | "template"
  workspace: mongoose.Types.ObjectId
  project?: mongoose.Types.ObjectId
  owner: mongoose.Types.ObjectId
  collaborators: Array<{
    user: mongoose.Types.ObjectId
    permission: "read" | "write" | "admin"
  }>
  tags: string[]
  isPublic: boolean
  isStarred: boolean
  version: number
  lastEditedBy: mongoose.Types.ObjectId
  lastEditedAt: Date
  createdAt: Date
  updatedAt: Date
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["document", "note", "template"],
      default: "document",
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        permission: {
          type: String,
          enum: ["read", "write", "admin"],
          default: "read",
        },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 1,
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
DocumentSchema.index({ workspace: 1 })
DocumentSchema.index({ owner: 1 })
DocumentSchema.index({ project: 1 })
DocumentSchema.index({ "collaborators.user": 1 })
DocumentSchema.index({ tags: 1 })
DocumentSchema.index({ type: 1 })
DocumentSchema.index({ isStarred: 1 })

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema)

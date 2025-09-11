import mongoose from "mongoose"

export interface IAdminAccessRequest extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  name: string
  email: string
  company: string
  roleRequested: "admin" | "manager"
  status: "pending" | "approved" | "rejected"
  reason?: string
  approvedBy?: mongoose.Types.ObjectId
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const adminAccessRequestSchema = new mongoose.Schema<IAdminAccessRequest>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    roleRequested: {
      type: String,
      enum: ["admin", "manager"],
      required: true,
      default: "admin",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
adminAccessRequestSchema.index({ status: 1 })
adminAccessRequestSchema.index({ userId: 1 })
adminAccessRequestSchema.index({ email: 1 })
adminAccessRequestSchema.index({ createdAt: -1 })
adminAccessRequestSchema.index({ roleRequested: 1 })

const AdminAccessRequest = mongoose.models.AdminAccessRequest || mongoose.model<IAdminAccessRequest>("AdminAccessRequest", adminAccessRequestSchema)

export default AdminAccessRequest

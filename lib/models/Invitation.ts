import mongoose, { Schema, Document } from "mongoose"

export interface IInvitation extends Document {
  email: string
  invitedBy: mongoose.Types.ObjectId // User
  workspace: mongoose.Types.ObjectId
  role: "admin" | "member" | "guest"
  token: string
  status: "pending" | "accepted" | "expired"
  createdAt: Date
  expiresAt: Date
}

const InvitationSchema = new Schema<IInvitation>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workspace: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member", "guest"],
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "expired"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
})

InvitationSchema.index({ email: 1, workspace: 1 }, { unique: true })
InvitationSchema.index({ token: 1 }, { unique: true })

export default mongoose.models.Invitation || mongoose.model<IInvitation>("Invitation", InvitationSchema) 
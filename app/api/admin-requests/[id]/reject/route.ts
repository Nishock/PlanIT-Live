import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/middleware/auth"
import connectDB from "@/lib/database"
import AdminAccessRequest from "@/lib/models/AdminAccessRequest"
import { sendEmail } from "@/lib/email-service"

async function handler(request: NextRequest, user: any, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await connectDB()

    // Find the admin access request
    const adminRequest = await AdminAccessRequest.findById(id)
    if (!adminRequest) {
      return NextResponse.json(
        { error: "Admin request not found" },
        { status: 404 }
      )
    }

    if (adminRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Request has already been processed" },
        { status: 400 }
      )
    }

    // Update the admin request status
    adminRequest.status = "rejected"
    adminRequest.approvedBy = user.userId
    adminRequest.approvedAt = new Date()
    await adminRequest.save()

    // Send rejection email
    try {
      await sendEmail({
        to: adminRequest.email,
        subject: "Admin Access Request Rejected",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Admin Access Request Rejected</h2>
            <p>Dear ${adminRequest.name},</p>
            <p>Your access request for <strong>${adminRequest.company}</strong> as <strong>${(adminRequest as any).roleRequested || 'admin'}</strong> has been rejected.</p>
            <p>If you believe this was an error or have additional information to provide, please contact our support team.</p>
            <br>
            <p>Best regards,<br>The PlanIT Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: "Admin request rejected successfully",
      request: {
        id: adminRequest._id,
        status: adminRequest.status,
        approvedAt: adminRequest.approvedAt,
      },
    })
  } catch (error) {
    console.error("Error rejecting admin request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Only super-admin can reject requests
export const PATCH = requireRole(["super-admin"])(handler)

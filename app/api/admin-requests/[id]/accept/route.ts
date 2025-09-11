import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/middleware/auth"
import connectDB from "@/lib/database"
import AdminAccessRequest from "@/lib/models/AdminAccessRequest"
import User from "@/lib/models/User"
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
    adminRequest.status = "approved"
    adminRequest.approvedBy = user.userId
    adminRequest.approvedAt = new Date()
    await adminRequest.save()

    // Update the user's role to requested role (admin or manager)
    const userToUpdate = await User.findById(adminRequest.userId)
    if (userToUpdate) {
      const requestedRole = (adminRequest as any).roleRequested === 'manager' ? 'manager' : 'admin'
      userToUpdate.role = requestedRole as any
      userToUpdate.company = adminRequest.company
      await userToUpdate.save()
    }

    // Send approval email
    try {
      await sendEmail({
        to: adminRequest.email,
        subject: "Admin Access Approved",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Admin Access Approved</h2>
            <p>Dear ${adminRequest.name},</p>
            <p>Your access request has been approved for <strong>${adminRequest.company}</strong> as <strong>${(adminRequest as any).roleRequested || 'admin'}</strong>.</p>
            <p>You can now log in to the enterprise portal with your existing credentials.</p>
            <p>If you have any questions, please contact our support team.</p>
            <br>
            <p>Best regards,<br>The PlanIT Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: "Admin request approved successfully",
      request: {
        id: adminRequest._id,
        status: adminRequest.status,
        approvedAt: adminRequest.approvedAt,
      },
    })
  } catch (error) {
    console.error("Error approving admin request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Only super-admin can approve requests
export const PATCH = requireRole(["super-admin"])(handler)

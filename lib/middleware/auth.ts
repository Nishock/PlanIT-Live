import type { NextRequest } from "next/server"
import { verifyToken, getTokenFromRequest, type JWTPayload } from "../jwt"
import connectDB from "../database"
import User, { type IUser } from "../models/User"

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload & { _id: string }
}

export async function authenticate(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = getTokenFromRequest(request)

    if (!token) {
      console.log("Auth middleware - No token found for:", request.url)
      return null
    }

    const payload = verifyToken(token) as JWTPayload
    
    // Ensure userId is present for downstream usage
    const userId = payload.id || payload.userId
    if (!userId) {
      console.log("Auth middleware - No userId in payload")
      return null
    }

    // Verify user still exists
    await connectDB()
    const user = await User.findById(userId)

    if (!user || !user.isActive) {
      console.log("Auth middleware - User not found or inactive:", userId)
      return null
    }

    return { ...payload, _id: user._id.toString(), userId: user._id.toString() }
  } catch (error) {
    console.error("Auth middleware - Authentication error:", error)
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: JWTPayload) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await authenticate(request)

    if (!user) {
      console.log("Auth middleware - Unauthorized request to:", request.url)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return handler(request, user)
  }
}

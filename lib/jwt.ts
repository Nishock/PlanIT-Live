import jwt from "jsonwebtoken"
import type { IUser } from "./models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d"

export function generateToken(user: IUser): string {
  try {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
      issuer: "planit-app",
      audience: "planit-users",
    })
  } catch (error) {
    console.error("Token generation error:", error)
    throw new Error("Failed to generate authentication token")
  }
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "planit-app",
      audience: "planit-users",
    })
  } catch (error) {
    console.error("Token verification error:", error)
    throw new Error("Invalid or expired token")
  }
}

export function decodeToken(token: string): any {
  try {
    return jwt.decode(token)
  } catch (error) {
    console.error("Token decode error:", error)
    return null
  }
}

export type JWTPayload = {
  id: string;
  email: string;
  role: string;
  userId?: string; // for compatibility with existing code
};

export function getTokenFromRequest(request: any): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers?.get?.("authorization") || request.headers?.authorization;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return token;
  }
  
  // Try to get token from cookies (NextRequest)
  if (request.cookies?.get) {
    const token = request.cookies.get("token")?.value || request.cookies.get("token");
    if (token) return token;
  } else if (request.cookies && typeof request.cookies === "object") {
    // Node.js style cookies object
    const token = request.cookies["token"];
    if (token) return token;
  }
  
  return null;
}

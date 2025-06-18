"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, type User } from "./api-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Check if token exists in localStorage before making API call
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          setUser(null)
          setLoading(false)
          return
        }
      }

      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password)
    setUser(user)
  }

  const register = async (name: string, email: string, password: string) => {
    const user = await authService.register(name, email, password)
    setUser(user)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

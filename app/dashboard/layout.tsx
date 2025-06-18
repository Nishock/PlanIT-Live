"use client"

import type React from "react"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Mobile sidebar overlay */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity md:hidden",
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex flex-col md:pl-64">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

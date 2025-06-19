"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  BarChart3,
  Bot,
  User,
  Settings,
  Users,
  FileText,
  PenTool,
  X,
  Building,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  isActive?: boolean
}

interface DashboardSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function DashboardSidebar({ isOpen = true, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: <FolderKanban className="h-5 w-5" />,
      isActive: pathname === "/dashboard/tasks",
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: <FileText className="h-5 w-5" />,
      isActive: pathname === "/dashboard/documents",
    },
    {
      title: "Whiteboard",
      href: "/dashboard/whiteboard",
      icon: <PenTool className="h-5 w-5" />,
      isActive: pathname === "/dashboard/whiteboard",
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: <FolderKanban className="h-5 w-5" />,
      isActive: pathname === "/dashboard/projects",
    },
    {
      title: "Teams",
      href: "/dashboard/team",
      icon: <Users className="h-5 w-5" />,
      isActive: pathname === "/dashboard/team",
    },
    {
      title: "Workspace",
      href: "/dashboard/workspace",
      icon: <Building className="h-5 w-5" />,
      isActive: pathname === "/dashboard/workspace",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      isActive: pathname === "/dashboard/analytics",
    },
    {
      title: "AI Assistant",
      href: "/dashboard/ai-assistant",
      icon: <Bot className="h-5 w-5" />,
      isActive: pathname === "/dashboard/ai-assistant",
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
      isActive: pathname === "/dashboard/profile",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: pathname === "/dashboard/settings",
    },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-background border-r">
          <div className="flex items-center h-16 px-4 border-b shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <div className="relative w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-lg overflow-hidden">
                <div className="absolute inset-0.5 bg-background rounded-md flex items-center justify-center">
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-cyan-400">
                    P
                  </span>
                </div>
              </div>
              <span className="text-xl">PLANIT</span>
            </Link>
          </div>

          <ScrollArea className="flex-1 py-4">
            <div className="px-3 space-y-6">
              {/* Navigation */}
              <div>
                <h2 className="mb-3 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                  Navigation
                </h2>
                <nav className="space-y-2">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 cursor-magnetic",
                        item.href === "/dashboard"
                          ? pathname === "/dashboard"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          : pathname === item.href || pathname.startsWith(item.href + "/")
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </ScrollArea>

          {/* User Profile */}
          <div className="flex items-center gap-3 border-t p-4 mt-auto">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback className="text-xs">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{user?.name || "Demo User"}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email || "demo@planit.app"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile/Tablet Sidebar (full screen on phone, left panel on tab) */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ maxWidth: '100vw', width: '100%', height: '100vh' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <div className="relative w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-lg overflow-hidden">
                <div className="absolute inset-0.5 bg-background rounded-md flex items-center justify-center">
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-cyan-400">
                    P
                  </span>
                </div>
              </div>
              <span className="text-xl">PLANIT</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 py-4">
            <div className="px-3 space-y-6">
              {/* Navigation */}
              <div>
                <h2 className="mb-3 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                  Navigation
                </h2>
                <nav className="space-y-2">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 cursor-magnetic",
                        item.href === "/dashboard"
                          ? pathname === "/dashboard"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          : pathname === item.href || pathname.startsWith(item.href + "/")
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </ScrollArea>

          {/* User Profile */}
          <div className="flex items-center gap-3 border-t p-4 mt-auto">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback className="text-xs">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{user?.name || "Demo User"}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email || "demo@planit.app"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

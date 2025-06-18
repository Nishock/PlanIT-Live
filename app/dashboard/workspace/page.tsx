"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import {
  Users,
  Plus,
  Search,
  Settings,
  Calendar,
  MoreHorizontal,
  UserPlus,
  Clock,
  CalendarDays,
  MapPin,
  AlertCircle,
  Building,
  Target,
  Sparkles,
  ArrowRight,
  Zap,
  Loader2,
  Star,
  Edit,
  Trash2,
  Archive,
} from "lucide-react"

interface Workspace {
  id: string
  name: string
  description: string
  color: string
  icon: string
  members: Member[]
  projects: Project[]
  events: Event[]
  createdAt: string
  updatedAt: string
  isStarred: boolean
  settings: {
    isPublic: boolean
    allowInvites: boolean
    defaultRole: string
  }
}

interface Member {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "member" | "guest"
  joinedAt: string
  isActive: boolean
}

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "on-hold" | "completed" | "archived"
  progress: number
  dueDate?: string
  priority: "low" | "medium" | "high"
  membersCount: number
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "meeting" | "deadline" | "milestone" | "other"
  attendees: string[]
  location?: string
}

export default function WorkspacePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog states
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false)

  // Edit/settings dialog states
  const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false)

  // Loading states
  const [isCreating, setIsCreating] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form data
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    description: "",
    color: "blue",
    icon: "building",
    isPublic: false,
  })

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    priority: "medium",
    dueDate: "",
  })

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "meeting",
    location: "",
  })

  const [inviteData, setInviteData] = useState({
    email: "",
    role: "member",
    message: "",
  })

  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null)
  const [editWorkspaceData, setEditWorkspaceData] = useState({ name: '', description: '', color: 'blue', icon: 'building', isPublic: false })

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/workspaces", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) throw new Error("Failed to fetch workspaces")
      const data = await response.json()
      setWorkspaces(data)
      if (data.length > 0 && !activeWorkspace) {
        setActiveWorkspace(data[0].id)
      } else if (data.length === 0) {
        setActiveWorkspace(null)
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error)
      // Don't show error toast for empty state - it's expected
      setWorkspaces([])
    } finally {
      setIsLoading(false)
    }
  }, [activeWorkspace])

  const handleCreateWorkspace = async () => {
    if (!newWorkspace.name.trim()) {
      toast({
        title: "Workspace name required",
        description: "Please enter a workspace name",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newWorkspace,
          createdBy: user?.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to create workspace")

      const workspace = await response.json()
      setWorkspaces(prev => [workspace, ...prev])
      setActiveWorkspace(workspace.id)
      setNewWorkspace({ name: "", description: "", color: "blue", icon: "building", isPublic: false })
      setIsCreateWorkspaceOpen(false)

      toast({
        title: "🎉 Workspace created!",
        description: "Your new workspace is ready for collaboration",
      })
    } catch (error) {
      console.error("Error creating workspace:", error)
      toast({
        title: "Error",
        description: "Failed to create workspace",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Add fetchProjects and fetchEvents helpers
  const fetchProjects = async (workspaceId: string) => {
    const token = localStorage.getItem("auth_token")
    const response = await fetch(`/api/workspaces/${workspaceId}/projects`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) return []
    return await response.json()
  }
  const fetchEvents = async (workspaceId: string) => {
    const token = localStorage.getItem("auth_token")
    const response = await fetch(`/api/workspaces/${workspaceId}/events`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) return []
    return await response.json()
  }
  const fetchWorkspace = async (workspaceId: string) => {
    const token = localStorage.getItem("auth_token")
    const response = await fetch(`/api/workspaces/${workspaceId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) return null
    return await response.json()
  }

  const handleCreateProject = async () => {
    if (!newProject.name.trim() || !activeWorkspace) return

    try {
      setIsCreating(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/workspaces/${activeWorkspace}/projects`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newProject),
      })

      if (!response.ok) throw new Error("Failed to create project")

      toast({
        title: "✅ Project created",
        description: "Project has been added to the workspace",
      })

      setNewProject({ name: "", description: "", priority: "medium", dueDate: "" })
      setIsCreateProjectOpen(false)
      // Fetch updated projects and update state
      const updatedProjects = await fetchProjects(activeWorkspace)
      setWorkspaces(prev => prev.map(w => w.id === activeWorkspace ? { ...w, projects: updatedProjects } : w))
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date || !activeWorkspace) return

    try {
      setIsCreating(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/workspaces/${activeWorkspace}/events`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newEvent),
      })

      if (!response.ok) throw new Error("Failed to create event")

      toast({
        title: "📅 Event created",
        description: "Event has been added to the workspace calendar",
      })

      setNewEvent({ title: "", description: "", date: "", time: "", type: "meeting", location: "" })
      setIsCreateEventOpen(false)
      // Fetch updated workspace and update state
      const updatedWorkspace = await fetchWorkspace(activeWorkspace)
      if (updatedWorkspace) {
        setWorkspaces(prev => prev.map(w => w.id === activeWorkspace ? updatedWorkspace : w))
      }
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteData.email.trim() || !activeWorkspace) return

    try {
      setIsInviting(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/workspaces/${activeWorkspace}/members`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(inviteData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to invite member")
      }

      toast({
        title: "📧 Invitation sent",
        description: `Invitation sent to ${inviteData.email}`,
      })

      setInviteData({ email: "", role: "member", message: "" })
      setIsInviteMemberOpen(false)
      fetchWorkspaces()
    } catch (error: any) {
      console.error("Error inviting member:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleStarWorkspace = async (workspaceId: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/workspaces/${workspaceId}/star`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error("Failed to update workspace")

      setWorkspaces(prev => prev.map((w) => (w.id === workspaceId ? { ...w, isStarred: !w.isStarred } : w)))

      toast({
        title: "⭐ Workspace updated",
        description: "Workspace starred status updated",
      })
    } catch (error) {
      console.error("Error starring workspace:", error)
      toast({
        title: "Error",
        description: "Failed to update workspace",
        variant: "destructive",
      })
    }
  }

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error("Failed to delete workspace")

      setWorkspaces(prev => {
        const updatedWorkspaces = prev.filter((w) => w.id !== workspaceId)
        if (activeWorkspace === workspaceId) {
          setActiveWorkspace(updatedWorkspaces.length > 0 ? updatedWorkspaces[0].id : null)
        }
        return updatedWorkspaces
      })

      toast({
        title: "🗑️ Workspace deleted",
        description: "Workspace has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting workspace:", error)
      toast({
        title: "Error",
        description: "Failed to delete workspace",
        variant: "destructive",
      })
    }
  }

  const handleEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace)
    setEditWorkspaceData({
      name: workspace.name,
      description: workspace.description,
      color: workspace.color || 'blue',
      icon: workspace.icon || 'building',
      isPublic: workspace.settings?.isPublic ?? false,
    })
    setIsEditWorkspaceOpen(true)
  }

  const handleUpdateWorkspace = async () => {
    if (!editingWorkspace) return
    try {
      setIsUpdating(true)
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/workspaces/${editingWorkspace.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editWorkspaceData),
      })
      if (!response.ok) throw new Error('Failed to update workspace')
      const updated = await response.json()
      setWorkspaces(prev => prev.map(w => w.id === updated.id ? { ...w, ...updated } : w))
      setIsEditWorkspaceOpen(false)
      toast({ title: 'Workspace updated', description: 'Workspace details updated successfully.' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update workspace', variant: 'destructive' })
    } finally {
      setIsUpdating(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const configs = {
      owner: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" },
      admin: { color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
      member: { color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
      guest: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" },
    }

    const config = configs[role as keyof typeof configs]

    return (
      <Badge variant="outline" className={config?.color}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const configs = {
      planning: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
      active: { color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
      "on-hold": { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
      completed: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
      archived: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" },
    }

    const config = configs[status as keyof typeof configs]

    return (
      <Badge variant="outline" className={config?.color}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    )
  }

  const getEventTypeBadge = (type: string) => {
    const configs = {
      meeting: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
      deadline: { color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
      milestone: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" },
      other: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" },
    }

    const config = configs[type as keyof typeof configs]

    return (
      <Badge variant="outline" className={config?.color}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  // Empty State Component
  const EmptyState = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl">
            <Building className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-800" />
          </div>
        </div>

        {/* Hero Text */}
        <h1 className="text-3xl font-bold text-foreground mb-4 bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
          Welcome to Workspaces
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Create dedicated spaces for your teams to collaborate, manage projects, and achieve goals together.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-300">Team Collaboration</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">Invite members and work together</p>
          </div>
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900 dark:text-green-300">Project Management</h3>
            <p className="text-sm text-green-700 dark:text-green-400">Organize and track projects</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-300">Event Planning</h3>
            <p className="text-sm text-purple-700 dark:text-purple-400">Schedule meetings and deadlines</p>
          </div>
        </div>

        {/* CTA Button */}
        <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="mr-3 h-6 w-6" />
              Create Your First Workspace
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Create Your Workspace
              </DialogTitle>
              <DialogDescription>
                Set up a dedicated space for your team to collaborate and manage projects together.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="workspace-name">Workspace Name *</Label>
                <Input
                  id="workspace-name"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  placeholder="e.g., Marketing Team, Project Alpha"
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workspace-description">Description</Label>
                <Textarea
                  id="workspace-description"
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                  placeholder="What's this workspace for?"
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="workspace-color">Color Theme</Label>
                  <Select
                    value={newWorkspace.color}
                    onValueChange={(value) => setNewWorkspace({ ...newWorkspace, color: value })}
                  >
                    <SelectTrigger id="workspace-color" className="h-11">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">🔵 Blue</SelectItem>
                      <SelectItem value="purple">🟣 Purple</SelectItem>
                      <SelectItem value="green">🟢 Green</SelectItem>
                      <SelectItem value="orange">🟠 Orange</SelectItem>
                      <SelectItem value="red">🔴 Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="workspace-icon">Icon</Label>
                  <Select
                    value={newWorkspace.icon}
                    onValueChange={(value) => setNewWorkspace({ ...newWorkspace, icon: value })}
                  >
                    <SelectTrigger id="workspace-icon" className="h-11">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="building">🏢 Building</SelectItem>
                      <SelectItem value="users">👥 Users</SelectItem>
                      <SelectItem value="target">🎯 Target</SelectItem>
                      <SelectItem value="folder">📁 Folder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)} className="h-11">
                Cancel
              </Button>
              <Button
                onClick={handleCreateWorkspace}
                disabled={!newWorkspace.name || isCreating}
                className="h-11 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Workspace
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Additional Help Text */}
        <p className="text-sm text-muted-foreground mt-6">
          ✨ Pro tip: You can create multiple workspaces for different teams or projects
        </p>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Loading workspaces...</p>
        </div>
      </div>
    )
  }

  if (workspaces.length === 0) {
    return <EmptyState />
  }

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspace)
  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getWorkspaceStats = () => {
    if (!currentWorkspace) return { totalProjects: 0, activeProjects: 0, totalMembers: 0, upcomingEvents: 0 }

    return {
      totalProjects: currentWorkspace.projects?.length || 0,
      activeProjects: currentWorkspace.projects?.filter((p) => p.status === "active").length || 0,
      totalMembers: currentWorkspace.members?.length || 0,
      upcomingEvents: currentWorkspace.events?.filter((e) => new Date(e.date) > new Date()).length || 0,
    }
  }

  const stats = getWorkspaceStats()

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
              Your Workspaces
            </h1>
            <p className="text-muted-foreground mt-1">Manage your team workspaces and collaborate on projects</p>
          </div>
          <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="h-9 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>Create a new workspace for your team to collaborate.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="workspace-name">Workspace Name *</Label>
                  <Input
                    id="workspace-name"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                    placeholder="Enter workspace name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="workspace-description">Description</Label>
                  <Textarea
                    id="workspace-description"
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                    placeholder="Enter workspace description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWorkspace} disabled={!newWorkspace.name || isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Workspace
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Workspace Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Workspaces ({workspaces.length})</span>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-8"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-24rem)]">
                <div className="p-2 space-y-2">
                  {filteredWorkspaces.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No workspaces match your search</p>
                    </div>
                  ) : (
                    filteredWorkspaces.map((workspace) => (
                      <div
                        key={workspace.id}
                        className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                          activeWorkspace === workspace.id ? "bg-accent shadow-sm ring-2 ring-purple-200" : ""
                        }`}
                        onClick={() => setActiveWorkspace(workspace.id)}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-white bg-gradient-to-br from-purple-600 to-cyan-400 shadow-sm`}
                        >
                          <Building className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{workspace.name}</p>
                            {workspace.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {workspace.members?.length || 0} members • {workspace.projects?.length || 0} projects
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleStarWorkspace(workspace.id)}>
                              <Star
                                className={`h-4 w-4 mr-2 ${workspace.isStarred ? "text-yellow-500 fill-current" : ""}`}
                              />
                              {workspace.isStarred ? "Unstar" : "Star"} Workspace
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditWorkspace(workspace)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Workspace
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditWorkspace(workspace)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteWorkspace(workspace.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button variant="outline" className="w-full" onClick={() => setIsCreateWorkspaceOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Workspace
              </Button>
            </CardFooter>
          </Card>

          {/* Enhanced Workspace Content */}
          <div className="lg:col-span-3">
            {currentWorkspace ? (
              <div className="space-y-6">
                <Card className="border-2 hover:border-primary/20 transition-colors bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-950/20 dark:to-cyan-950/20">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg text-white bg-gradient-to-br from-purple-600 to-cyan-400 shadow-lg">
                          <Building className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            {currentWorkspace.name}
                            {currentWorkspace.isStarred && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                          </CardTitle>
                          <CardDescription>{currentWorkspace.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Workspace
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsInviteMemberOpen(true)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite Members
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Workspace Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStarWorkspace(currentWorkspace.id)}>
                          <Star
                            className={`h-4 w-4 mr-2 ${currentWorkspace.isStarred ? "text-yellow-500 fill-current" : ""}`}
                          />
                          {currentWorkspace.isStarred ? "Unstar" : "Star"} Workspace
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive Workspace
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="members">Members ({currentWorkspace.members?.length || 0})</TabsTrigger>
                        <TabsTrigger value="projects">Projects ({currentWorkspace.projects?.length || 0})</TabsTrigger>
                        <TabsTrigger value="events">Events ({currentWorkspace.events?.length || 0})</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardContent>
                </Card>

                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Members Overview */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base">Team Members</CardTitle>
                        <Button onClick={() => setIsInviteMemberOpen(true)} variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentWorkspace.members?.slice(0, 5).map((member) => (
                            <div key={member.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getRoleBadge(member.role)}
                                <div
                                  className={`w-2 h-2 rounded-full ${member.isActive ? "bg-green-500" : "bg-gray-400"}`}
                                />
                              </div>
                            </div>
                          )) || []}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("members")}>
                          View All Members
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Projects Overview */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base">Recent Projects</CardTitle>
                        <Button onClick={() => setIsCreateProjectOpen(true)} variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          New Project
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentWorkspace.projects?.slice(0, 3).map((project) => (
                            <div key={project.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{project.name}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                                </div>
                                {getStatusBadge(project.status)}
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span className="font-medium">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                              </div>
                            </div>
                          )) || []}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("projects")}>
                          View All Projects
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Events Overview */}
                    <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base">Upcoming Events</CardTitle>
                        <Button onClick={() => setIsCreateEventOpen(true)} variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Event
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentWorkspace.events
                            ?.filter((event) => new Date(event.date) > new Date())
                            .slice(0, 4)
                            .map((event) => (
                              <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                                  {event.type === "meeting" ? (
                                    <Users className="h-5 w-5 text-blue-500" />
                                  ) : event.type === "deadline" ? (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  ) : (
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium">{event.title}</p>
                                    {getEventTypeBadge(event.type)}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <CalendarDays className="h-3 w-3" />
                                      <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    {event.time && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{event.time}</span>
                                      </div>
                                    )}
                                    {event.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )) || []}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("events")}>
                          View All Events
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}

                {activeTab === "members" && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Workspace Members</CardTitle>
                        <CardDescription>Manage members and their permissions in this workspace</CardDescription>
                      </div>
                      <Button onClick={() => setIsInviteMemberOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative overflow-x-auto rounded-md border">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted">
                              <tr>
                                <th scope="col" className="px-6 py-3">
                                  Member
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Role
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Joined
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentWorkspace.members?.map((member) => (
                                <tr key={member.id} className="bg-card border-b">
                                  <td className="px-6 py-4 flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                      <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <span className="font-medium">{member.name}</span>
                                      <p className="text-xs text-muted-foreground">{member.email}</p>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">{getRoleBadge(member.role)}</td>
                                  <td className="px-6 py-4">
                                    <Badge variant={member.isActive ? "default" : "secondary"}>
                                      {member.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4">{new Date(member.joinedAt).toLocaleDateString()}</td>
                                  <td className="px-6 py-4">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit Role
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Settings className="h-4 w-4 mr-2" />
                                          Permissions
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Remove
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </td>
                                </tr>
                              )) || []}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "projects" && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Workspace Projects</CardTitle>
                        <CardDescription>Manage all projects in this workspace</CardDescription>
                      </div>
                      <Button onClick={() => setIsCreateProjectOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentWorkspace.projects?.map((project) => (
                          <Card key={project.id} className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{project.name}</CardTitle>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Users className="h-4 w-4 mr-2" />
                                      Manage Team
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  {getStatusBadge(project.status)}
                                  <Badge
                                    variant="outline"
                                    className={
                                      project.priority === "high"
                                        ? "border-red-200 text-red-800"
                                        : project.priority === "medium"
                                          ? "border-yellow-200 text-yellow-800"
                                          : "border-green-200 text-green-800"
                                    }
                                  >
                                    {project.priority}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span className="font-medium">{project.progress}%</span>
                                  </div>
                                  <Progress value={project.progress} className="h-2" />
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{project.membersCount} members</span>
                                  </div>
                                  {project.dueDate && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )) || []}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "events" && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Workspace Events</CardTitle>
                        <CardDescription>Manage events and meetings for this workspace</CardDescription>
                      </div>
                      <Button onClick={() => setIsCreateEventOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentWorkspace.events?.map((event) => (
                          <Card key={event.id} className="border shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                                  {event.type === "meeting" ? (
                                    <Users className="h-5 w-5 text-blue-500" />
                                  ) : event.type === "deadline" ? (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  ) : (
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{event.title}</h4>
                                    <div className="flex items-center gap-2">
                                      {getEventTypeBadge(event.type)}
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <Users className="h-4 w-4 mr-2" />
                                            Manage Attendees
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <CalendarDays className="h-4 w-4" />
                                      <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    {event.time && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{event.time}</span>
                                      </div>
                                    )}
                                    {event.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      <span>{event.attendees?.length || 0} attendees</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )) || []}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Edit Workspace Dialog */}
        <Dialog open={isEditWorkspaceOpen} onOpenChange={setIsEditWorkspaceOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Workspace</DialogTitle>
              <DialogDescription>Update workspace details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-workspace-name">Workspace Name *</Label>
                <Input
                  id="edit-workspace-name"
                  value={editWorkspaceData.name}
                  onChange={e => setEditWorkspaceData({ ...editWorkspaceData, name: e.target.value })}
                  placeholder="Enter workspace name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-workspace-description">Description</Label>
                <Textarea
                  id="edit-workspace-description"
                  value={editWorkspaceData.description}
                  onChange={e => setEditWorkspaceData({ ...editWorkspaceData, description: e.target.value })}
                  placeholder="Enter workspace description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-workspace-color">Color Theme</Label>
                  <Select
                    value={editWorkspaceData.color}
                    onValueChange={value => setEditWorkspaceData({ ...editWorkspaceData, color: value })}
                  >
                    <SelectTrigger id="edit-workspace-color">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">🔵 Blue</SelectItem>
                      <SelectItem value="purple">🟣 Purple</SelectItem>
                      <SelectItem value="green">🟢 Green</SelectItem>
                      <SelectItem value="orange">🟠 Orange</SelectItem>
                      <SelectItem value="red">🔴 Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-workspace-icon">Icon</Label>
                  <Select
                    value={editWorkspaceData.icon}
                    onValueChange={value => setEditWorkspaceData({ ...editWorkspaceData, icon: value })}
                  >
                    <SelectTrigger id="edit-workspace-icon">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="building">🏢 Building</SelectItem>
                      <SelectItem value="users">👥 Users</SelectItem>
                      <SelectItem value="target">🎯 Target</SelectItem>
                      <SelectItem value="folder">📁 Folder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditWorkspaceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateWorkspace} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Workspace
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Project Dialog */}
        <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to {currentWorkspace?.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-priority">Priority</Label>
                  <Select
                    value={newProject.priority}
                    onValueChange={(value) => setNewProject({ ...newProject, priority: value })}
                  >
                    <SelectTrigger id="project-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-due-date">Due Date</Label>
                  <Input
                    id="project-due-date"
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={!newProject.name || isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Event Dialog */}
        <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Add a new event to the workspace calendar.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="event-title">Event Title *</Label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-date">Date *</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-time">Time</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-type">Type</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                  >
                    <SelectTrigger id="event-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Enter location or meeting link"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateEvent}
                disabled={!newEvent.title || !newEvent.date || isCreating}
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite Member Dialog */}
        <Dialog open={isInviteMemberOpen} onOpenChange={setIsInviteMemberOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Invite Member</DialogTitle>
              <DialogDescription>Send an invitation to join this workspace.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-email">Email Address *</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={inviteData.role}
                  onValueChange={(value) => setInviteData({ ...inviteData, role: value })}
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-message">Personal Message (Optional)</Label>
                <Textarea
                  id="invite-message"
                  value={inviteData.message}
                  onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                  placeholder="Add a personal message..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteMemberOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember} disabled={!inviteData.email || isInviting}>
                {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

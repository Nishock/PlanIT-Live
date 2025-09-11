"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { projectsService, tasksService, type Project, type Task } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  MoreHorizontal,
  Calendar,
  Users,
  CheckCircle2,
  Loader2,
  FolderKanban,
  Edit,
  Trash2,
  Archive,
  Copy,
  ExternalLink,
  Settings,
  UserPlus,
  ListTodo,
  Clock,
  TrendingUp,
  Pause,
  Play,
  X,
} from "lucide-react"

// Team Management Dialog
function TeamManagementDialog({ project, onUpdate }: { project: Project; onUpdate: () => void }) {
  const [open, setOpen] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [isAddingMember, setIsAddingMember] = useState(false)
  const { toast } = useToast()

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return

    try {
      setIsAddingMember(true)
      // In a real implementation, you would call the API
      await projectsService.addProjectMember(project.id, newMemberEmail)
      toast({
        title: "Member Added",
        description: `Invitation sent to ${newMemberEmail}`,
      })
      setNewMemberEmail("")
      onUpdate()
    } catch (error) {
      toast({
        title: "Failed to add member",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      await projectsService.removeProjectMember(project.id, memberId)
      toast({
        title: "Member Removed",
        description: "Team member has been removed from the project.",
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Failed to remove member",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Team ({project.members?.length || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Team - {project.name}</DialogTitle>
          <DialogDescription>Add or remove team members from this project.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Current Team Members</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="w-48"
              />
              <Button size="sm" onClick={handleAddMember} disabled={!newMemberEmail.trim() || isAddingMember}>
                {isAddingMember ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {project.members && project.members.length > 0 ? (
              project.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No team members yet</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Tasks Management Dialog
function TasksManagementDialog({ project, onUpdate }: { project: Project; onUpdate: () => void }) {
  const [open, setOpen] = useState(false)
  const [projectTasks, setProjectTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchProjectTasks = async () => {
    try {
      setIsLoading(true)
      const tasks = await tasksService.getTasks({ project: project.id })
      setProjectTasks(tasks)
    } catch (error) {
      console.error("Error fetching project tasks:", error)
      setProjectTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = () => {
    setOpen(true)
    fetchProjectTasks()
  }

  const handleViewTasks = () => {
    toast({
      title: "Opening Tasks",
      description: `Navigating to tasks for ${project.name}...`,
    })
    // In a real app, you would navigate to the tasks page
    window.location.href = `/dashboard/tasks?project=${project.id}`
  }

  const handleCreateTask = () => {
    toast({
      title: "Opening Task Creator",
      description: "Redirecting to create a new task...",
    })
    // In a real app, you would open the task creation dialog
    window.location.href = `/dashboard/tasks?create=true&project=${project.id}`
  }

  const completedTasks = projectTasks.filter((task) => task.status === "done").length
  const totalTasks = projectTasks.length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleOpenDialog}>
          <ListTodo className="h-4 w-4" />
          Tasks ({completedTasks}/{totalTasks})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Project Tasks - {project.name}</DialogTitle>
          <DialogDescription>Manage tasks and track progress for this project.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg text-center ">
              <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
            <Progress value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} className="h-2" />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {projectTasks.length > 0 ? (
                projectTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {task.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    {task.assignee && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No tasks found for this project</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleViewTasks} className="flex-1 gap-2">
              <ExternalLink className="h-4 w-4" />
              View All Tasks
            </Button>
            <Button variant="outline" onClick={handleCreateTask} className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main Component
export default function EnhancedProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "date" | "progress" | "priority">("date")
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "active" as Project["status"],
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editProjectData, setEditProjectData] = useState({ name: "", description: "", status: "active" })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const data = await projectsService.getProjects()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Failed to load projects",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)

      const projectData = {
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        status: newProject.status,
        // Note: priority and dueDate might need to be added to the backend model
      }

      const createdProject = await projectsService.createProject(projectData)
      setProjects([createdProject, ...projects])
      setNewProject({ name: "", description: "", status: "active", priority: "medium", dueDate: "" })
      setIsCreateDialogOpen(false)

      toast({
        title: "Project created",
        description: "Your project has been created successfully",
      })
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Failed to create project",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectsService.deleteProject(projectId)
      setProjects(projects.filter((p) => p.id !== projectId))
      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Failed to delete project",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleArchiveProject = async (projectId: string) => {
    try {
      await projectsService.updateProject(projectId, { status: "archived" })
      setProjects(projects.map((p) => (p.id === projectId ? { ...p, status: "archived" as const } : p)))
      toast({
        title: "Project archived",
        description: "Project has been archived",
      })
    } catch (error) {
      toast({
        title: "Failed to archive project",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateProject = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      try {
        const duplicatedProject = await projectsService.createProject({
          name: `${project.name} (Copy)`,
          description: project.description,
          status: "active",
        })
        setProjects([duplicatedProject, ...projects])
        toast({
          title: "Project duplicated",
          description: "Project has been duplicated successfully",
        })
      } catch (error) {
        toast({
          title: "Failed to duplicate project",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setEditProjectData({ name: project.name, description: project.description, status: project.status })
    setEditDialogOpen(true)
  }

  const handleSaveEditProject = async () => {
    if (!editingProject) return
    setIsEditing(true)
    try {
      // Ensure status is of correct type
      const updated = await projectsService.updateProject(
        editingProject.id,
        {
          ...editProjectData,
          status: editProjectData.status as Project["status"],
        }
      )
      setProjects(projects.map((p) => (p.id === editingProject.id ? updated : p)))
      setEditDialogOpen(false)
      toast({ title: "Project updated", description: "Project details updated successfully" })
    } catch (error) {
      toast({ title: "Failed to update project", description: "Please try again.", variant: "destructive" })
    } finally {
      setIsEditing(false)
    }
  }

  const handleOpenSettings = (project: Project) => {
    setEditingProject(project)
    setSettingsDialogOpen(true)
  }

  const filteredAndSortedProjects = projects
    .filter((project) => {
      // Search filter
      if (
        searchQuery &&
        !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Status filter
      if (activeTab !== "all" && project.status !== activeTab) {
        return false
      }

      // Priority filter (if available in project data)
      // if (filterPriority !== "all" && project.priority !== filterPriority) {
      //   return false
      // }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "progress":
          return b.progress - a.progress
        // case "priority":
        //   const priorityOrder = { high: 3, medium: 2, low: 1 }
        //   return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

  const getStatusBadge = (status: string) => {
    const configs = {
      planning: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", icon: Clock },
      active: { color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", icon: Play },
      "on-hold": { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400", icon: Pause },
      completed: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", icon: CheckCircle2 },
      archived: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", icon: Archive },
    }

    const config = configs[status as keyof typeof configs]
    const Icon = config?.icon || Clock

    return (
      <Badge variant="outline" className={config?.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    )
  }

  const getProjectStats = () => {
    const total = projects.length
    const active = projects.filter((p) => p.status === "active").length
    const completed = projects.filter((p) => p.status === "completed").length
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / total || 0

    return { total, active, completed, avgProgress }
  }

  const stats = getProjectStats()

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">Manage and organize your projects with enhanced features</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="h-11 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your workspace. Fill in the details below.</DialogDescription>
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
              <div className="grid gap-2">
                <Label htmlFor="project-status">Status</Label>
                <Select
                  value={newProject.status}
                  onValueChange={(value) => setNewProject({ ...newProject, status: value as Project["status"] })}
                >
                  <SelectTrigger id="project-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={!newProject.name || isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FolderKanban className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{Math.round(stats.avgProgress)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects by name or description..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-[400px]">
          <TabsList
            className="w-full min-w-[600px] grid grid-cols-6 h-12 md:grid-cols-6 md:w-full md:min-w-0 md:overflow-visible
              sm:flex sm:gap-2 sm:grid-cols-none sm:min-w-[500px] sm:w-max sm:overflow-x-auto sm:whitespace-nowrap"
          >
            <TabsTrigger value="all" className="gap-2 flex-shrink-0">
              All ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="planning" className="gap-2 flex-shrink-0">
              <Clock className="h-4 w-4" />
              Planning ({projects.filter((p) => p.status === "planning").length})
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2 flex-shrink-0">
              <Play className="h-4 w-4" />
              Active ({projects.filter((p) => p.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="on-hold" className="gap-2 flex-shrink-0">
              <Pause className="h-4 w-4" />
              On Hold ({projects.filter((p) => p.status === "on-hold").length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2 flex-shrink-0">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({projects.filter((p) => p.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-2 flex-shrink-0">
              <Archive className="h-4 w-4" />
              Archived ({projects.filter((p) => p.status === "archived").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-project-name">Project Name *</Label>
              <Input
                id="edit-project-name"
                value={editProjectData.name}
                onChange={(e) => setEditProjectData({ ...editProjectData, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-project-description">Description</Label>
              <Textarea
                id="edit-project-description"
                value={editProjectData.description}
                onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-project-status">Status</Label>
              <Select
                value={editProjectData.status}
                onValueChange={(value) => setEditProjectData({ ...editProjectData, status: value })}
              >
                <SelectTrigger id="edit-project-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditProject} disabled={!editProjectData.name || isEditing}>
              {isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Settings Dialog (placeholder) */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Project Settings</DialogTitle>
            <DialogDescription>Settings for this project (coming soon).</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      ) : filteredAndSortedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FolderKanban className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No projects matching "${searchQuery}"`
              : activeTab !== "all"
                ? `No ${activeTab.replace("-", " ")} projects found`
                : "Create your first project to get started"}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 relative overflow-hidden"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    <div className="flex items-center gap-2">{getStatusBadge(project.status)}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleDuplicateProject(project.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditProject(project)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenSettings(project)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span className="font-bold text-primary">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <div className="flex justify-between items-center w-full">
                  {/* Team Avatars */}
                  <div className="flex items-center">
                    {project.members && project.members.length > 0 ? (
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, i) => (
                          <Avatar key={i} className="border-2 border-background h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {project.members.length > 3 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background text-xs font-medium">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        No members
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <TeamManagementDialog project={project} onUpdate={fetchProjects} />
                    <TasksManagementDialog project={project} onUpdate={fetchProjects} />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Loader2,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  PlayCircle,
  Eye,
  MoreHorizontal,
  Trash2,
  Grid3X3,
  List,
  Edit,
  CalendarDays,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { tasksService, type Task, workspacesService } from "@/lib/api-service"

const statusConfig = {
  todo: { label: "To Do", icon: Circle, color: "text-gray-500", bg: "bg-gray-100" },
  "in-progress": { label: "In Progress", icon: PlayCircle, color: "text-blue-500", bg: "bg-blue-100" },
  review: { label: "Review", icon: Eye, color: "text-yellow-500", bg: "bg-yellow-100" },
  done: { label: "Done", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100" },
}

const priorityConfig = {
  low: { label: "Low", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  medium: { label: "Medium", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  high: { label: "High", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  urgent: { label: "Urgent", color: "text-red-800", bg: "bg-red-100", border: "border-red-300" },
}

// Task Detail Modal Component
function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onUpdate,
}: {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Partial<Task>>({})
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? (typeof task.dueDate === "string" ? task.dueDate : new Date(task.dueDate).toISOString()) : undefined,
        assignee: typeof task.assignee === "object" && task.assignee !== null ? task.assignee : undefined,
      })
    }
  }, [task])

  useEffect(() => {
    // Fetch workspace members for assignee dropdown
    async function fetchMembers() {
      if (task?.workspace) {
        try {
          const res = await fetch(`/api/workspaces/${task.workspace}/members`)
          const data = await res.json()
          setMembers(data)
        } catch (e) {
          setMembers([])
        }
      }
    }
    fetchMembers()
  }, [task])

  if (!task) return null

  const StatusIcon = statusConfig[task.status].icon
  const priorityInfo = priorityConfig[task.priority]

  const handleSave = async () => {
    if (!task) return
    console.log("DEBUG: task.id", task.id)
    if (!task?.id) {
      toast({ title: "Error", description: "Task ID not found", variant: "destructive" })
      return
    }
    try {
      setLoading(true)
      await tasksService.updateTask(task.id, editedTask)
      toast({
        title: "Task updated",
        description: "Task has been updated successfully",
      })
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update task",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: Task["status"]) => {
    console.log("DEBUG: task.id", task.id)
    if (!task?.id) {
      toast({ title: "Error", description: "Task ID not found", variant: "destructive" })
      return
    }
    try {
      await tasksService.updateTask(task.id, { status: newStatus })
      toast({
        title: "Task updated",
        description: `Task moved to ${statusConfig[newStatus].label}`,
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    console.log("DEBUG: Deleting task with ID:", task?.id)
    if (!task?.id) {
      toast({ title: "Invalid task", description: "Task ID is missing" })
      return
    }
    try {
      await tasksService.deleteTask(task.id)
      toast({
        title: "Task deleted",
        description: "Task has been removed successfully",
      })
      onClose()
      onUpdate()
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedTask.title || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-lg font-semibold"
                  placeholder="Task title"
                />
              ) : (
                <DialogTitle className="text-xl">{task.title}</DialogTitle>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange("todo")}>
                    <Circle className="h-4 w-4 mr-2" />
                    Move to To Do
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Move to In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("review")}>
                    <Eye className="h-4 w-4 mr-2" />
                    Move to Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("done")}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority Badges */}
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`${statusConfig[task.status].bg} ${statusConfig[task.status].color} border-0`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[task.status].label}
            </Badge>
            <Badge variant="outline" className={`${priorityInfo.bg} ${priorityInfo.color} ${priorityInfo.border}`}>
              {priorityInfo.label}
            </Badge>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            {isEditing ? (
              <Textarea
                value={editedTask.description || ""}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                placeholder="Task description"
                rows={4}
              />
            ) : (
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                {task.description || "No description provided"}
              </div>
            )}
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignee
              </Label>
              {isEditing ? (
                <Select
                  value={editedTask.assignee ? editedTask.assignee.id : ""}
                  onValueChange={(value) => {
                    const selectedUser = members.find((member) => member.id === value);
                    setEditedTask({ ...editedTask, assignee: selectedUser || undefined });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} ({member.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{task.assignee.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span>{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </div>
              )}
            </div>

            {/* Created By */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Created By
              </Label>
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">{task.createdBy.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span>{task.createdBy.name}</span>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Due Date
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, dueDate: e.target.value ? e.target.value : undefined })
                  }
                />
              ) : (
                <div className="text-sm">
                  {task.dueDate ? (
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </div>
              )}
            </div>

            {/* Created Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created
              </Label>
              <div className="text-sm">{new Date(task.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Status and Priority Editors (when editing) */}
          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={editedTask.status}
                  onValueChange={(value) => setEditedTask({ ...editedTask, status: value as Task["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Priority</Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) => setEditedTask({ ...editedTask, priority: value as Task["priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Action Buttons (when editing) */}
          {isEditing && (
            <div className="flex items-center gap-2 pt-4">
              <Button onClick={handleSave} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditedTask({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate
                      ? typeof task.dueDate === "string"
                        ? task.dueDate
                        : new Date(task.dueDate).toISOString()
                      : undefined,
                    assignee:
                      typeof task.assignee === "object" && task.assignee !== null
                        ? task.assignee
                        : undefined,
                  })
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Task Card Component
function TaskCard({
  task,
  onUpdate,
  onViewDetails,
}: {
  task: Task
  onUpdate: () => void
  onViewDetails: (task: Task) => void
}) {
  // Debug log for received task
  console.log("TaskCard received:", task)
  const StatusIcon = statusConfig[task.status].icon
  const { toast } = useToast()

  const handleStatusChange = async (newStatus: Task["status"]) => {
    console.log("DEBUG: task.id", task.id)
    if (!task?.id) {
      toast({ title: "Error", description: "Task ID not found", variant: "destructive" })
      return
    }
    try {
      await tasksService.updateTask(task.id, { status: newStatus })
      toast({
        title: "Task updated",
        description: `Task moved to ${statusConfig[newStatus].label}`,
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    console.log("DEBUG: Deleting task with ID:", task.id)
    if (!task?.id) {
      toast({ title: "Invalid task", description: "Task ID is missing" })
      return
    }
    try {
      await tasksService.deleteTask(task.id)
      toast({
        title: "Task deleted",
        description: "Task has been removed successfully",
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500 cursor-pointer">
      <CardHeader className="pb-3" onClick={() => onViewDetails(task)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {task.title}
            </CardTitle>
            {task.description && (
              <CardDescription className="text-xs mt-1 line-clamp-2">{task.description}</CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(task)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("todo")}>
                <Circle className="h-4 w-4 mr-2" />
                Move to To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Move to In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("review")}>
                <Eye className="h-4 w-4 mr-2" />
                Move to Review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("done")}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0" onClick={() => onViewDetails(task)}>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${statusConfig[task.status].bg} ${statusConfig[task.status].color} border-0`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[task.status].label}
            </Badge>
            <Badge
              variant="outline"
              className={`${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].color} ${priorityConfig[task.priority].border}`}
            >
              {priorityConfig[task.priority].label}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{task.assignee?.name || task.createdBy.name}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Kanban Board Component
function KanbanBoard({
  tasks,
  onTaskUpdate,
  onViewDetails,
}: {
  tasks: Task[]
  onTaskUpdate: () => void
  onViewDetails: (task: Task) => void
}) {
  const columns = [
    { id: "todo", title: "To Do", tasks: tasks.filter((t) => t.status === "todo") },
    { id: "in-progress", title: "In Progress", tasks: tasks.filter((t) => t.status === "in-progress") },
    { id: "review", title: "Review", tasks: tasks.filter((t) => t.status === "review") },
    { id: "done", title: "Done", tasks: tasks.filter((t) => t.status === "done") },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {column.tasks.length}
            </Badge>
          </div>
          <div className="space-y-3 min-h-[200px]">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} onViewDetails={onViewDetails} />
            ))}
            {column.tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">No tasks</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Task List Component
function TaskList({
  tasks,
  onTaskUpdate,
  onViewDetails,
}: {
  tasks: Task[]
  onTaskUpdate: () => void
  onViewDetails: (task: Task) => void
}) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} onViewDetails={onViewDetails} />
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No tasks found</p>
          <p className="text-sm">Try adjusting your filters or create a new task</p>
        </div>
      )}
    </div>
  )
}

// Main Tasks Page Component
export default function TasksPage() {
  const [viewType, setViewType] = useState("board")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const fetchedTasks = await tasksService.getTasks()
      setTasks(fetchedTasks)
    } catch (error) {
      toast({
        title: "Failed to load tasks",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = () => {
    loadTasks() // Refresh tasks after creation
  }

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setShowTaskDetail(true)
  }

  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false)
    setSelectedTask(null)
  }

  // Enhanced filtering logic
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee?.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || task.status === statusFilter

    // Priority filter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Get active filters count
  const activeFiltersCount = [statusFilter !== "all", priorityFilter !== "all", searchQuery.length > 0].filter(
    Boolean,
  ).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your tasks across workspaces</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <CreateTaskDialog workspaceId="default" onTaskCreated={handleTaskCreated} />
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card
        className={`transition-all duration-300 ${showFilters ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"}`}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filters & Search</CardTitle>
          <CardDescription>Filter and search through your tasks to find exactly what you need</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks, descriptions, or assignees..."
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Toggle & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tabs value={viewType} onValueChange={setViewType} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="board" className="gap-2">
                <Grid3X3 className="h-4 w-4" />
                Board
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{filteredTasks.length} tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>{filteredTasks.filter((t) => t.status === "done").length} completed</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span>
              {filteredTasks.filter((t) => t.priority === "high" || t.priority === "urgent").length} high priority
            </span>
          </div>
        </div>
      </div>

      {/* Tasks Display */}
      <div className="min-h-[400px]">
        {viewType === "board" ? (
          <KanbanBoard tasks={filteredTasks} onTaskUpdate={loadTasks} onViewDetails={handleViewDetails} />
        ) : (
          <TaskList tasks={filteredTasks} onTaskUpdate={loadTasks} onViewDetails={handleViewDetails} />
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={showTaskDetail}
        onClose={handleCloseTaskDetail}
        onUpdate={loadTasks}
      />
    </div>
  )
}

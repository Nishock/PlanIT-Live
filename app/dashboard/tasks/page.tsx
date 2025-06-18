"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { tasksService, type Task } from "@/lib/api-service"

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

// Task Card Component
function TaskCard({ task, onUpdate }: { task: Task; onUpdate: () => void }) {
  const StatusIcon = statusConfig[task.status].icon
  const { toast } = useToast()

  const handleStatusChange = async (newStatus: Task["status"]) => {
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
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
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
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
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
      </CardHeader>
      <CardContent className="pt-0">
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
function KanbanBoard({ tasks, onTaskUpdate }: { tasks: Task[]; onTaskUpdate: () => void }) {
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
              <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} />
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
function TaskList({ tasks, onTaskUpdate }: { tasks: Task[]; onTaskUpdate: () => void }) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} />
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
          <KanbanBoard tasks={filteredTasks} onTaskUpdate={loadTasks} />
        ) : (
          <TaskList tasks={filteredTasks} onTaskUpdate={loadTasks} />
        )}
      </div>
    </div>
  )
}

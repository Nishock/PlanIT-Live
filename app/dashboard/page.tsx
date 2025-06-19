"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { CreateDocumentDialog } from "@/components/documents/create-document-dialog"
import { KanbanBoard } from "@/components/tasks/kanban-board"
import { TaskList } from "@/components/tasks/task-list"
import { DocumentGrid } from "@/components/documents/document-grid"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import {
  FileText,
  Plus,
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDashed,
  TrendingUp,
  Users,
  FolderKanban,
  Calendar,
  Star,
  ArrowUpRight,
  Activity,
  Target,
  Zap,
  BookOpen,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { tasksService, documentsService, workspacesService, projectsService } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [tasks, setTasks] = useState([])
  const [documents, setDocuments] = useState([])
  const [projects, setProjects] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [taskViewType, setTaskViewType] = useState("board")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [tasksData, documentsData, workspacesData, projectsData] = await Promise.all([
        tasksService.getTasks(),
        documentsService.getDocuments(),
        workspacesService.getWorkspaces(),
        projectsService.getProjects(),
      ])

      setTasks(tasksData)
      setDocuments(documentsData)
      setWorkspaces(workspacesData)
      setProjects(projectsData)
    } catch (error) {
      toast({
        title: "Failed to load dashboard data",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = () => {
    loadDashboardData()
  }

  const handleDocumentCreated = () => {
    loadDashboardData()
  }

  const handleTaskUpdate = () => {
    loadDashboardData()
  }

  const currentWorkspace = workspaces.find((w) => w.type === "personal") || workspaces[0]

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter documents based on search
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate statistics
  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "done").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length
    const pending = tasks.filter((t) => t.status === "todo").length
    const overdue = tasks.filter((t) => {
      if (!t.dueDate) return false
      return new Date(t.dueDate) < new Date() && t.status !== "done"
    }).length

    return { total, completed, inProgress, pending, overdue }
  }

  const getProjectStats = () => {
    const total = projects.length
    const active = projects.filter((p) => p.status === "active").length
    const completed = projects.filter((p) => p.status === "completed").length
    const avgProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total || 0

    return { total, active, completed, avgProgress }
  }

  const getRecentActivity = () => {
    const recentTasks = tasks
      .filter((t) => new Date(t.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)

    const recentDocs = documents
      .filter((d) => new Date(d.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)

    return { recentTasks, recentDocs }
  }

  const taskStats = getTaskStats()
  const projectStats = getProjectStats()
  const { recentTasks, recentDocs } = getRecentActivity()

  const getStatusBadge = (status) => {
    const configs = {
      todo: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", icon: CircleDashed },
      "in-progress": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", icon: Clock },
      review: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", icon: AlertCircle },
      done: { color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", icon: CheckCircle2 },
    }

    const config = configs[status] || configs.todo
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    )
  }

  const getPriorityBadge = (priority) => {
    const configs = {
      low: { color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
      medium: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
      high: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
      urgent: { color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
    }

    const config = configs[priority] || configs.medium

    return (
      <Badge variant="outline" className={config.color} size="sm">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || "User"}! Here's your workspace overview.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-3">
          {currentWorkspace && (
            <>
              <CreateDocumentDialog workspaceId={currentWorkspace.id} onDocumentCreated={handleDocumentCreated}>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  New Document
                </Button>
              </CreateDocumentDialog>
              <CreateTaskDialog workspaceId={currentWorkspace.id} onTaskCreated={handleTaskCreated}>
                <Button
                  size="sm"
                  className="justify-start gap-2 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </CreateTaskDialog>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-12">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.total}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="text-green-500 inline-flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                  {taskStats.completed} completed
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.active}</div>
                <p className="text-xs text-muted-foreground">{Math.round(projectStats.avgProgress)}% avg progress</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <BookOpen className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documents.length}</div>
                <p className="text-xs text-muted-foreground">{documents.filter((d) => d.starred).length} starred</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workspaces.reduce((total, w) => total + (w.members?.length || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">{workspaces.length} workspaces</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Task Overview */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Task Status Overview */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Task Overview
                  </CardTitle>
                  <CardDescription>Your task status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{taskStats.completed}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{taskStats.inProgress}</div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20">
                      <div className="flex items-center justify-center mb-2">
                        <CircleDashed className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{taskStats.pending}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-center justify-center mb-2">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{taskStats.overdue}</div>
                      <div className="text-sm text-muted-foreground">Overdue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Tasks */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Recent Tasks
                      </CardTitle>
                      <CardDescription>Tasks updated in the last 7 days</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("tasks")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentTasks.length > 0 ? (
                    <div className="space-y-3">
                      {recentTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{task.title}</h4>
                              {getStatusBadge(task.status)}
                              {getPriorityBadge(task.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Updated {new Date(task.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                          {task.assignee && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                              <AvatarFallback>{task.assignee.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent task activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Project Progress */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Project Progress
                  </CardTitle>
                  <CardDescription>Active projects overview</CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.filter((p) => p.status === "active").length > 0 ? (
                    <div className="space-y-4">
                      {projects
                        .filter((p) => p.status === "active")
                        .slice(0, 3)
                        .map((project) => (
                          <div key={project.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-sm">{project.name}</h4>
                              <span className="text-sm font-medium">{project.progress || 0}%</span>
                            </div>
                            <Progress value={project.progress || 0} className="h-2" />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No active projects</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Documents */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Recent Documents
                      </CardTitle>
                      <CardDescription>Recently updated documents</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("documents")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentDocs.length > 0 ? (
                    <div className="space-y-3">
                      {recentDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate">{doc.title}</h4>
                              {doc.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Updated {new Date(doc.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent documents</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {/* Task Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={taskViewType === "board" ? "default" : "outline"}
                size="sm"
                onClick={() => setTaskViewType("board")}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Board
              </Button>
              <Button
                variant={taskViewType === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setTaskViewType("list")}
              >
                <List className="mr-2 h-4 w-4" />
                List
              </Button>
            </div>
          </div>

          {/* Task Content */}
          {taskViewType === "board" ? (
            <KanbanBoard tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
          ) : (
            <TaskList tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {/* Document Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {currentWorkspace && (
              <CreateDocumentDialog workspaceId={currentWorkspace.id} onDocumentCreated={handleDocumentCreated}>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Document
                </Button>
              </CreateDocumentDialog>
            )}
          </div>

          {/* Document Grid */}
          <DocumentGrid documents={filteredDocuments} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard tasks={tasks} documents={documents} workspaces={workspaces} projects={projects} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

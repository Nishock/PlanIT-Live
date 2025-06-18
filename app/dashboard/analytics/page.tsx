"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  Download,
} from "lucide-react"
import { tasksService, documentsService, workspacesService, projectsService } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")
  const [activeTab, setActiveTab] = useState("overview")
  const [tasks, setTasks] = useState([])
  const [documents, setDocuments] = useState([])
  const [projects, setProjects] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      const [tasksData, documentsData, projectsData, workspacesData] = await Promise.all([
        tasksService.getTasks(),
        documentsService.getDocuments(),
        projectsService.getProjects(),
        workspacesService.getWorkspaces(),
      ])

      setTasks(tasksData)
      setDocuments(documentsData)
      setProjects(projectsData)
      setWorkspaces(workspacesData)
    } catch (error) {
      toast({
        title: "Failed to load analytics data",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Process real data for charts
  const getTaskCompletionData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return last7Days.map((date, index) => {
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(date).getDay()]
      const dayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.updatedAt).toISOString().split("T")[0]
        return taskDate === date
      })

      return {
        name: dayName,
        completed: dayTasks.filter((t) => t.status === "done").length,
        pending: dayTasks.filter((t) => t.status === "todo").length,
        inProgress: dayTasks.filter((t) => t.status === "in-progress").length,
        overdue: dayTasks.filter((t) => {
          return t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
        }).length,
      }
    })
  }

  const getProjectProgressData = () => {
    return projects.map((project) => ({
      name: project.name.length > 15 ? project.name.substring(0, 15) + "..." : project.name,
      progress: project.progress || 0,
      tasks: tasks.filter((t) => t.project === project.id).length,
    }))
  }

  const getTaskDistributionData = () => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    }, {})

    const colors = {
      todo: "#94a3b8",
      "in-progress": "#3b82f6",
      review: "#f59e0b",
      done: "#10b981",
    }

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace("-", " "),
      value: count,
      color: colors[status] || "#6b7280",
    }))
  }

  const getProductivityTrendData = () => {
    const last8Weeks = Array.from({ length: 8 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (7 - i) * 7)
      return date
    })

    return last8Weeks.map((date, index) => {
      const weekStart = new Date(date)
      const weekEnd = new Date(date)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const weekTasks = tasks.filter((task) => {
        const taskDate = new Date(task.updatedAt)
        return taskDate >= weekStart && taskDate <= weekEnd
      })

      const completedTasks = weekTasks.filter((t) => t.status === "done").length
      const totalTasks = weekTasks.length
      const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      return {
        date: `Week ${index + 1}`,
        productivity,
        completed: completedTasks,
        total: totalTasks,
      }
    })
  }

  const getTeamPerformanceData = () => {
    const userStats = {}

    tasks.forEach((task) => {
      if (task.assignee) {
        const userId = task.assignee.id
        if (!userStats[userId]) {
          userStats[userId] = {
            name: task.assignee.name,
            tasks: 0,
            completed: 0,
          }
        }
        userStats[userId].tasks++
        if (task.status === "done") {
          userStats[userId].completed++
        }
      }
    })

    return Object.values(userStats).map((user) => ({
      name: user.name.length > 10 ? user.name.substring(0, 10) + "..." : user.name,
      tasks: user.tasks,
      completion: user.tasks > 0 ? Math.round((user.completed / user.tasks) * 100) : 0,
    }))
  }

  const getDocumentTypeData = () => {
    const typeCounts = documents.reduce((acc, doc) => {
      const type = doc.type || "document"
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    const colors = {
      document: "#3b82f6",
      note: "#10b981",
      template: "#f59e0b",
    }

    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      color: colors[type] || "#6b7280",
    }))
  }

  const handleDownload = () => {
    const data = {
      tasks: tasks.length,
      projects: projects.length,
      documents: documents.length,
      workspaces: workspaces.length,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Analytics Downloaded",
      description: "Your analytics data has been downloaded successfully.",
    })
  }

  const taskCompletionData = getTaskCompletionData()
  const projectProgressData = getProjectProgressData()
  const taskDistributionData = getTaskDistributionData()
  const productivityTrendData = getProductivityTrendData()
  const teamPerformanceData = getTeamPerformanceData()
  const documentTypeData = getDocumentTypeData()

  const getOverallStats = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === "done").length
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length
    const overdueTasks = tasks.filter((t) => {
      return t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
    }).length

    const lastWeekTasks = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return taskDate >= weekAgo
    }).length

    const prevWeekTasks = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt)
      const twoWeeksAgo = new Date()
      const weekAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return taskDate >= twoWeeksAgo && taskDate < weekAgo
    }).length

    const taskGrowth = prevWeekTasks > 0 ? ((lastWeekTasks - prevWeekTasks) / prevWeekTasks) * 100 : 0

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      taskGrowth,
    }
  }

  const stats = getOverallStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-muted-foreground">Track your productivity and project progress with real-time data</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden md:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            <span className="hidden md:inline">Team</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "overview" && (
        <>
          {/* Real Data Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTasks}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${stats.taskGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {stats.taskGrowth >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.taskGrowth).toFixed(1)}%
                  </span>{" "}
                  from last {timeRange}
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% completion
                  rate
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-400">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {projects.filter((p) => p.status === "active").length} active projects
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overdueTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalTasks > 0 ? Math.round((stats.overdueTasks / stats.totalTasks) * 100) : 0}% of total tasks
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Real Data Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Trend</CardTitle>
              <CardDescription>Daily task completion breakdown for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskCompletionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                    <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" name="In Progress" />
                    <Bar dataKey="pending" stackId="a" fill="#6b7280" name="Pending" />
                    <Bar dataKey="overdue" stackId="a" fill="#ef4444" name="Overdue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Productivity Trend</CardTitle>
              <CardDescription>Weekly productivity score based on task completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="productivity"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Productivity Score (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Tasks by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {taskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>Distribution of document types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={documentTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {documentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "projects" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>Real-time progress of all active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={projectProgressData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="progress" fill="#06b6d4" name="Progress %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Task completion rate by team member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="tasks" fill="#8b5cf6" name="Tasks Assigned" />
                    <Bar yAxisId="right" dataKey="completion" fill="#06b6d4" name="Completion Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

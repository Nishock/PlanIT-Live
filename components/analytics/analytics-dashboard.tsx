"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
import { ArrowUpRight, CheckCircle2, FileText, Users, Download } from "lucide-react"

interface AnalyticsDashboardProps {
  tasks: any[]
  documents: any[]
  workspaces: any[]
}

export function AnalyticsDashboard({ tasks, documents, workspaces }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("week")
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length,
  }

  // Task completion data for charts
  const taskCompletionData = [
    { name: "Mon", completed: 5, pending: 3, overdue: 1 },
    { name: "Tue", completed: 7, pending: 4, overdue: 2 },
    { name: "Wed", completed: 10, pending: 2, overdue: 0 },
    { name: "Thu", completed: 8, pending: 5, overdue: 1 },
    { name: "Fri", completed: 12, pending: 3, overdue: 0 },
    { name: "Sat", completed: 4, pending: 2, overdue: 0 },
    { name: "Sun", completed: 2, pending: 1, overdue: 0 },
  ]

  // Task distribution by status
  const taskDistributionData = [
    { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#8b5cf6" },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, color: "#06b6d4" },
    { name: "Review", value: tasks.filter((t) => t.status === "review").length, color: "#ec4899" },
    { name: "Done", value: tasks.filter((t) => t.status === "done").length, color: "#10b981" },
  ]

  // Productivity trend data
  const productivityTrendData = [
    { date: "Week 1", productivity: 65 },
    { date: "Week 2", productivity: 72 },
    { date: "Week 3", productivity: 68 },
    { date: "Week 4", productivity: 75 },
    { date: "Week 5", productivity: 82 },
    { date: "Week 6", productivity: 78 },
    { date: "Week 7", productivity: 85 },
    { date: "Week 8", productivity: 90 },
  ]

  const handleDownload = () => {
    // Generate CSV data
    const csvData = [
      ["Metric", "Value"],
      ["Total Tasks", taskStats.total],
      ["Completed Tasks", taskStats.completed],
      ["In Progress Tasks", taskStats.inProgress],
      ["Overdue Tasks", taskStats.overdue],
      ["Total Documents", documents.length],
      ["Total Workspaces", workspaces.length],
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `planit-analytics-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Track your productivity and project progress</p>
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
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12%
                  </span>{" "}
                  from last {timeRange}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taskStats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    18%
                  </span>{" "}
                  from last {timeRange}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documents.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8%
                  </span>{" "}
                  from last {timeRange}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workspaces.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    2%
                  </span>{" "}
                  from last {timeRange}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Task completion over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                      <Bar dataKey="pending" stackId="a" fill="#3b82f6" name="Pending" />
                      <Bar dataKey="overdue" stackId="a" fill="#ef4444" name="Overdue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Analytics</CardTitle>
              <CardDescription>Detailed task performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityTrendData}>
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
                      name="Productivity Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Trends</CardTitle>
              <CardDescription>Your productivity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="productivity"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      name="Productivity %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

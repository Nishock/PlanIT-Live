"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, CircleDashed, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import type { Task } from "@/lib/api-service"

interface TaskListOptimizedProps {
  tasks: Task[]
  onTaskUpdate?: () => void
}

export function TaskListOptimized({ tasks, onTaskUpdate }: TaskListOptimizedProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <CircleDashed className="h-3 w-3" />
      case "in-progress":
        return <Clock className="h-3 w-3" />
      case "review":
        return <AlertCircle className="h-3 w-3" />
      case "done":
        return <CheckCircle2 className="h-3 w-3" />
      default:
        return <CircleDashed className="h-3 w-3" />
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <CircleDashed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status)}
                  <span className="ml-1">
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
              </TableCell>
              <TableCell>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                      <AvatarFallback>
                        {task.assignee.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
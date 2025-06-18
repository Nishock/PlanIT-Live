"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { tasksService, type Task } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface KanbanBoardProps {
  tasks: Task[]
  onTaskUpdate?: () => void
}

const statusColumns = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
  { id: "review", title: "Review", color: "bg-yellow-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
}

export function KanbanBoard({ tasks, onTaskUpdate }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const { toast } = useToast()

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()

    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null)
      return
    }

    try {
      await tasksService.updateTask(draggedTask.id, { status: newStatus as any })
      toast({
        title: "Task updated",
        description: `Task moved to ${statusColumns.find((col) => col.id === newStatus)?.title}`,
      })
      onTaskUpdate?.()
    } catch (error) {
      toast({
        title: "Failed to update task",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setDraggedTask(null)
    }
  }

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      await tasksService.updateTask(task.id, { status: newStatus as any })
      toast({
        title: "Task updated",
        description: `Task moved to ${statusColumns.find((col) => col.id === newStatus)?.title}`,
      })
      onTaskUpdate?.()
    } catch (error) {
      toast({
        title: "Failed to update task",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statusColumns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id)

        return (
          <div
            key={column.id}
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`rounded-lg p-4 ${column.color}`}>
              <h3 className="font-semibold text-sm uppercase tracking-wide">{column.title}</h3>
              <span className="text-sm text-muted-foreground">{columnTasks.length} tasks</span>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={() => handleDragStart(task)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium line-clamp-2">{task.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {statusColumns
                            .filter((col) => col.id !== task.status)
                            .map((col) => (
                              <DropdownMenuItem key={col.id} onClick={() => handleStatusChange(task, col.id)}>
                                Move to {col.title}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}
                          title={`${task.priority} priority`}
                        />
                        {task.tags.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {task.tags[0]}
                          </Badge>
                        )}
                      </div>

                      {task.assignee && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {task.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar, User } from "lucide-react"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Task {
  id: number
  title: string
  description: string
  status: "To Do" | "In Progress" | "Review" | "Done"
  priority: "Low" | "Medium" | "High"
  dueDate: string
  assignee?: {
    name: string
    avatar: string
    initials: string
  }
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Research competitors",
      description: "Analyze top 5 competitors in the market",
      status: "To Do",
      priority: "Medium",
      dueDate: "May 25, 2023",
      assignee: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
    },
    {
      id: 2,
      title: "Create wireframes",
      description: "Design initial wireframes for mobile app",
      status: "To Do",
      priority: "High",
      dueDate: "May 22, 2023",
      assignee: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
    },
    {
      id: 3,
      title: "Update documentation",
      description: "Update API documentation with new endpoints",
      status: "To Do",
      priority: "Low",
      dueDate: "May 30, 2023",
    },
    {
      id: 4,
      title: "Implement authentication",
      description: "Add OAuth and email authentication",
      status: "In Progress",
      priority: "High",
      dueDate: "May 20, 2023",
      assignee: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MC",
      },
    },
    {
      id: 5,
      title: "Design system updates",
      description: "Update component library with new styles",
      status: "In Progress",
      priority: "Medium",
      dueDate: "May 24, 2023",
      assignee: {
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "ER",
      },
    },
    {
      id: 6,
      title: "Code review: Payment API",
      description: "Review PR #123 for payment processing",
      status: "Review",
      priority: "High",
      dueDate: "May 19, 2023",
      assignee: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DK",
      },
    },
    {
      id: 7,
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing",
      status: "Done",
      priority: "Medium",
      dueDate: "May 15, 2023",
      assignee: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
    },
    {
      id: 8,
      title: "User interviews",
      description: "Conduct user interviews for feedback",
      status: "Done",
      priority: "High",
      dueDate: "May 12, 2023",
      assignee: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
    }
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
            <TableRow key={task.id} className="cursor-magnetic hover:bg-accent/50 transition-all duration-300">
              <TableCell>
                <Checkbox className="cursor-magnetic" />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getStatusColor(task.status)} cursor-magnetic`}>
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getPriorityColor(task.priority)} cursor-magnetic`}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 cursor-magnetic">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-magnetic">
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UpcomingTasks() {
  const tasks = [
    {
      id: 1,
      title: "Finalize design system",
      dueDate: "Today",
      priority: "High",
      assignee: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
    },
    {
      id: 2,
      title: "Review pull requests",
      dueDate: "Today",
      priority: "Medium",
      assignee: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
    },
    {
      id: 3,
      title: "Prepare sprint demo",
      dueDate: "Tomorrow",
      priority: "High",
      assignee: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MC",
      },
    },
    {
      id: 4,
      title: "Update documentation",
      dueDate: "In 2 days",
      priority: "Low",
      assignee: {
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "ER",
      },
    },
  ]

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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
        <CardDescription>Tasks due soon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Checkbox id={`task-${task.id}`} />
                <div>
                  <label htmlFor={`task-${task.id}`} className="text-sm font-medium cursor-pointer">
                    {task.title}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">Due {task.dueDate}</p>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                <AvatarFallback>{task.assignee.initials}</AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

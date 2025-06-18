import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      action: "completed a task",
      target: "Implement login page",
      time: "2 minutes ago",
    },
    {
      id: 2,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
      action: "commented on",
      target: "Dashboard redesign",
      time: "15 minutes ago",
    },
    {
      id: 3,
      user: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MC",
      },
      action: "created a new document",
      target: "API Documentation",
      time: "1 hour ago",
    },
    {
      id: 4,
      user: {
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "ER",
      },
      action: "assigned you to",
      target: "Fix navigation bug",
      time: "3 hours ago",
    },
    {
      id: 5,
      user: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DK",
      },
      action: "scheduled a meeting",
      target: "Sprint Planning",
      time: "Yesterday",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        <CardDescription>Latest updates from your team</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[280px] overflow-auto">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

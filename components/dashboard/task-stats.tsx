import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, CircleDashed } from "lucide-react"

export function TaskStats() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Task Overview</CardTitle>
        <CardDescription>Your task status at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1 bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-lg font-bold">12</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1 bg-blue-100 dark:bg-blue-900/20">
              <CircleDashed className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-lg font-bold">8</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1 bg-amber-100 dark:bg-amber-900/20">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold">5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1 bg-red-100 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-lg font-bold">3</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

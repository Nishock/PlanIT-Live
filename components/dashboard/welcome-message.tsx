"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, X } from "lucide-react"

export function WelcomeMessage() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-950/20 dark:to-cyan-950/20 border-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Welcome back, John!</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setDismissed(true)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
        <CardDescription>Here's what's happening with your projects today.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">AI Tip of the Day</p>
              <p className="text-muted-foreground">Try using the "Quick Add" feature to create tasks from any page.</p>
            </div>
          </div>
          <Button
            size="sm"
            className="ml-auto bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
          >
            Try it now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

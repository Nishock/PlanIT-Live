"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, User, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function ProfileCompletionPrompt() {
  const { user } = useAuth()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show prompt if user is logged in, profile is not completed, and not dismissed
    if (user && !user.profileCompleted && !isDismissed) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [user, isDismissed])

  useEffect(() => {
    // Check if user has dismissed this prompt before
    const dismissed = localStorage.getItem("profile-prompt-dismissed")
    if (dismissed === "true") {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem("profile-prompt-dismissed", "true")
  }

  const handleCompleteProfile = () => {
    setIsVisible(false)
    router.push("/dashboard/profile")
  }

  if (!isVisible || !user || user.profileCompleted) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-2">
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-sm">Complete Your Profile</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">Fill in your details to get the most out of PLANIT</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCompleteProfile} className="flex-1 text-xs">
              <CheckCircle className="mr-1 h-3 w-3" />
              Complete Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleDismiss} className="text-xs">
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

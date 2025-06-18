"use client"

import { Button } from "@/components/ui/button"
import { Whiteboard } from "@/components/whiteboard/whiteboard"
import { Users, Download, Share2 } from "lucide-react"

export default function WhiteboardPage() {
  // Directly open to a single whiteboard
  const whiteboardId = "main-whiteboard"
  const whiteboardTitle = "Collaborative Whiteboard"
  const whiteboardDescription = "Real-time collaborative drawing and brainstorming"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{whiteboardTitle}</h1>
          <p className="text-sm text-muted-foreground">{whiteboardDescription}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium"
              >
                U{i + 1}
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-140px)]">
        <Whiteboard id={whiteboardId} collaborative={true} />
      </div>
    </div>
  )
}

"use client"

import { MousePointer, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useCursorEffects } from "./cursor-effects"

export function CursorToggle() {
  const { enabled, toggleCursorEffects } = useCursorEffects()

  return (
    <div className="fixed bottom-4 right-4 z-[10001] bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MousePointer className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="cursor-effects" className="text-sm font-medium">
            Cursor Effects
          </Label>
        </div>
        <Switch
          id="cursor-effects"
          checked={enabled}
          onCheckedChange={toggleCursorEffects}
          className="cursor-magnetic"
        />
        {enabled && (
          <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
        )}
      </div>
    </div>
  )
} 
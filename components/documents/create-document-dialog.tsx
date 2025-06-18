"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { documentsService } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { Plus, Loader2 } from "lucide-react"

interface CreateDocumentDialogProps {
  workspaceId: string
  onDocumentCreated?: () => void
  children?: React.ReactNode
}

export function CreateDocumentDialog({ workspaceId, onDocumentCreated, children }: CreateDocumentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await documentsService.createDocument({
        ...formData,
        workspace: workspaceId,
      })

      toast({
        title: "Document created!",
        description: "Your new document has been added successfully.",
      })

      setFormData({
        title: "",
        content: "",
      })
      setOpen(false)
      onDocumentCreated?.()
    } catch (error) {
      toast({
        title: "Failed to create document",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>Add a new document to your workspace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter document title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter document content"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

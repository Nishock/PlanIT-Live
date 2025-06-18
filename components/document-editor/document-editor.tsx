"use client"

import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Quote,
  Code,
  Undo,
  Redo,
  Save,
} from "lucide-react"

interface DocumentEditorProps {
  initialContent?: string
  placeholder?: string
  onSave?: (content: string) => void
  readOnly?: boolean
}

export function DocumentEditor({
  initialContent = "",
  placeholder = 'Start writing or type "/" for commands...',
  onSave,
  readOnly = false,
}: DocumentEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState(initialContent)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && initialContent !== content) {
      editor.commands.setContent(initialContent)
      setContent(initialContent)
    }
  }, [initialContent, editor])

  const handleSave = async () => {
    if (!editor || !onSave) return

    setIsSaving(true)
    try {
      await onSave(editor.getHTML())
    } catch (error) {
      console.error("Error saving document:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!editor) {
    return <div className="h-full w-full flex items-center justify-center">Loading editor...</div>
  }

  return (
    <div className="flex flex-col h-full border rounded-md bg-background">
      {!readOnly && (
        <>
          <div className="flex items-center p-2 gap-1 overflow-x-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-muted" : ""}
            >
              <Bold className="h-4 w-4" />
              <span className="sr-only">Bold</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-muted" : ""}
            >
              <Italic className="h-4 w-4" />
              <span className="sr-only">Italic</span>
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
            >
              <Heading1 className="h-4 w-4" />
              <span className="sr-only">Heading 1</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
            >
              <Heading2 className="h-4 w-4" />
              <span className="sr-only">Heading 2</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
            >
              <Heading3 className="h-4 w-4" />
              <span className="sr-only">Heading 3</span>
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-muted" : ""}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Bullet List</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-muted" : ""}
            >
              <ListOrdered className="h-4 w-4" />
              <span className="sr-only">Ordered List</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={editor.isActive("taskList") ? "bg-muted" : ""}
            >
              <CheckSquare className="h-4 w-4" />
              <span className="sr-only">Task List</span>
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "bg-muted" : ""}
            >
              <Quote className="h-4 w-4" />
              <span className="sr-only">Quote</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive("codeBlock") ? "bg-muted" : ""}
            >
              <Code className="h-4 w-4" />
              <span className="sr-only">Code</span>
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
              <span className="sr-only">Undo</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
              <span className="sr-only">Redo</span>
            </Button>

            <div className="ml-auto">
              {onSave && (
                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}
      <div className="flex-1 overflow-auto p-4">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none h-full" />
      </div>
    </div>
  )
}

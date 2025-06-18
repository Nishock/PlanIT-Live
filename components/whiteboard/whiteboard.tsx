"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Pencil,
  Square,
  Circle,
  Type,
  StickyNote,
  Eraser,
  Undo,
  Redo,
  Download,
  Trash2,
  Hand,
  ZoomIn,
  ZoomOut,
  MousePointer,
  X,
} from "lucide-react"

interface WhiteboardProps {
  id: string
  collaborative?: boolean
}

type Tool = "select" | "hand" | "pen" | "rectangle" | "circle" | "text" | "note" | "eraser"
type DrawingObject = {
  id: string
  type: "path" | "rectangle" | "circle" | "text" | "note"
  points?: { x: number; y: number }[]
  x?: number
  y?: number
  width?: number
  height?: number
  color: string
  text?: string
  fontSize?: number
  fontFamily?: string
}

export function Whiteboard({ id, collaborative = false }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tool, setTool] = useState<Tool>("select")
  const [color, setColor] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState([3])
  const [isDrawing, setIsDrawing] = useState(false)
  const [objects, setObjects] = useState<DrawingObject[]>([])
  const [history, setHistory] = useState<DrawingObject[][]>([])
  const [redoStack, setRedoStack] = useState<DrawingObject[][]>([])
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Text tool states
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
  const [textColor, setTextColor] = useState("#000000")
  const [textSize, setTextSize] = useState(16)
  const [fontFamily, setFontFamily] = useState("Arial")

  // Note tool states
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [noteInput, setNoteInput] = useState("")
  const [notePosition, setNotePosition] = useState({ x: 0, y: 0 })

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resizeCanvas = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      redrawCanvas()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Redraw canvas whenever objects change
  useEffect(() => {
    redrawCanvas()
  }, [objects, scale, offset])

  // Update cursor based on tool
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    switch (tool) {
      case "select":
        canvas.style.cursor = "default"
        break
      case "hand":
        canvas.style.cursor = "grab"
        break
      case "pen":
        canvas.style.cursor = "crosshair"
        break
      case "rectangle":
        canvas.style.cursor = "crosshair"
        break
      case "circle":
        canvas.style.cursor = "crosshair"
        break
      case "text":
        canvas.style.cursor = "text"
        break
      case "note":
        canvas.style.cursor = "pointer"
        break
      case "eraser":
        // Create a custom eraser cursor with size indicator
        const eraserSize = strokeWidth[0] * 2
        const cursorSize = Math.max(20, eraserSize)
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cursorSize}" height="${cursorSize}" viewBox="0 0 ${cursorSize} ${cursorSize}">
          <circle cx="${cursorSize/2}" cy="${cursorSize/2}" r="${eraserSize/2}" fill="rgba(255,255,255,0.3)" stroke="black" stroke-width="2"/>
          <circle cx="${cursorSize/2}" cy="${cursorSize/2}" r="2" fill="black"/>
        </svg>`
        const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
        canvas.style.cursor = `url('${dataUrl}') ${cursorSize/2} ${cursorSize/2}, auto`
        break
      default:
        canvas.style.cursor = "default"
    }
  }, [tool, strokeWidth])

  // Update cursor when dragging
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (isDragging && tool === "hand") {
      canvas.style.cursor = "grabbing"
    }
  }, [isDragging, tool])

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformation
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(scale, scale)

    // Draw all objects
    objects.forEach((obj) => {
      ctx.strokeStyle = obj.color
      ctx.lineWidth = strokeWidth[0]
      ctx.fillStyle = obj.color

      if (obj.type === "path" && obj.points) {
        ctx.beginPath()
        const [first, ...rest] = obj.points
        ctx.moveTo(first.x, first.y)
        rest.forEach((point) => {
          ctx.lineTo(point.x, point.y)
        })
        ctx.stroke()
      } else if (
        obj.type === "rectangle" &&
        obj.x !== undefined &&
        obj.y !== undefined &&
        obj.width !== undefined &&
        obj.height !== undefined
      ) {
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
      } else if (obj.type === "circle" && obj.x !== undefined && obj.y !== undefined && obj.width !== undefined) {
        ctx.beginPath()
        ctx.arc(obj.x + obj.width / 2, obj.y + obj.width / 2, obj.width / 2, 0, Math.PI * 2)
        ctx.stroke()
      } else if (obj.type === "note" && obj.x !== undefined && obj.y !== undefined) {
        // Draw sticky note
        ctx.fillStyle = "#FFEB3B50" // Semi-transparent yellow
        ctx.fillRect(obj.x, obj.y, 150, 150)
        ctx.strokeRect(obj.x, obj.y, 150, 150)

        // Draw note text
        if (obj.text) {
          ctx.fillStyle = "#000000"
          ctx.font = "14px sans-serif"
          const lines = obj.text.split("\n")
          lines.forEach((line, i) => {
            ctx.fillText(line, obj.x! + 10, obj.y! + 25 + i * 20)
          })
        }
      } else if (obj.type === "text" && obj.x !== undefined && obj.y !== undefined && obj.text) {
        ctx.font = `${obj.fontSize || 16}px ${obj.fontFamily || "Arial"}`
        ctx.fillStyle = obj.color
        ctx.fillText(obj.text, obj.x, obj.y)
      }
    })

    // Draw current path if drawing
    if (isDrawing && tool === "pen" && currentPath.length > 0) {
      ctx.strokeStyle = color
      ctx.lineWidth = strokeWidth[0]
      ctx.beginPath()
      const [first, ...rest] = currentPath
      ctx.moveTo(first.x, first.y)
      rest.forEach((point) => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
    }

    ctx.restore()
  }

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - offset.x) / scale,
      y: (e.clientY - rect.top - offset.y) / scale,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e)

    if (tool === "hand") {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      return
    }

    setIsDrawing(true)

    if (tool === "pen") {
      setCurrentPath([coords])
    } else if (tool === "rectangle" || tool === "circle") {
      const newObject: DrawingObject = {
        id: Date.now().toString(),
        type: tool === "rectangle" ? "rectangle" : "circle",
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
        color,
      }
      setObjects([...objects, newObject])
    } else if (tool === "text") {
      setTextPosition(coords)
      setTextColor(color)
      setShowTextDialog(true)
    } else if (tool === "note") {
      setNotePosition(coords)
      setShowNoteDialog(true)
    } else if (tool === "eraser") {
      // Erase objects at the clicked position
      eraseObjectsAtPosition(coords)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e)
    setMousePosition(coords)

    if (isDragging && tool === "hand") {
      setOffset({
        x: offset.x + (e.clientX - dragStart.x),
        y: offset.y + (e.clientY - dragStart.y),
      })
      setDragStart({ x: e.clientX, y: e.clientY })
      return
    }

    if (!isDrawing) return

    if (tool === "pen") {
      setCurrentPath([...currentPath, coords])
    } else if (tool === "rectangle" || tool === "circle") {
      const lastObject = { ...objects[objects.length - 1] }
      if (lastObject.x !== undefined && lastObject.y !== undefined) {
        lastObject.width = coords.x - lastObject.x
        lastObject.height = coords.y - lastObject.y

        const newObjects = [...objects.slice(0, -1), lastObject]
        setObjects(newObjects)
      }
    } else if (tool === "eraser") {
      // Erase objects as the mouse moves
      eraseObjectsAtPosition(coords)
    }
  }

  // Helper function to erase objects at a specific position
  const eraseObjectsAtPosition = (coords: { x: number; y: number }) => {
    const eraserSize = strokeWidth[0] * 2 // Make eraser size proportional to stroke width
    const objectsToRemove: string[] = []

    objects.forEach((obj) => {
      if (isObjectIntersectingEraser(obj, coords, eraserSize)) {
        objectsToRemove.push(obj.id)
      }
    })

    if (objectsToRemove.length > 0) {
      const newObjects = objects.filter((obj) => !objectsToRemove.includes(obj.id))
      if (newObjects.length !== objects.length) {
        setHistory([...history, objects])
        setRedoStack([])
        setObjects(newObjects)
      }
    }
  }

  // Helper function to check if an object intersects with the eraser
  const isObjectIntersectingEraser = (
    obj: DrawingObject,
    eraserPos: { x: number; y: number },
    eraserSize: number
  ): boolean => {
    const eraserLeft = eraserPos.x - eraserSize / 2
    const eraserRight = eraserPos.x + eraserSize / 2
    const eraserTop = eraserPos.y - eraserSize / 2
    const eraserBottom = eraserPos.y + eraserSize / 2

    if (obj.type === "path" && obj.points) {
      // Check if any point in the path is within eraser range
      return obj.points.some((point) => {
        const distance = Math.sqrt(
          Math.pow(point.x - eraserPos.x, 2) + Math.pow(point.y - eraserPos.y, 2)
        )
        return distance <= eraserSize / 2
      })
    } else if (obj.type === "rectangle" && obj.x !== undefined && obj.y !== undefined && obj.width !== undefined && obj.height !== undefined) {
      // Check rectangle intersection
      const objLeft = obj.x
      const objRight = obj.x + obj.width
      const objTop = obj.y
      const objBottom = obj.y + obj.height

      return !(
        eraserRight < objLeft ||
        eraserLeft > objRight ||
        eraserBottom < objTop ||
        eraserTop > objBottom
      )
    } else if (obj.type === "circle" && obj.x !== undefined && obj.y !== undefined && obj.width !== undefined) {
      // Check circle intersection
      const circleCenterX = obj.x + obj.width / 2
      const circleCenterY = obj.y + obj.width / 2
      const circleRadius = obj.width / 2
      const distance = Math.sqrt(
        Math.pow(circleCenterX - eraserPos.x, 2) + Math.pow(circleCenterY - eraserPos.y, 2)
      )
      return distance <= circleRadius + eraserSize / 2
    } else if (obj.type === "text" && obj.x !== undefined && obj.y !== undefined) {
      // Check text intersection (approximate with a small rectangle)
      const textWidth = (obj.text?.length || 0) * (obj.fontSize || 16) * 0.6 // Approximate text width
      const textHeight = obj.fontSize || 16
      const textLeft = obj.x
      const textRight = obj.x + textWidth
      const textTop = obj.y - textHeight
      const textBottom = obj.y

      return !(
        eraserRight < textLeft ||
        eraserLeft > textRight ||
        eraserBottom < textTop ||
        eraserTop > textBottom
      )
    } else if (obj.type === "note" && obj.x !== undefined && obj.y !== undefined) {
      // Check note intersection (150x150 default size)
      const noteWidth = 150
      const noteHeight = 150
      const noteLeft = obj.x
      const noteRight = obj.x + noteWidth
      const noteTop = obj.y
      const noteBottom = obj.y + noteHeight

      return !(
        eraserRight < noteLeft ||
        eraserLeft > noteRight ||
        eraserBottom < noteTop ||
        eraserTop > noteBottom
      )
    }

    return false
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      return
    }

    if (!isDrawing) return
    setIsDrawing(false)

    if (tool === "pen" && currentPath.length > 0) {
      const newObject: DrawingObject = {
        id: Date.now().toString(),
        type: "path",
        points: currentPath,
        color,
      }
      setHistory([...history, objects])
      setRedoStack([])
      setObjects([...objects, newObject])
      setCurrentPath([])
    } else if (tool === "rectangle" || tool === "circle") {
      // Save the current state to history
      setHistory([...history, objects.slice(0, -1)])
      setRedoStack([])
    }
  }

  const handleAddText = () => {
    if (textInput.trim()) {
      const newObject: DrawingObject = {
        id: Date.now().toString(),
        type: "text",
        x: textPosition.x,
        y: textPosition.y,
        color: textColor,
        text: textInput,
        fontSize: textSize,
        fontFamily: fontFamily,
      }
      setHistory([...history, objects])
      setRedoStack([])
      setObjects([...objects, newObject])
      setTextInput("")
      setShowTextDialog(false)
    }
  }

  const handleAddNote = () => {
    if (noteInput.trim()) {
      const newObject: DrawingObject = {
        id: Date.now().toString(),
        type: "note",
        x: notePosition.x,
        y: notePosition.y,
        color,
        text: noteInput,
      }
      setHistory([...history, objects])
      setRedoStack([])
      setObjects([...objects, newObject])
      setNoteInput("")
      setShowNoteDialog(false)
    }
  }

  const handleUndo = () => {
    if (history.length === 0) return

    const previousState = history[history.length - 1]
    setRedoStack([...redoStack, objects])
    setObjects(previousState)
    setHistory(history.slice(0, -1))
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return

    const nextState = redoStack[redoStack.length - 1]
    setHistory([...history, objects])
    setObjects(nextState)
    setRedoStack(redoStack.slice(0, -1))
  }

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the whiteboard?")) {
      setHistory([...history, objects])
      setRedoStack([])
      setObjects([])
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a temporary canvas to draw the whiteboard without transformations
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    // Draw white background
    tempCtx.fillStyle = "#ffffff"
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

    // Draw all objects
    tempCtx.drawImage(canvas, 0, 0)

    // Create download link
    const link = document.createElement("a")
    link.download = `whiteboard-${id}.png`
    link.href = tempCanvas.toDataURL("image/png")
    link.click()
  }

  const handleZoomIn = () => {
    setScale(Math.min(scale * 1.2, 5))
  }

  const handleZoomOut = () => {
    setScale(Math.max(scale / 1.2, 0.2))
  }

  const handleResetZoom = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div className="flex flex-col h-full border rounded-md bg-background">
      <div className="flex items-center p-2 gap-1 overflow-x-auto border-b">
        <Tabs value={tool} onValueChange={(value) => setTool(value as Tool)}>
          <TabsList>
            <TabsTrigger value="select" title="Select">
              <MousePointer className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="hand" title="Pan">
              <Hand className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="pen" title="Pen">
              <Pencil className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="rectangle" title="Rectangle">
              <Square className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="circle" title="Circle">
              <Circle className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="text" title="Text">
              <Type className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="note" title="Sticky Note">
              <StickyNote className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="eraser" title="Eraser">
              <Eraser className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="h-6 mx-2 border-l" />

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded-md cursor-pointer border"
          title="Color"
        />

        <div className="w-32 px-2">
          <Slider value={strokeWidth} min={1} max={20} step={1} onValueChange={setStrokeWidth} />
        </div>

        <div className="h-6 mx-2 border-l" />

        <Button variant="ghost" size="icon" onClick={handleUndo} disabled={history.length === 0} title="Undo">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleRedo} disabled={redoStack.length === 0} title="Redo">
          <Redo className="h-4 w-4" />
        </Button>

        <div className="h-6 mx-2 border-l" />

        <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleResetZoom} title="Reset Zoom">
          {Math.round(scale * 100)}%
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload} title="Download">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} title="Clear">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {collaborative && (
          <div className="absolute bottom-4 right-4 bg-background border rounded-md p-2 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs">2 collaborators online</span>
            </div>
          </div>
        )}
      </div>

      {/* Text Input Dialog */}
      <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Add Text
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Text</label>
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter your text here..."
                className="mt-1"
                rows={3}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded-md border mt-1 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Size</label>
                <Slider
                  value={[textSize]}
                  min={8}
                  max={72}
                  step={1}
                  onValueChange={(value) => setTextSize(value[0])}
                  className="mt-1"
                />
                <span className="text-xs text-muted-foreground">{textSize}px</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Font</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTextDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddText} disabled={!textInput.trim()}>
              Add Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note Input Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Add Sticky Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Note Content</label>
              <Textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Enter your note content..."
                className="mt-1"
                rows={4}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={!noteInput.trim()}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


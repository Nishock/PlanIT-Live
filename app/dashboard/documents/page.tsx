"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { DocumentEditor } from "@/components/document-editor/document-editor"
import { type Document, documentsService, projectsService, type Project } from "@/lib/api-service"
import {
  Search,
  Plus,
  MoreHorizontal,
  Calendar,
  FileText,
  Star,
  Clock,
  Folder,
  Loader2,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Share,
  Eye,
  BookOpen,
  StickyNote,
  Layout,
  Filter,
  ArrowUpDown,
  Tag,
} from "lucide-react"

import { Dialog as ShareDialog, DialogContent as ShareDialogContent, DialogHeader as ShareDialogHeader, DialogTitle as ShareDialogTitle, DialogDescription as ShareDialogDescription, DialogFooter as ShareDialogFooter } from "@/components/ui/dialog"

export default function EnhancedDocumentsPage() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "date" | "updated" | "type">("updated")
  const [filterType, setFilterType] = useState<"all" | "document" | "note" | "template">("all")
  const [filterProject, setFilterProject] = useState<string>("all")
  const [newDocument, setNewDocument] = useState({
    title: "",
    content: "",
    type: "document" as Document["type"],
    project: "",
    tags: [] as string[],
    tagInput: "",
  })
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const downloadRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [docsData, projectsData] = await Promise.all([
          documentsService.getDocuments(),
          projectsService.getProjects(),
        ])
        setDocuments(docsData)
        setProjects(projectsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error loading documents",
          description: "Failed to load documents. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleCreateDocument = async () => {
    if (!newDocument.title.trim()) {
      toast({
        title: "Document title required",
        description: "Please enter a document title",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)

      const documentData = {
        title: newDocument.title.trim(),
        content: newDocument.content.trim(),
        type: newDocument.type,
        project: newDocument.project || undefined,
        tags: newDocument.tags,
        workspace: "default", // You can make this dynamic based on current workspace
      }

      const createdDoc = await documentsService.createDocument(documentData)
      setDocuments([createdDoc, ...documents])
      setNewDocument({
        title: "",
        content: "",
        type: "document",
        project: "",
        tags: [],
        tagInput: "",
      })
      setIsCreateDialogOpen(false)

      toast({
        title: "Document created",
        description: "Your document has been created successfully",
      })
    } catch (error) {
      console.error("Error creating document:", error)
      toast({
        title: "Failed to create document",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleStarDocument = async (documentId: string) => {
    try {
      const document = documents.find((d) => d.id === documentId)
      if (!document) return

      const updatedDoc = await documentsService.updateDocument(documentId, {
        starred: !document.starred,
      })

      setDocuments(documents.map((d) => (d.id === documentId ? updatedDoc : d)))
      toast({
        title: "Document updated",
        description: `Document ${updatedDoc.starred ? "starred" : "unstarred"} successfully`,
      })
    } catch (error) {
      console.error("Error updating document:", error)
      toast({
        title: "Failed to update document",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await documentsService.deleteDocument(documentId)
      setDocuments(documents.filter((d) => d.id !== documentId))
      toast({
        title: "Document deleted",
        description: "Document has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Failed to delete document",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateDocument = async (documentId: string) => {
    try {
      const document = documents.find((d) => d.id === documentId)
      if (!document) return

      const duplicatedDoc = await documentsService.createDocument({
        title: `${document.title} (Copy)`,
        content: document.content,
        type: document.type,
        project: document.project,
        tags: document.tags,
        workspace: "default",
      })

      setDocuments([duplicatedDoc, ...documents])
      toast({
        title: "Document duplicated",
        description: "Document has been duplicated successfully",
      })
    } catch (error) {
      console.error("Error duplicating document:", error)
      toast({
        title: "Failed to duplicate document",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc)
  }

  const handleSaveDocument = async (content: string) => {
    if (!selectedDocument) return

    try {
      const updatedDoc = await documentsService.updateDocument(selectedDocument.id, {
        content,
      })

      setSelectedDocument(updatedDoc)
      setDocuments((docs) => docs.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)))

      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully",
      })
    } catch (error) {
      console.error("Error saving document:", error)
      toast({
        title: "Failed to save document",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBackToList = () => {
    setSelectedDocument(null)
  }

  const handleAddTag = () => {
    if (newDocument.tagInput.trim() && !newDocument.tags.includes(newDocument.tagInput.trim())) {
      setNewDocument({
        ...newDocument,
        tags: [...newDocument.tags, newDocument.tagInput.trim()],
        tagInput: "",
      })
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewDocument({
      ...newDocument,
      tags: newDocument.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  // Export document as .txt
  const handleExportDocument = (doc: Document) => {
    const blob = new Blob([doc.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    if (downloadRef.current) {
      downloadRef.current.href = url
      downloadRef.current.download = `${doc.title}.txt`
      downloadRef.current.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }

  // Share document (mock)
  const handleShareDocument = (doc: Document) => {
    setShareLink(`${window.location.origin}/documents/${doc.id}`)
    setIsShareDialogOpen(true)
  }

  const filteredAndSortedDocuments = documents
    .filter((document) => {
      // Search filter
      if (
        searchQuery &&
        !document.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !document.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !document.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }

      // Type filter
      if (filterType !== "all" && document.type !== filterType) {
        return false
      }

      // Project filter
      if (filterProject !== "all" && document.project !== filterProject) {
        return false
      }

      // Tab filter
      if (activeTab === "starred" && !document.starred) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title)
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "type":
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })

  const getTypeBadge = (type: string) => {
    const configs = {
      document: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", icon: FileText },
      note: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", icon: StickyNote },
      template: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400", icon: Layout },
    }

    const config = configs[type as keyof typeof configs]
    const Icon = config?.icon || FileText

    return (
      <Badge variant="outline" className={config?.color}>
        <Icon className="h-3 w-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const getDocumentStats = () => {
    const total = documents.length
    const starred = documents.filter((d) => d.starred).length
    const documents_count = documents.filter((d) => d.type === "document").length
    const notes_count = documents.filter((d) => d.type === "note").length
    const templates_count = documents.filter((d) => d.type === "template").length

    return { total, starred, documents_count, notes_count, templates_count }
  }

  const stats = getDocumentStats()

  if (selectedDocument) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" size="sm" onClick={handleBackToList} className="mb-4">
              ← Back to Documents
            </Button>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
              {selectedDocument.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated {new Date(selectedDocument.updatedAt).toLocaleDateString()} by{" "}
              {selectedDocument.createdBy.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStarDocument(selectedDocument.id)}>
              <Star className={`h-4 w-4 mr-2 ${selectedDocument.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
              {selectedDocument.starred ? "Starred" : "Star"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDuplicateDocument(selectedDocument.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDeleteDocument(selectedDocument.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DocumentEditor initialContent={selectedDocument.content} onSave={handleSaveDocument} />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent">
            Documents
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage your documents, notes, and templates</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="h-11 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>Add a new document, note, or template to your workspace.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="document-title">Title *</Label>
                <Input
                  id="document-title"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  placeholder="Enter document title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document-content">Content</Label>
                <Textarea
                  id="document-content"
                  value={newDocument.content}
                  onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
                  placeholder="Enter document content"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="document-type">Type</Label>
                  <Select
                    value={newDocument.type}
                    onValueChange={(value) => setNewDocument({ ...newDocument, type: value as Document["type"] })}
                  >
                    <SelectTrigger id="document-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="document-project">Project (Optional)</Label>
                  <Select
                    value={newDocument.project}
                    onValueChange={(value) => setNewDocument({ ...newDocument, project: value })}
                  >
                    <SelectTrigger id="document-project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document-tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="document-tags"
                    value={newDocument.tagInput}
                    onChange={(e) => setNewDocument({ ...newDocument, tagInput: e.target.value })}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {newDocument.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newDocument.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDocument} disabled={!newDocument.title || isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starred</p>
                <p className="text-2xl font-bold">{stats.starred}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{stats.documents_count}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-2xl font-bold">{stats.notes_count}</p>
              </div>
              <StickyNote className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold">{stats.templates_count}</p>
              </div>
              <Layout className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents by title, content, or tags..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="date">Date Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="note">Notes</SelectItem>
                  <SelectItem value="template">Templates</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-[140px]">
                  <Folder className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="none">No Project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="all" className="gap-2">
            <FileText className="h-4 w-4" />
            All Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="starred" className="gap-2">
            <Star className="h-4 w-4" />
            Starred ({documents.filter((d) => d.starred).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      ) : filteredAndSortedDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No documents matching "${searchQuery}"`
              : activeTab === "starred"
                ? "You haven't starred any documents yet"
                : "Create your first document to get started"}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDocuments.map((document) => (
            <Card
              key={document.id}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 relative overflow-hidden cursor-pointer"
              onClick={() => handleDocumentClick(document)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {document.title}
                      </CardTitle>
                      {document.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(document.type)}
                      {document.project && (
                        <Badge variant="outline" className="text-xs">
                          <Folder className="h-3 w-3 mr-1" />
                          {projects.find((p) => p.id === document.project)?.name || "Project"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={(e) => (e.stopPropagation(), handleStarDocument(document.id))}>
                        <Star className={`h-4 w-4 mr-2 ${document.starred ? "text-yellow-500 fill-current" : ""}`} />
                        {document.starred ? "Unstar" : "Star"} Document
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => (e.stopPropagation(), handleDuplicateDocument(document.id))}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedDocument(document); }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Document
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShareDocument(document); }}>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExportDocument(document); }}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => (e.stopPropagation(), handleDeleteDocument(document.id))}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Content Preview */}
                <div className="h-20 overflow-hidden text-sm text-muted-foreground">
                  {document.content.replace(/<[^>]*>/g, "").substring(0, 120)}...
                </div>

                {/* Tags */}
                {document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {document.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{document.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Document Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Updated {new Date(document.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <div className="flex justify-between items-center w-full">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={document.createdBy.avatar || "/placeholder.svg"}
                        alt={document.createdBy.name}
                      />
                      <AvatarFallback className="text-xs">{document.createdBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{document.createdBy.name}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <a ref={downloadRef} style={{ display: "none" }} />

      {/* Share Dialog */}
      <ShareDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <ShareDialogContent>
          <ShareDialogHeader>
            <ShareDialogTitle>Share Document</ShareDialogTitle>
            <ShareDialogDescription>
              Copy the link below to share this document:
            </ShareDialogDescription>
          </ShareDialogHeader>
          <div className="flex items-center gap-2 mt-2">
            <Input value={shareLink} readOnly className="flex-1" />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(shareLink)
                toast({ title: "Link copied!" })
              }}
            >
              Copy
            </Button>
          </div>
          <ShareDialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Close
            </Button>
          </ShareDialogFooter>
        </ShareDialogContent>
      </ShareDialog>
    </div>
  )
}

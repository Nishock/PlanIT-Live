"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Star, MoreHorizontal, Eye, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

interface Document {
  id: string
  title: string
  content: string
  createdBy: {
    name: string
    avatar?: string
  }
  updatedAt: string
  starred?: boolean
}

interface DocumentGridProps {
  documents: Document[]
}

export function DocumentGrid({ documents }: DocumentGridProps) {
  const router = useRouter()

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No documents found</h3>
        <p className="text-muted-foreground">Create your first document to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(`/dashboard/documents/${doc.id}`)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-base line-clamp-1">{doc.title}</CardTitle>
                <CardDescription className="text-sm">
                  Updated {new Date(doc.updatedAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                {doc.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-20 overflow-hidden text-sm text-muted-foreground">
              {doc.content.replace(/<[^>]*>/g, "").substring(0, 120)}...
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  {doc.createdBy.name.charAt(0)}
                </div>
                {doc.createdBy.name}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

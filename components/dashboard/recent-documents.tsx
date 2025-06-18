import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MoreHorizontal, Star } from "lucide-react"

export function RecentDocuments() {
  const documents = [
    {
      id: 1,
      title: "Project Requirements",
      updated: "2 hours ago",
      starred: true,
    },
    {
      id: 2,
      title: "Meeting Notes - Sprint Planning",
      updated: "Yesterday",
      starred: false,
    },
    {
      id: 3,
      title: "Product Roadmap Q3",
      updated: "3 days ago",
      starred: true,
    },
    {
      id: 4,
      title: "User Research Findings",
      updated: "1 week ago",
      starred: false,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Recent Documents</CardTitle>
            <CardDescription>Documents you've recently accessed</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-md border p-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">Updated {doc.updated}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star
                    className={`h-4 w-4 ${doc.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                  <span className="sr-only">{doc.starred ? "Unstar" : "Star"}</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

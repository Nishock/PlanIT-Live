"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HelpCircle,
  MessageSquare,
  Book,
  Video,
  Mail,
  Phone,
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
} from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a new task?",
      answer:
        "You can create a new task by clicking the 'New Task' button on the dashboard or going to the Tasks page and clicking 'Add Task'. Fill in the task details and assign it to a team member.",
      category: "Tasks",
    },
    {
      question: "How do I invite team members to my workspace?",
      answer:
        "Go to your workspace settings and click 'Invite Members'. Enter their email addresses and select their role. They'll receive an invitation email to join.",
      category: "Workspace",
    },
    {
      question: "Can I use PLANIT offline?",
      answer:
        "PLANIT requires an internet connection for most features. However, some cached data may be available offline for viewing.",
      category: "General",
    },
    {
      question: "How do I upgrade my subscription?",
      answer:
        "Go to Settings > Billing and select the plan you want to upgrade to. You'll be redirected to our secure payment processor.",
      category: "Billing",
    },
    {
      question: "How does the AI assistant work?",
      answer:
        "The AI assistant can help you create tasks, summarize documents, provide project insights, and answer questions about your work. Just type your question in natural language.",
      category: "AI Features",
    },
  ]

  const tutorials = [
    {
      title: "Getting Started with PLANIT",
      description: "Learn the basics of setting up your workspace and creating your first project",
      duration: "5 min",
      type: "video",
    },
    {
      title: "Advanced Task Management",
      description: "Master task dependencies, custom fields, and automation rules",
      duration: "8 min",
      type: "video",
    },
    {
      title: "Collaboration Best Practices",
      description: "Tips for effective team collaboration and communication",
      duration: "6 min",
      type: "article",
    },
    {
      title: "Using AI Features",
      description: "Discover how to leverage AI for productivity and insights",
      duration: "7 min",
      type: "video",
    },
  ]

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to your questions and get the help you need</p>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search for help articles, tutorials, or FAQs..." className="pl-10 h-12" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <div className="grid gap-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">All</Badge>
              <Badge variant="outline">Tasks</Badge>
              <Badge variant="outline">Workspace</Badge>
              <Badge variant="outline">Billing</Badge>
              <Badge variant="outline">AI Features</Badge>
              <Badge variant="outline">General</Badge>
            </div>

            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-base">{faq.question}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {faq.category}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {tutorial.type === "video" ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <Book className="h-5 w-5 text-primary" />
                      )}
                      <Badge variant="outline">{tutorial.type}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {tutorial.duration}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {tutorial.type === "video" ? "Watch Video" : "Read Article"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send us a message
                </CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="What can we help you with?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Describe your issue or question..." rows={4} />
                </div>
                <Button className="w-full">Send Message</Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">For general inquiries and support</p>
                  <p className="font-medium">support@planit.app</p>
                  <p className="text-sm text-muted-foreground mt-2">Response time: 24-48 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">For urgent issues (Pro & Enterprise only)</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground mt-2">Mon-Fri, 9 AM - 6 PM EST</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                All Systems Operational
              </CardTitle>
              <CardDescription>All PLANIT services are running normally</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {[
              { service: "Web Application", status: "operational" },
              { service: "API Services", status: "operational" },
              { service: "Database", status: "operational" },
              { service: "File Storage", status: "operational" },
              { service: "AI Services", status: "operational" },
              { service: "Email Notifications", status: "operational" },
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-4">
                  <span className="font-medium">{item.service}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 capitalize">{item.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

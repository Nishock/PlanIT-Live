import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { requireAuth } from "@/lib/middleware/auth"
import connectDB from "@/lib/database"
import Task from "@/lib/models/Task"
import Project from "@/lib/models/Project"

export const POST = requireAuth(async (request: NextRequest, authUser) => {
  try {
    await connectDB()

    const { projectId, context } = await request.json()

    // Get project and existing tasks for context
    let projectContext = ""
    if (projectId) {
      const project = await Project.findById(projectId)
      const tasks = await Task.find({ project: projectId }).limit(10)

      projectContext = `
      Project: ${project?.name || "Unknown"}
      Description: ${project?.description || "No description"}
      Existing tasks: ${tasks.map((t) => `- ${t.title} (${t.status})`).join("\n")}
      `
    }

    const prompt = `Based on the following project information, suggest 5 relevant tasks that would help move the project forward:

    ${projectContext}
    
    ${context ? `Additional context: ${context}` : ""}
    
    Return the suggestions as a JSON array of objects with 'title', 'description', and 'priority' fields.
    Priority should be 'low', 'medium', 'high', or 'urgent'.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    try {
      const suggestions = JSON.parse(text)
      return NextResponse.json({ suggestions })
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      return NextResponse.json({
        suggestions: [
          {
            title: "AI Suggestion",
            description: text,
            priority: "medium",
          },
        ],
      })
    }
  } catch (error) {
    console.error("AI task suggestions error:", error)
    return NextResponse.json({ error: "Failed to generate task suggestions" }, { status: 500 })
  }
})

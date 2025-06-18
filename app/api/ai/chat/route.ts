import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Call OpenAI API
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: context || "You are a helpful assistant for productivity and project management." },
          { role: "user", content: message },
        ],
        max_tokens: 256,
        temperature: 0.7,
      }),
    })

    if (!openaiRes.ok) {
      const error = await openaiRes.json()
      return NextResponse.json(
        { error: error.error?.message || "OpenAI API error" },
        { status: 500 }
      )
    }

    const data = await openaiRes.json()
    const aiMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      response: aiMessage,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    )
  }
}
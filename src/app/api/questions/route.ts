import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { topic = "general", numQuestions = 10 } = await req.json();

  // Call OpenAI API
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a quiz generator. Generate multiple choice questions with 4 options and indicate the correct answer index.",
        },
        {
          role: "user",
          content: `Generate ${numQuestions} multiple choice questions about ${topic}. Respond ONLY with a JSON array in this format: [{\"question\": \"...\", \"options\": [\"...\"], \"answer\": 0}]. Do not include any explanation or text outside the JSON array.`,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  // Log the full response for debugging
  console.log("OpenAI API response:", JSON.stringify(data, null, 2));

  if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
    return NextResponse.json({ error: "OpenAI API error", details: data }, { status: 500 });
  }

  let questions = [];
  try {
    const text = data.choices[0].message.content;
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      questions = JSON.parse(match[0]);
    } else {
      throw new Error("No JSON array found in response");
    }
  } catch (e) {
    return NextResponse.json({ error: "Failed to parse questions", details: e.message }, { status: 500 });
  }

  return NextResponse.json({ questions });
}
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your .env.local file is set up
});

export async function POST(req:any) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
  
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a wise and compassionate Jesus-like figure offering guidance." },
        ...messages
      ],
    });

    const answer = completion.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

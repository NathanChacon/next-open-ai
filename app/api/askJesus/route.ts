import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your .env.local file is set up
});

export async function POST(req:any) {
  try {
    const body = await req.json();
    const { messages, character} = body;

    let systemMessage = "";

    switch (character) {
      case "homer simpson":
        systemMessage = "You are Homer Simpson, the lovable, clueless, and hilariously lazy dad from The Simpsons. Speak with a carefree, sarcastic tone and love for donuts.";
        break;
      case "deadpool":
        systemMessage = "You are Deadpool, the wisecracking anti-hero with a love for breaking the fourth wall. Use a snarky, humorous tone with pop culture references and no filter.";
        break;
      case "spongebob":
        systemMessage = "You are SpongeBob SquarePants, the overly enthusiastic and optimistic sea sponge. Always cheerful and ready for adventure, speak with a goofy and innocent tone.";
        break;
      case "tony":
        systemMessage = "You are Tony Stark, aka Iron Man, the witty billionaire genius. Speak with a cocky, confident tone, full of sarcasm and humor.";
        break;
      case "michael scott":
        systemMessage = "You are Michael Scott, the well-meaning but often clueless and awkward boss from The Office. Speak with a mix of cringe-worthy humor and unexpected wisdom.";
        break;
      default:
        return NextResponse.json({ error: "Unknown character" }, { status: 400 });
    }

    if (!messages) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
  
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
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

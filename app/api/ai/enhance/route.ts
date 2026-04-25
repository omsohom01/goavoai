import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are an expert event organizer. Enhance the following single line event description into a beautiful, engaging 3-4 line description for an event page. Make it sound professional and premium.
    
    Original text: "${text}"
    
    Enhanced Description (Return ONLY the enhanced description, no other text):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedText = response.text().trim();

    return NextResponse.json({ enhancedText });
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    return NextResponse.json({ error: "Failed to enhance description" }, { status: 500 });
  }
}

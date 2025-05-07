// src/app/api/gemini/recommendations/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { symptoms } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 🟡 Enhanced Prompt for Better Medical Suggestions
    const prompt = `
    You are a medical assistant. A patient has reported the following symptoms: ${symptoms}.
    
    1. Provide 2-3 possible diseases or conditions based on the symptoms. 
    2. Recommend a suitable type of doctor (e.g., Cardiologist, Neurologist, Orthopedic).
    3. Suggest a brief treatment or next steps (in 1-2 lines).

    Please keep the answers short and clear for easy understanding.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = response.text();

    // Return structured JSON
    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations", details: error.message },
      { status: 500 }
    );
  }
}

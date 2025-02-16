// src/app/api/recommendations/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/dbConnect";
import MedicalReport from "@/models/Analysis";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(req) {
  try {
    // 1️⃣ Connect to Database
    await dbConnect();

    // 2️⃣ Get user session and email
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized - No user email found" }, { status: 401 });
    }

    // 3️⃣ Fetch user's medical reports
    const reports = await MedicalReport.find({ email: user.email }).lean();
    if (reports.length === 0) {
      return NextResponse.json({ message: "No medical reports found" }, { status: 404 });
    }

    // 4️⃣ Prepare data for Gemini
    const reportSummaries = reports.map((report, index) => ({
      id: index + 1,
      diagnosis: report.diagnosis,
      observations: report.observations.join("; "),
      concerns: report.areas_of_concern.join("; "),
      createdAt: report.createdAt,
    }));

    const prompt = `
      You are an expert healthcare assistant. Based on the patient's past medical reports, 
      predict possible future conditions and provide preventive measures.

      Patient Medical History:
      ${JSON.stringify(reportSummaries, null, 2)}

      Provide your recommendations clearly:
      - Possible future conditions
      - Preventive measures
    `;

    // 5️⃣ Send data to Gemini for analysis
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();

    // 6️⃣ Return the Gemini AI recommendations
    return NextResponse.json({
      message: "Recommendations generated successfully",
      recommendations: geminiResponse,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error generating recommendations:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

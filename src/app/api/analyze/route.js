import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import Analysis from "@/models/Analysis";  // Import Mongoose model
import { dbConnect } from "../../../lib/dbConnect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// List of suggested diseases to include in the prompt
const DISEASES = [
    "tuberculosis",
    "pneumonia",
    "heart diseases",
    "Alzheimer's",
    "malaria",
    "breast cancer",
    "brain tumor"
];

// Function to generate a dynamic prompt ensuring only relevant diseases are considered
function getDynamicPrompt() {
    return `
You are a medical imaging expert analyzing a provided medical image (X-ray, MRI, or CT scan). Your task is to detect and describe any abnormalities strictly related to the following conditions: ${DISEASES.join(", ")}.

**Instructions:**
1. **Diagnosis**: Identify if the image suggests any of the above conditions.
2. **Observations**: List key findings and abnormalities visible in the scan.
3. **Potential Conditions**: Only include conditions from this list: ${DISEASES.join(", ")}.
4. **Areas of Concern**: Highlight specific regions that require further investigation.

**Response Format (JSON-like)**:
{
    "diagnosis": "Brief primary diagnosis",
    "observations": ["List of detailed observations"],
    "potential_conditions": ["Only include diseases from the predefined list"],
    "areas_of_concern": ["Specific areas needing attention"]
}

Only provide responses related to the listed diseases. If no relevant abnormalities are found, return an empty 'potential_conditions' array.
    `;
}

export async function POST(request) {
    try {
        console.log("🟢 Incoming POST request to /api/analyze");

        // Ensure database connection
        await dbConnect();
        console.log("✅ Database connected");

        // Get user session and email from Kinde
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        console.log("🧑‍💻 Retrieved user:", user);
        console.log("📧 User email:", user?.email || "No email found");

        if (!user || !user.email) {
            console.log("❌ Unauthorized - No user email found");
            return new Response(JSON.stringify({ error: "Unauthorized - No user email found" }), { 
                status: 401, headers: { "Content-Type": "application/json" } 
            });
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            console.error("❌ No file provided in request");
            return new Response(JSON.stringify({ error: "No file provided" }), { 
                status: 400, headers: { "Content-Type": "application/json" } 
            });
        }
        if (!file.type.startsWith("image/")) {
            console.error(`❌ Invalid file type: ${file.type}`);
            return new Response(JSON.stringify({ error: "File must be an image" }), { 
                status: 400, headers: { "Content-Type": "application/json" } 
            });
        }

        console.log(`📸 Processing image: ${file.name}, Type: ${file.type}`);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");  // Convert image to base64

        console.log("📡 Sending image to Gemini AI for analysis...");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: file.type
            }
        };

        const ANALYSIS_PROMPT = getDynamicPrompt(); // Get a dynamically generated prompt
        const result = await model.generateContent([ANALYSIS_PROMPT, imagePart]);
        const response = await result.response;
        const text = await response.text();

        console.log("🤖 AI Response Received: ", text);

        let analysis;
        try {
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            analysis = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(text);

            // ✅ Filter out any conditions not in the DISEASES array
            analysis.potential_conditions = analysis.potential_conditions?.filter(disease => DISEASES.includes(disease)) || [];

            console.log("✅ Parsed AI Analysis:", analysis);
        } catch (err) {
            console.error("❌ Error parsing AI response:", err);
            analysis = { diagnosis: text, observations: [], potential_conditions: [], areas_of_concern: [] };
        }

        // Save analysis to MongoDB with user's email
        console.log("💾 Saving analysis to MongoDB...");
        const newAnalysis = new Analysis({
            diagnosis: analysis.diagnosis,
            observations: analysis.observations,
            potential_conditions: analysis.potential_conditions,
            areas_of_concern: analysis.areas_of_concern,
            imageData: base64Image, // Store image for reference
            email: user.email  // Attach user's email
        });

        await newAnalysis.save();
        console.log("✅ Analysis saved successfully!");

        return new Response(JSON.stringify({ status: "success", analysis }), { 
            status: 200, headers: { "Content-Type": "application/json" } 
        });
    } catch (error) {
        console.error("❌ Failed to process the image:", error.stack);
        return new Response(JSON.stringify({ error: "Failed to process the image", details: error.message }), { 
            status: 500, headers: { "Content-Type": "application/json" } 
        });
    }
}
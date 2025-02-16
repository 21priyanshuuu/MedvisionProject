import { GoogleGenerativeAI } from "@google/generative-ai";
import { dbConnect } from "../../../lib/dbConnect";
import Analysis from "../../../models/Analysis"; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(request) {
    try {
        await dbConnect();

        const analyses = await Analysis.find({});  
        if (!analyses.length) {
            return new Response(JSON.stringify({ error: "No past analyses found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const formattedData = analyses.map(entry => ({
            diagnosis: entry.diagnosis,
            observations: entry.observations,
            potential_conditions: entry.potential_conditions,
            areas_of_concern: entry.areas_of_concern,
        }));

        const RECOMMENDATION_PROMPT = `
        You are an experienced doctor. Based on the patient's past medical diagnoses, observations, and potential conditions, provide future health recommendations.
        Include:
        1. Possible future health risks
        2. Preventive measures
        3. Lifestyle changes to reduce risk
        4. Routine checkups or medical tests to consider

        Format response as JSON:
        {
            "recommendations": ["List of personalized recommendations"]
        }
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([RECOMMENDATION_PROMPT, JSON.stringify(formattedData)]);
        const response = await result.response;
        const text = await response.text();

        let recommendations;
        try {
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            recommendations = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(text);
        } catch {
            recommendations = { recommendations: [text] };
        }

        return new Response(JSON.stringify({ status: "success", recommendations }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to generate recommendations", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

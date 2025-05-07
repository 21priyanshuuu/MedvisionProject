import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  console.error('CRITICAL: Gemini API Key is not set in environment variables')
  throw new Error('GEMINI_API_KEY must be set in .env.local')
}

// Predefined list of potential model names
const POSSIBLE_MODELS = [
  "gemini-1.5-flash",
  "gemini-pro",
  "gemini-1.0-pro",
  "models/gemini-pro",
  "models/gemini-1.0-pro"
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export async function POST(request: Request) {
  const { symptoms } = await request.json()

  // Try multiple model names
  let model;
  for (const modelName of POSSIBLE_MODELS) {
    try {
      model = genAI.getGenerativeModel({ model: modelName });
      break;
    } catch (error) {
      console.warn(`Failed to select model: ${modelName}`);
    }
  }

  if (!model) {
    throw new Error('Could not find a valid Gemini AI model');
  }

  const prompt = `Given the following symptoms: "${symptoms}", generate a detailed diagnosis report in this EXACT JSON format:
{
  "Possible Diagnosis": "Specific diagnosis based on symptoms",
  "Potential Disease": "Medical condition name",
  "Symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "Recommended Treatment": ["treatment step 1", "treatment step 2"],
  "Prevention Tips": ["prevention tip 1", "prevention tip 2"]
}

Ensure the response is a valid JSON object. Do not include any additional text or explanation.`

  try {
    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim()
    
    // Remove any markdown code block formatting
    const cleanedText = responseText.replace(/```json?/g, '').replace(/```/g, '').trim()
    
    let diagnosis
    try {
      diagnosis = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanedText)
      return new Response(JSON.stringify({ 
        error: 'Could not parse AI response',
        rawResponse: cleanedText 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ diagnosis }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Diagnosis Generation Error:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown Error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      apiKey: process.env.GEMINI_API_KEY ? 'Key is set' : 'Key is NOT set'
    })
    return new Response(JSON.stringify({ 
      error: 'An error occurred while generating the diagnosis.',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

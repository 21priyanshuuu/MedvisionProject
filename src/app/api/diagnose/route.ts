import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export async function POST(request: Request) {
  const { symptoms } = await request.json()

  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `Given the following symptoms: "${symptoms}", generate a detailed diagnosis report with the following structured format:

  **Virtual Health Consultant**
  **Diagnosis Report**
  
  **Possible Diagnosis:** [Provide diagnosis]
  **Potential Disease:** [Provide disease name]
  
  **Symptoms:**
  - [List of symptoms]
  
  **Recommended Treatment:**
  - [Detailed treatment plan]
  
  **Prevention Tips:**
  - [Preventive measures]
  `

  try {
    const result = await model.generateContent(prompt)
    const diagnosis = result.response.text()
    console.log(diagnosis)

    return new Response(JSON.stringify({ diagnosis }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: "An error occurred while generating the diagnosis." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

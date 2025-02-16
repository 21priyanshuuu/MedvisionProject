"use client"

import  React from "react"

import { useState, useRef } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function MedicalPortal() {
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(null)
  const [showEasyExplanation, setShowEasyExplanation] = useState(false)
  const [showFullExplanation, setShowFullExplanation] = useState(false)
const reportRef = useRef(null);

  const handleFileChange =(e) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only JPG and PNG images are supported.")
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setError("")
    setAnalysis(null)
  }

  const handleUpload = async () => {
    event.preventDefault()
    if (!file) return setError("Please select an image first.")

    const formData = new FormData()
    formData.append("file", file)
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/analyze", { method: "POST", body: formData })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      if (data.status === "success") {
        setAnalysis(data.analysis)
      } else {
        setError(data.error || "Analysis failed.")
      }
    } catch (error) {
      setError((error ).message || "Failed to analyze image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    setAnalysis(null)
    setError("")
  }

  const generatePDF = async () => {
    if (!analysis || !reportRef.current) return
    const doc = new jsPDF()

    const canvas = await html2canvas(reportRef.current)
    const imgData = canvas.toDataURL("image/png")

    doc.addImage(imgData, "PNG", 10, 10, 190, 0)
    doc.save(`Medical_Report_${Date.now()}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-teal-700 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold">HealthTech Medical Portal</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Medical Image Analysis</h2>
            <p className="mt-2 text-gray-600">Upload your medical image for AI-powered analysis</p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              {!preview ? (
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-teal-500 transition duration-300">
                  <span className="text-gray-600">Click to upload an X-ray, MRI, or CT scan</span>
                  <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={preview || "/placeholder.svg"}
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                    alt="Preview"
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition duration-300"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              className={`w-full py-3 rounded-lg font-medium text-white transition duration-300 ${
                loading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
              }`}
              disabled={loading || !file}
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">{error}</div>
            )}

            {analysis && (
              <div ref={reportRef} className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800">Medical Analysis Report</h3>
                  <p className="mt-2 text-sm text-gray-600">Generated on {new Date().toLocaleString()}</p>
                </div>

                <div className="p-6">
                  <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <h4 className="text-lg font-medium text-blue-800">Key Findings</h4>
                    <ul className="mt-2 space-y-2 text-gray-700">
                      <li>
                        <strong>Possible Condition:</strong> {analysis.diagnosis}
                      </li>
                      <li>
                        <strong>Severity:</strong>{" "}
                        {analysis.areas_of_concern.length > 0 ? "Further Investigation Required" : "Likely Benign"}
                      </li>
                      <li>
                        <strong>Recommended Action:</strong>{" "}
                        {analysis.potential_conditions.includes("Breast cancer")
                          ? "Consult oncologist for treatment plan"
                          : "Follow-up with primary care physician"}
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowEasyExplanation(!showEasyExplanation)}
                      className="w-full py-2 rounded-lg bg-teal-100 text-teal-800 font-medium hover:bg-teal-200 transition duration-300"
                    >
                      {showEasyExplanation ? "Hide Simple Explanation" : "View Simple Explanation"}
                    </button>

                    {showEasyExplanation && (
                      <div className="p-4 bg-teal-50 border-l-4 border-teal-500 rounded-lg">
                        <p className="text-gray-700">
                          {analysis.diagnosis.includes("benign")
                            ? "Your scan appears mostly normal with minor changes. While this is generally reassuring, it's important to discuss these results with your doctor for a complete evaluation."
                            : "Your scan shows some irregularities that require further examination. It's crucial to follow up with your healthcare provider to discuss these findings and determine the next steps."}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setShowFullExplanation(!showFullExplanation)}
                      className="w-full py-2 rounded-lg bg-indigo-100 text-indigo-800 font-medium hover:bg-indigo-200 transition duration-300"
                    >
                      {showFullExplanation ? "Hide Detailed Explanation" : "View Detailed Explanation"}
                    </button>

                    {showFullExplanation && (
                      <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
                        <h4 className="text-lg font-medium text-indigo-800">Detailed Analysis</h4>
                        <p className="mt-2 text-gray-700">{analysis.diagnosis}</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                          {analysis.observations.map((obs, index) => (
                            <li key={index}>{obs}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={generatePDF}
                    className="w-full mt-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition duration-300"
                  >
                    Download Report as PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © 2023 HealthTech Medical Portal. All rights reserved. |{" "}
          <a href="#" className="text-teal-600 hover:underline">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" className="text-teal-600 hover:underline">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  )
}


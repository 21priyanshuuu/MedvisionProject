"use client";

import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// 🟡 Medical Portal Page with Enhanced Styling
export default function MedicalPortal() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [showEasyExplanation, setShowEasyExplanation] = useState(false);
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const reportRef = useRef(null);

  // ✅ Handle File Change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only JPG and PNG images are supported.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
    setAnalysis(null);
  };

  // ✅ Handle Image Upload
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return setError("Please select an image first.");

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Analysis failed.");
      }
    } catch (error) {
      setError(error.message || "Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove Selected File
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setAnalysis(null);
    setError("");
  };

  // ✅ Generate PDF Report
  const generatePDF = async () => {
    if (!analysis || !reportRef.current) return;
    const doc = new jsPDF();

    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    doc.addImage(imgData, "PNG", 10, 10, 190, 0);
    doc.save(`Medical_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-blue-800 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm4 3a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1H7zm0 2h10v6H7V9zm3 3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <h1 className="text-4xl font-extrabold tracking-tight">HealthTech Medical Portal</h1>
          </div>
          <div className="text-sm text-white/70 hidden md:block">
            AI-Powered Medical Insights
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10">
        <Card className="bg-gray-900 border border-gray-800 shadow-lg">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-2xl text-teal-300 font-bold">
              🧬 Medical Image Analysis
            </CardTitle>
            <p className="text-gray-400">Upload your X-ray, MRI, or CT scan for AI analysis</p>
          </CardHeader>

          <CardContent>
            {/* File Upload Section */}
            <div className="mb-6">
              {!preview ? (
                <label className="group flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-8 cursor-pointer transition duration-300 hover:border-teal-500 hover:bg-gray-800/50 space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-500 group-hover:text-teal-500 transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-center space-y-2">
                    <span className="block text-gray-400 group-hover:text-teal-400 transition font-medium">Click to upload an image</span>
                    <span className="block text-xs text-gray-500 group-hover:text-teal-500 transition">Supports PNG, JPEG (Max 5MB)</span>
                  </div>
                  <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Uploaded Preview"
                    className="rounded-lg border border-gray-600 w-full"
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full text-lg group relative overflow-hidden ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300"}`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2H4zm16 2H4v10h16V7zm-5 4a1 1 0 01-1 1h-5a1 1 0 110-2h5a1 1 0 011 1z" clipRule="evenodd" />
                    </svg>
                    <span>Analyze Image</span>
                  </>
                )}
              </span>
              {!loading && (
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <div className="mt-4 bg-red-100 border border-red-500 text-red-600 p-3 rounded-lg">
                ❌ {error}
              </div>
            )}

            {/* Analysis Report */}
            {analysis && (
              <div ref={reportRef} className="mt-8 bg-gray-900 border border-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-800">
                  <h3 className="text-xl font-semibold text-yellow-400">
                    📑 Medical Analysis Report
                  </h3>
                  <p className="text-sm text-gray-500">Generated on {new Date().toLocaleString()}</p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Key Findings */}
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <h4 className="text-lg font-medium text-blue-800">🩺 Key Findings</h4>
                    <ul className="mt-2 space-y-2 text-gray-700">
                      <li>
                        <strong>🧪 Possible Condition:</strong> {analysis.diagnosis}
                      </li>
                      <li>
                        <strong>🩸 Severity:</strong>{" "}
                        {analysis.areas_of_concern.length > 0 ? "Further Investigation Required" : "Likely Benign"}
                      </li>
                      <li>
                        <strong>💊 Recommended Action:</strong>{" "}
                        {analysis.potential_conditions.includes("Breast cancer")
                          ? "Consult an Oncologist"
                          : "Follow-up with your Physician"}
                      </li>
                    </ul>
                  </div>

                  {/* Explanation Buttons */}
                  <div className="space-y-3">
                    {/* Simple Explanation */}
                    <Button
                      onClick={() => setShowEasyExplanation(!showEasyExplanation)}
                      className="w-full bg-teal-100 text-teal-800 hover:bg-teal-200"
                    >
                      {showEasyExplanation ? "⬆️ Hide Simple Explanation" : "⬇️ View Simple Explanation"}
                    </Button>

                    {showEasyExplanation && (
                      <div className="p-4 bg-teal-50 border-l-4 border-teal-500 rounded-lg">
                        <p className="text-gray-700">
                          {analysis.diagnosis.includes("benign")
                            ? "✅ The scan appears mostly normal with minor changes. It is advisable to consult your doctor for confirmation."
                            : "⚠️ The scan shows some irregularities. Please consult your healthcare provider immediately."}
                        </p>
                      </div>
                    )}

                    {/* Detailed Explanation */}
                    <Button
                      onClick={() => setShowFullExplanation(!showFullExplanation)}
                      className="w-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                    >
                      {showFullExplanation ? "⬆️ Hide Detailed Analysis" : "⬇️ View Detailed Analysis"}
                    </Button>

                    {showFullExplanation && (
                      <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
                        <h4 className="text-lg font-medium text-indigo-800">📑 Detailed Analysis</h4>
                        <p className="mt-2 text-gray-700">{analysis.diagnosis}</p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                          {analysis.observations.map((obs, index) => (
                            <li key={index}>{obs}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* PDF Download Button */}
                  <Button
                    onClick={generatePDF}
                    className="w-full mt-4 bg-green-600 text-white hover:bg-green-700"
                  >
                    📥 Download Report as PDF
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 HealthTech Medical Portal. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-teal-400 hover:text-teal-300 transition duration-300 flex items-center space-x-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.265.01 3.64.053 7.925-1.1.525 1.02 1.025 2.025 1.486 3.017-1.8.512-3.351 1.592-4.448 3.017a8.518 8.518 0 01-4.963-4.678zM12 20.554a8.508 8.508 0 01-5.407-1.97c.905-1.358 2.563-2.56 4.414-3.029a23.882 23.882 0 011.055 5.344A8.974 8.974 0 0112 20.554zM10.794 18.63a24.438 24.438 0 00-1.565-5.572c1.752-.06 3.404-.434 4.862-1.105.441.725.804 1.435 1.084 2.122a8.37 8.37 0 01-4.381 4.555zM14.626 14.9a19.64 19.64 0 00-1.009-1.688 8.608 8.608 0 004.973-5.407 8.547 8.547 0 01.587 3.206c0 1.765-.666 3.433-1.551 4.889z" clipRule="evenodd" />
                </svg>
                <span>Privacy Policy</span>
              </a>
              <a 
                href="#" 
                className="text-teal-400 hover:text-teal-300 transition duration-300 flex items-center space-x-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z" clipRule="evenodd" />
                </svg>
                <span>Terms of Service</span>
              </a>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Powered by AI-Driven Healthcare Technology
          </div>
        </div>
      </footer>
    </div>
  );
}

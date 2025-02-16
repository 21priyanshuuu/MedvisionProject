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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-teal-700 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">💙 HealthTech Medical Portal</h1>
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
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 cursor-pointer transition hover:border-teal-500">
                  <span className="text-gray-400">📂 Click to upload an image</span>
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
              className={`w-full text-lg ${loading ? "bg-gray-500" : "bg-teal-600 hover:bg-teal-700"}`}
            >
              {loading ? "🔍 Analyzing..." : "📊 Analyze Image"}
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
      <footer className="bg-gray-900 border-t border-gray-800 py-6 text-center text-gray-400 text-sm">
        © 2025 HealthTech Medical Portal. All rights reserved. |{" "}
        <a href="#" className="text-teal-400 hover:underline">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a href="#" className="text-teal-400 hover:underline">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}

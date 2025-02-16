'use client'
import { useState } from "react";

export default function MedicalAI() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setError("");
      setAnalysis(null);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    
    if (!file) {
      setError("Please select an image first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("/api/generate_report", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.status === "success") {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (error) {
      setError("Failed to analyze image. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">MediVision AI - Medical Report</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Upload Medical Image</label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg h-64 flex items-center justify-center cursor-pointer hover:bg-gray-50">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-full max-w-full" />
              ) : (
                <span className="text-gray-500">Click to upload X-ray, MRI, or CT scan</span>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <button 
              className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading ? "Generating Report..." : "Generate Report"}
            </button>
          </div>

          <div>
            {error && <div className="p-4 bg-red-100 text-red-600 rounded-lg mb-4">{error}</div>}
            {analysis ? (
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Report</h2>
                <p className="text-gray-700"><strong>Patient Condition:</strong> {analysis.diagnosis}</p>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">Detailed Findings:</h3>
                <ul className="list-disc ml-5 text-gray-700">
                  {analysis.observations.map((obs, index) => (
                    <li key={index}>{obs}</li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">Clinical Interpretation:</h3>
                <p className="text-gray-700">{analysis.clinical_notes}</p>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">Recommended Diagnosis & Treatment:</h3>
                <p className="text-gray-700">{analysis.recommendation || "Further consultation with a specialist recommended."}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Upload an image to generate the medical report
              </div>
            )}
          </div>
        </div>
        {analysis && (
          <button 
            className="w-full mt-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
            onClick={() => alert("Easy Explanation: " + JSON.stringify(analysis, null, 2))}
          >
            Easy Explain
          </button>
        )}
      </div>
    </div>
  );
}

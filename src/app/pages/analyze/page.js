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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h1 className="text-4xl font-extrabold text-white text-center flex items-center justify-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.179.885H5.59l1.666-5.115a1.5 1.5 0 012.812 0l1.666 5.115h4.146a3 3 0 00-.179-.885L16.088 5.118A3 3 0 0013.22 3H6.912zM12 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" clipRule="evenodd" />
              <path d="M16.391 10.5a1.5 1.5 0 10-3 0v3a1.5 1.5 0 003 0v-3z" />
              <path d="M4.5 15a3 3 0 00-3 3v1.5a1.5 1.5 0 001.5 1.5h19.5a1.5 1.5 0 001.5-1.5V18a3 3 0 00-3-3h-13a3 3 0 00-3 3v1.5a1.5 1.5 0 001.5 1.5h1.5v-3h-1.5v1.5h1.5v-1.5H18v1.5h1.5v-1.5h-1.5v-3H4.5z" />
            </svg>
            MediVision AI
          </h1>
          <p className="text-center text-white/80 mt-2">Advanced Medical Image Analysis</p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <label className="block font-semibold text-blue-900 mb-4 text-lg">Upload Medical Image</label>
                <div 
                  className="border-dashed border-2 border-blue-300 rounded-xl h-64 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition group relative"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                >
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-full max-w-full rounded-lg shadow-md group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="text-center text-blue-600 space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium">Click to upload X-ray, MRI, or CT scan</p>
                      <p className="text-sm text-blue-500">Supported formats: PNG, JPG, DICOM</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>

              <button 
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-[1.02] duration-300 shadow-xl"
                onClick={handleUpload}
                disabled={loading || !file}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating Report...</span>
                  </div>
                ) : "Generate Report"}
              </button>
            </div>

            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {analysis ? (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100 space-y-4 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                    <h2 className="text-2xl font-bold text-purple-900">Medical Report</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-purple-800 mb-2">Patient Condition</h3>
                      <p className="text-gray-700">{analysis.diagnosis}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-purple-800 mb-2">Detailed Findings</h3>
                      <ul className="list-disc ml-5 text-gray-700 space-y-1">
                        {analysis.observations.map((obs, index) => (
                          <li key={index}>{obs}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-purple-800 mb-2">Clinical Interpretation</h3>
                      <p className="text-gray-700">{analysis.clinical_notes}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-purple-800 mb-2">Recommended Diagnosis & Treatment</h3>
                      <p className="text-gray-700">{analysis.recommendation || "Further consultation with a specialist recommended."}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-4 bg-purple-50 rounded-xl p-8 border border-purple-100 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-purple-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl font-semibold text-purple-900">Ready to Analyze</p>
                  <p className="text-purple-700">Upload a medical image to generate an AI-powered report</p>
                </div>
              )}
            </div>
          </div>

          {analysis && (
            <div className="mt-8">
              <button 
                className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-teal-700 transition transform hover:scale-[1.02] duration-300 shadow-xl"
                onClick={() => {
                  const easyExplanation = `Diagnosis: ${analysis.diagnosis}\n\nKey Findings:\n${analysis.observations.join('\n')}\n\nClinical Notes: ${analysis.clinical_notes}`;
                  alert(easyExplanation);
                }}
              >
                Easy Explain
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

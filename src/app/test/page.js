"use client";
import { useState } from "react";

export default function MedicalAnalysisPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setAnalysis(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a medical image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Parsed Data:", data);

            if (!response.ok) {
                throw new Error(data.error || "Failed to analyze the image");
            }

            // Set analysis results
            setAnalysis(data.analysis);
        } catch (err) {
            console.error("Upload Error:", err);
            setError(err.message || "Failed to analyze the image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full">
                <h1 className="text-2xl font-bold text-center mb-6">
                    AI Medical Image Analyzer
                </h1>

                <div className="space-y-6">
                    {/* File Upload Section */}
                    <div className="space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded-md"
                        />

                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className={`w-full p-2 rounded-md text-white ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Analyzing..." : "Upload & Analyze"}
                        </button>
                    </div>

                    {/* Image Preview */}
                    {preview && (
                        <div className="border rounded-md p-4">
                            <h2 className="text-lg font-semibold mb-2">Image Preview:</h2>
                            <img src={preview} alt="Medical image preview" className="max-w-full h-auto max-h-64 object-contain" />
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Analysis Results */}
                    {analysis && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                            <h2 className="text-lg font-semibold mb-2">Analysis Result:</h2>

                            <div className="space-y-4">
                                {/* Diagnosis */}
                                {analysis.diagnosis && (
                                    <div>
                                        <h3 className="font-semibold">Diagnosis:</h3>
                                        <p className="text-gray-700">{analysis.diagnosis}</p>
                                    </div>
                                )}

                                {/* Observations */}
                                {analysis.observations?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold">Observations:</h3>
                                        <ul className="list-disc list-inside text-gray-700">
                                            {analysis.observations.map((obs, index) => (
                                                <li key={index}>{obs}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Areas of Concern */}
                                {analysis.areas_of_concern?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold">Areas of Concern:</h3>
                                        <ul className="list-disc list-inside text-gray-700">
                                            {analysis.areas_of_concern.map((concern, index) => (
                                                <li key={index}>{concern}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Potential Conditions */}
                                {analysis.potential_conditions?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold">Potential Conditions:</h3>
                                        <ul className="list-disc list-inside text-gray-700">
                                            {analysis.potential_conditions.map((condition, index) => (
                                                <li key={index}>{condition}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

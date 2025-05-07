"use client";

import { useState, useEffect } from "react";

const seasons = {
  spring: "bg-gradient-to-r from-green-400 to-blue-500",
  summer: "bg-gradient-to-r from-yellow-400 to-orange-500",
  autumn: "bg-gradient-to-r from-yellow-600 to-red-600",
  winter: "bg-gradient-to-r from-blue-300 to-indigo-600",
};

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [currentSeason, setCurrentSeason] = useState("spring");

  useEffect(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) setCurrentSeason("spring");
    else if (month >= 5 && month <= 7) setCurrentSeason("summer");
    else if (month >= 8 && month <= 10) setCurrentSeason("autumn");
    else setCurrentSeason("winter");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });
      const data = await response.json();
      setDiagnosis(data.diagnosis);
    } catch (error) {
      console.error("Error:", error);
      setDiagnosis("An error occurred while generating the diagnosis.");
    }
  };

  return (
    <main className={`min-h-screen flex items-center justify-center ${seasons[currentSeason]}`}>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Virtual Health Consultant</h1>
        {diagnosis ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Diagnosis Report</h2>
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
              <p className="text-lg font-semibold">Possible Diagnosis:</p>
              <p className="text-gray-800">{diagnosis["Possible Diagnosis"] || "N/A"}</p>
              <p className="text-lg font-semibold mt-2">Potential Disease:</p>
              <p className="text-gray-800">{diagnosis["Potential Disease"] || "N/A"}</p>
              <p className="text-lg font-semibold mt-2">Symptoms:</p>
              <ul className="list-disc list-inside text-gray-800">
                {diagnosis["Symptoms"]?.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                )) || "N/A"}
              </ul>
              <p className="text-lg font-semibold mt-2">Recommended Treatment:</p>
              <ul className="list-disc list-inside text-gray-800">
                {diagnosis["Recommended Treatment"]?.map((treatment, index) => (
                  <li key={index}>{treatment}</li>
                )) || "N/A"}
              </ul>
              <p className="text-lg font-semibold mt-2">Prevention Tips:</p>
              <ul className="list-disc list-inside text-gray-800">
                {diagnosis["Prevention Tips"]?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                )) || "N/A"}
              </ul>
            </div>
            <button
              onClick={() => setDiagnosis(null)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              New Consultation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Your Symptoms
              </label>
              <textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
                placeholder="Describe your symptoms in detail..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Get Medical Analysis
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

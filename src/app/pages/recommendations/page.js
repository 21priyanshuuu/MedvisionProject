"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommendations");
      const data = await res.json();
      console.log('Raw API Response:', data);
      if (res.ok) {
        setRecommendations(parseRecommendations(data.recommendations));
      } else {
        alert(data.error || "Failed to fetch recommendations.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseRecommendations = (text) => {
    console.log('Raw API Response:', text);

    const sections = {
      "Possible Future Conditions": [],
      "Preventive Measures": []
    };

    try {
      // Advanced parsing strategy
      const parseSection = (sectionTitle) => {
        // Split text into lines and find section
        const lines = text.split('\n');
        const sectionStartIndex = lines.findIndex(line => 
          line.toLowerCase().includes(sectionTitle.toLowerCase())
        );

        if (sectionStartIndex === -1) return [];

        const sectionLines = lines.slice(sectionStartIndex + 1);
        const parsedLines = [];

        for (const line of sectionLines) {
          // Stop parsing if we hit another section
          if (line.includes('**') && line.toLowerCase().includes('preventive measures')) break;
          
          // Clean and filter lines
          const cleanLine = line.replace(/^[\-*•\s]+/, '').trim();
          
          if (cleanLine.length > 0 && 
              !cleanLine.toLowerCase().includes('disclaimer') && 
              !cleanLine.toLowerCase().includes('this information is for') && 
              !cleanLine.toLowerCase().includes('suggestions above are')) {
            parsedLines.push(cleanLine);
          }
        }

        return parsedLines;
      };

      // Parse sections
      sections["Possible Future Conditions"] = parseSection("Possible Future Conditions");
      sections["Preventive Measures"] = parseSection("Preventive Measures");

      // Fallback parsing if no lines found
      if (sections["Possible Future Conditions"].length === 0) {
        const conditionsMatch = text.match(/Possible Future Conditions:(.*?)Preventive Measures:/s);
        if (conditionsMatch) {
          sections["Possible Future Conditions"] = conditionsMatch[1]
            .split('\n')
            .map(line => line.replace(/^[-•*\s]+/, '').trim())
            .filter(line => line.length > 0);
        }
      }

      if (sections["Preventive Measures"].length === 0) {
        const measuresMatch = text.match(/Preventive Measures:(.*)/s);
        if (measuresMatch) {
          sections["Preventive Measures"] = measuresMatch[1]
            .split('\n')
            .map(line => line.replace(/^[-•*\s]+/, '').trim())
            .filter(line => line.length > 0);
        }
      }

      console.log('Parsed Sections:', sections);
      return sections;
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      return sections;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-green-50 rounded-xl shadow-lg p-8 border border-green-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-900 flex items-center justify-center gap-3">
          <span>🩺</span> AI Health Recommendations
        </h2>
        <div className="mb-6 flex justify-center">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-300 px-6 py-3"
            onClick={fetchRecommendations} 
            disabled={loading}
          >
            {loading ? "Generating Insights..." : "Generate Health Recommendations"}
          </Button>
        </div>
        <div className="bg-white border border-green-200 rounded-lg p-6 min-h-[400px] shadow-md">
          {recommendations ? (
            <div className="space-y-8">
              <div className="bg-green-50 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🔮</span>
                  <h3 className="text-2xl font-bold text-green-900">Possible Future Conditions</h3>
                </div>
                {recommendations["Possible Future Conditions"].length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendations["Possible Future Conditions"].map((condition, index) => (
                      <div 
                        key={index} 
                        className="bg-white border border-green-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex items-start">
                          <span className="text-xl mr-3 text-green-600">⚠️</span>
                          <p className="text-green-800 font-medium">{condition}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center bg-white rounded-lg p-6 border border-green-200">
                    <p className="text-green-600 font-semibold">No specific future conditions identified.</p>
                    <p className="text-green-500 text-sm mt-2">Your current health profile looks stable.</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🛡️</span>
                  <h3 className="text-2xl font-bold text-blue-900">Preventive Measures</h3>
                </div>
                {recommendations["Preventive Measures"].length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendations["Preventive Measures"].map((measure, index) => (
                      <div 
                        key={index} 
                        className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex items-start">
                          <span className="text-xl mr-3 text-blue-600">✅</span>
                          <p className="text-blue-800 font-medium">{measure}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center bg-white rounded-lg p-6 border border-blue-200">
                    <p className="text-blue-600 font-semibold">No specific preventive measures recommended.</p>
                    <p className="text-blue-500 text-sm mt-2">Continue maintaining your current health routine.</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600 text-sm">
                <p>🩺 AI-powered health insights are for informational purposes only. Always consult with a healthcare professional.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 bg-green-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p className="text-xl text-green-800 font-semibold">Click 'Generate Health Recommendations'</p>
              <p className="text-green-600 text-center">Unlock personalized AI-powered health insights tailored to your medical history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

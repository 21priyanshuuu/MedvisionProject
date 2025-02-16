"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [doctorSuggestion, setDoctorSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Function to get recommendations from Gemini API
  const getRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      });
      const data = await res.json();

      if (data.recommendations) {
        // 🟡 Short and formatted recommendations
        const formatted = data.recommendations
          .split("\n")
          .filter((line) => line.trim() !== "")
          .slice(0, 5) // Only first 5 short points
          .join("\n");

        setRecommendations(formatted);

        // 🟢 Automatic doctor suggestion based on symptoms
        let suggestedSpecialization = "Specialist";
        if (symptoms.toLowerCase().includes("headache")) {
          suggestedSpecialization = "Neurologist";
        } else if (symptoms.toLowerCase().includes("fever")) {
          suggestedSpecialization = "General Physician";
        } else if (symptoms.toLowerCase().includes("pain")) {
          suggestedSpecialization = "Orthopedic";
        }

        setDoctorSuggestion(`👨‍⚕️ Suggested Doctor: ${suggestedSpecialization}`);

        // ✅ Automatically redirect to search page with suggested specialization
        setTimeout(() => {
          router.push(
            `/pages/patient/searchdocs?specialization=${encodeURIComponent(
              suggestedSpecialization
            )}`
          );
        }, 3000);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-teal-400">💊 Enter Your Symptoms</h1>

      {/* Input Field */}
      <Input
        type="text"
        placeholder="e.g. Headache, fever"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="w-full max-w-md border-gray-600 bg-gray-800 text-white"
      />

      {/* Get Recommendations Button */}
      <Button
        onClick={getRecommendations}
        disabled={loading || !symptoms.trim()}
        className="w-full max-w-md bg-blue-500 hover:bg-blue-400"
      >
        {loading ? "Analyzing..." : "Get Recommendations"}
      </Button>

      {/* Loading Skeleton */}
      {loading && (
        <div className="w-full max-w-md">
          <Skeleton className="h-20 mb-2" />
          <Skeleton className="h-4 mb-2" />
          <Skeleton className="h-4" />
        </div>
      )}

      {/* Recommendations Display */}
      {recommendations && (
        <Card className="w-full max-w-md mt-4 border border-gray-700 bg-gray-800">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-yellow-400">📝 Recommendations:</h2>
            <Separator className="my-2" />
            <pre className="text-sm whitespace-pre-wrap text-gray-300">{recommendations}</pre>
            <p className="text-sm text-green-400 mt-2">{doctorSuggestion}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Doctor Button */}
      <Button
        onClick={() =>
          router.push(
            `/pages/patient/searchdocs?specialization=${encodeURIComponent(
              doctorSuggestion?.replace("👨‍⚕️ Suggested Doctor: ", "") || "Specialist"
            )}`
          )
        }
        variant="outline"
        className="w-full max-w-md border-gray-600 text-black hover:bg-gray-700"
      >
        🔍 Search for Doctor
      </Button>
    </div>
  );
}

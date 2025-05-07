"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommendations");
      const data = await res.json();
      if (res.ok) {
        setRecommendations(data.recommendations);
      } else {
        alert(data.error || "Failed to fetch recommendations.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🩺 AI Health Recommendations Based on Your Medical Report History</h2>
      <Button className="mb-4 bg-blue-500 hover:bg-blue-400" onClick={fetchRecommendations} disabled={loading}>
        {loading ? "Generating..." : "Get Recommendations"}
      </Button>
      <ScrollArea className="h-80 bg-gray-800 text-white p-4 rounded-lg">
        {recommendations ? (
          <pre className="whitespace-pre-wrap">{recommendations}</pre>
        ) : (
          <p className="text-gray-400">No recommendations available. Click to generate.</p>
        )}
      </ScrollArea>
    </div>
  );
}

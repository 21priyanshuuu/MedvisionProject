"use client";
import { useEffect, useState } from "react";

export default function RecommendationsPage() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const res = await fetch("/api/recommendations");
                const data = await res.json();

                if (res.ok) {
                    setRecommendations(data.recommendations || []);
                } else {
                    throw new Error(data.error || "Failed to fetch recommendations");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    Future Health Recommendations 🏥
                </h1>

                {loading ? (
                    <p className="text-center text-gray-600">Loading recommendations...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : recommendations.length > 0 ? (
                    <ul className="space-y-3">
                        {recommendations.map((rec, index) => (
                            <li 
                                key={index} 
                                className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm"
                            >
                                <span className="font-medium text-blue-900">{rec}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 text-center">No recommendations available.</p>
                )}
            </div>
        </div>
    );
}

"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    role: "",
    walletAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch("/api/auth/session");
        const sessionData = await response.json();

        if (sessionData.isAuthenticated && sessionData.user) {
          const email = sessionData.user.email;

          // Fetch user details from the database using the correct endpoint
          const userRes = await fetch(`/api/users?email=${email}`);
          const userData = await userRes.json();

          if (userRes.ok && userData) {
            setUser({
              name: userData.name,
              email: userData.email,
              gender: userData.gender,
              age: userData.age,
              role: userData.role,
              walletAddress: userData.walletAddress,
            });
          } else {
            setError(userData.error || "User not found in the database.");
          }
        } else {
          setError("User is not authenticated.");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-blue-400">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-10 px-6">
      {/* Profile Header */}
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-400">👤 User Profile</h1>

      {/* Profile Details */}
      <div className="max-w-xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <Card className="bg-gray-900 text-gray-100">
          <CardHeader>
            <CardTitle className="text-xl">User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p><strong>Name:</strong> {user.name}</p>
            </div>
            <div>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div>
              <p><strong>Gender:</strong> {user.gender}</p>
            </div>
            <div>
              <p><strong>Age:</strong> {user.age}</p>
            </div>
            <div>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
            <div>
              <p><strong>Wallet Address:</strong></p>
              <p className="break-all text-sm">{user.walletAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

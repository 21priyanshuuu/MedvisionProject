"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// 🟡 Enhanced User Profile Page with ShadCN Styling
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [medicalReports, setMedicalReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch User Profile and Reports
  useEffect(() => {
    async function fetchData() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (sessionData.isAuthenticated && sessionData.user) {
          const email = sessionData.user.email;

          const [userRes, reportsRes] = await Promise.all([
            fetch(`/api/users?email=${email}`),
            fetch(`/api/reports?email=${email}`),
          ]);

          const userData = await userRes.json();
          const reportsData = await reportsRes.json();

          if (userRes.ok) setUser(userData);
          if (reportsRes.ok) setMedicalReports(reportsData);
        } else {
          setError("User is not authenticated.");
        }
      } catch (error) {
        setError("Failed to load profile or reports.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 🟡 Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="w-96 h-96 rounded-lg" />
      </div>
    );
  }

  // 🔴 Error State
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 py-10 px-4 md:px-10">
      {/* 🟡 Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 💙 Left: User Profile Section */}
        <Card className="bg-gray-800 border border-gray-700 shadow-xl transition hover:shadow-2xl">
          <CardHeader className="flex items-center gap-4">
            <Avatar className="w-24 h-24 ring-2 ring-blue-400">
              <AvatarFallback className="bg-blue-600 text-white text-3xl">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold text-blue-300">
                {user.name || "Unknown User"}
              </h2>
              <p className="text-gray-400">{user.email}</p>
              <Badge variant="secondary" className="mt-2 px-3 py-1 text-sm">
                {user.role?.toUpperCase() || "PATIENT"}
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 mt-4 text-gray-300">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <strong className="text-gray-400">Gender:</strong>{" "}
                {user.gender || "N/A"}
              </p>
              <p>
                <strong className="text-gray-400">Age:</strong>{" "}
                {user.age || "N/A"}
              </p>
              <p>
                <strong className="text-gray-400">Role:</strong>{" "}
                {user.role || "N/A"}
              </p>
              {/* <p>
                <strong className="text-gray-400">Wallet:</strong>{" "}
                <span className="text-sm break-all">
                  {user.walletAddress || "Not Linked"}
                </span>
              </p> */}
            </div>
            {/* Recommendations Button */}
            <Button
              className="w-full bg-blue-500 hover:bg-blue-400 transition"
              size="lg"
              onClick={() => router.push("/pages/recommendations")}
            >
              💡 Get AI Recommendations on your Previous Medical Reports
            </Button>
          </CardContent>
        </Card>

        {/* 🟢 Right: Medical Reports Section */}
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-teal-400 mb-4">
            🩺 Previous Medical Reports
          </h2>
          <ScrollArea className="h-[450px] border border-gray-700 rounded-lg bg-gray-800">
            {medicalReports.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                No medical reports found.
              </div>
            ) : (
              <div className="space-y-4 px-4 py-2">
                {medicalReports.map((report) => (
                  <Card
                    key={report._id}
                    className="bg-gray-900 border border-gray-700 hover:border-teal-400 transition"
                  >
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold text-yellow-300">
                        🩹 {report.diagnosis}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-700"
                      >
                        {new Date(report.createdAt).toLocaleDateString()}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Observations */}
                      <div>
                        <p className="text-gray-300 font-semibold">
                          📝 Observations:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-400">
                          {report.observations.map((obs, idx) => (
                            <li key={idx}>{obs}</li>
                          ))}
                        </ul>
                      </div>
                      {/* Conditions */}
                      <div>
                        <p className="text-yellow-400 font-semibold">
                          💡 Potential Conditions:
                        </p>
                        <ul className="list-disc list-inside text-sm text-yellow-500">
                          {report.potential_conditions.map((cond, idx) => (
                            <li key={idx}>{cond}</li>
                          ))}
                        </ul>
                      </div>
                      {/* Areas of Concern */}
                      <div>
                        <p className="text-red-400 font-semibold">
                          ⚠️ Areas of Concern:
                        </p>
                        <ul className="list-disc list-inside text-sm text-red-500">
                          {report.areas_of_concern.map((area, idx) => (
                            <li key={idx}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

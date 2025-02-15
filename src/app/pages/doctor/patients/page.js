"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PatientListPage() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Automatically fetch doctor's appointments using session
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (sessionRes.ok && sessionData.user) {
          const email = sessionData.user.email;
          const res = await fetch(`/api/appointments?email=${email}&type=doctor`);
          const data = await res.json();
          if (res.ok) {
            setAppointments(data);
          } else {
            setMessage("Failed to load appointments.");
          }
        } else {
          setMessage("Doctor session not found.");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setMessage("Error loading appointments.");
      }
    }
    fetchAppointments();
  }, []);

  // ✅ Handle Appointment Status Update
  async function updateStatus(id, status) {
    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Appointment ${status} successfully!`);
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === id ? { ...appt, status } : appt
          )
        );
      } else {
        alert(data.error || "Failed to update appointment.");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Error updating appointment.");
    }
  }

  // 🟡 Show Message if No Appointments Found
  if (appointments.length === 0) {
    return <p className="text-center text-gray-400">No appointments found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        👨‍⚕️ Patient Appointments
      </h2>
      <Separator className="mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <Card
            key={appointment._id}
            className="bg-gray-800 text-gray-200 border border-gray-700"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {appointment.patientName}
              </CardTitle>
              <p className="text-sm text-gray-400">{appointment.patientEmail}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Date:</strong> {appointment.appointmentDate}
              </p>
              <p>
                <strong>Time:</strong> {appointment.appointmentTime}
              </p>
              <p>
                <strong>Reason:</strong> {appointment.reason}
              </p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <Badge
                  variant={
                    appointment.status?.toLowerCase() === "accepted"
                      ? "success"
                      : appointment.status?.toLowerCase() === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {appointment.status}
                </Badge>
              </p>

              {/* ✅ Accept & Reject Buttons */}
              {appointment.status?.toLowerCase() === "pending" && (
                <div className="flex gap-2">
                  <Button
                    className="bg-green-500 hover:bg-green-400"
                    onClick={() => updateStatus(appointment._id, "Accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-400"
                    onClick={() => updateStatus(appointment._id, "Rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

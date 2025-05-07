"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  // Automatically fetch patient appointments using session
  useEffect(() => {
    async function fetchAppointments() {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      if (sessionRes.ok && sessionData.user) {
        const email = sessionData.user.email;
        const res = await fetch(`/api/appointments?email=${email}&type=patient`);
        const data = await res.json();
        if (res.ok) {
          setAppointments(data);
        } else {
          setMessage("Failed to load appointments.");
        }
      } else {
        setMessage("Patient session not found.");
      }
    }
    fetchAppointments();
  }, []);

  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-400">No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-green-900 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-800">
        📅 My Appointments
      </h2>
      <Separator className="mb-6 bg-green-300" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <Card
            key={appointment._id}
            className="bg-green-50 text-green-900 border border-green-200 transition-transform transform hover:scale-105"
          >
            <CardHeader className="bg-green-100 rounded-t-lg p-4">
              <CardTitle className="text-xl font-semibold text-green-800">
                Dr. {appointment.doctorName}
              </CardTitle>
              <p className="text-sm text-green-600">{appointment.doctorEmail}</p>
            </CardHeader>
            <Separator className="bg-green-300" />
            <CardContent className="space-y-3 p-4">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

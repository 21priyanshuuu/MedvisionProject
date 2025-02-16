"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function DoctorSearchPage() {
  const searchParams = useSearchParams();
  const specializationFromURL = searchParams.get("specialization") || ""; // 🟡 Get from URL
  
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(specializationFromURL);
  const [locationQuery, setLocationQuery] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    patientName: "",
    patientEmail: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Fetch user session to pre-fill patient details
  useEffect(() => {
    async function fetchUserSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (res.ok && data.user) {
          setAppointmentDetails({
            ...appointmentDetails,
            patientName: data.user.given_name || "",
            patientEmail: data.user.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    }
    fetchUserSession();
  }, []);

  // ✅ Fetch all doctors from /api/doctors
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (res.ok) {
          setDoctors(data);
          // ✅ Auto-filter if URL has specialization
          if (specializationFromURL) {
            const results = data.filter((doc) =>
              doc.specialization.toLowerCase().includes(specializationFromURL.toLowerCase())
            );
            setFilteredDoctors(results);
          } else {
            setFilteredDoctors(data);
          }
        } else {
          setMessage("Failed to load doctors.");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setMessage("Error loading doctors.");
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [specializationFromURL]);

  // ✅ Handle search filtering on input change
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const results = doctors.filter(
      (doc) =>
        (doc.name.toLowerCase().includes(query) ||
          doc.specialization.toLowerCase().includes(query) ||
          doc.hospitalAffiliation.toLowerCase().includes(query)) &&
        (locationQuery ? doc.clinicLocation.toLowerCase().includes(locationQuery.toLowerCase()) : true) &&
        (maxFees ? doc.fees <= parseFloat(maxFees) : true)
    );
    setFilteredDoctors(results);
  }, [searchQuery, locationQuery, maxFees, doctors]);

  // ✅ Recommend doctors (by experience)
  const recommendDoctors = () => {
    const recommended = [...filteredDoctors].sort((a, b) => b.experience - a.experience);
    setFilteredDoctors(recommended);
  };

  // ✅ Handle booking dialog open
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenDialog(true);
  };

  // ✅ Handle submitting the appointment
  const handleSubmitAppointment = async () => {
    const payload = {
      ...appointmentDetails,
      doctorName: selectedDoctor.name,
      doctorEmail: selectedDoctor.email,
      acceptanceStatus: "Pending",
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setBookingMessage(data.message || "Appointment booked successfully!");
        setTimeout(() => {
          setOpenDialog(false);
          setBookingMessage("");
          setAppointmentDetails({
            patientName: "",
            patientEmail: "",
            appointmentDate: "",
            appointmentTime: "",
            reason: "",
          });
        }, 2000);
      } else {
        setBookingMessage(data.error || "Failed to book appointment.");
      }
    } catch (error) {
      setBookingMessage("Error booking appointment.");
    }
  };

  // 🔄 Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-blue-400">Loading doctors...</p>
      </div>
    );
  }

  // 🚫 Show error message
  if (message) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-400">{message}</p>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🔍 Find Your Doctor</h2>

      {/* Search Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Input
          className="w-full"
          type="text"
          placeholder="Search by name, specialization, or hospital..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Input
          className="w-full"
          type="text"
          placeholder="Search by location..."
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
        />
        <Input
          className="w-full"
          type="number"
          placeholder="Maximum fees ($)"
          value={maxFees}
          onChange={(e) => setMaxFees(e.target.value)}
        />
      </div>

      {/* Recommend Button */}
      <div className="flex justify-center mb-6">
        <Button className="bg-blue-500 hover:bg-blue-400" onClick={recommendDoctors}>
          Recommend Best (by Experience)
        </Button>
      </div>

      {/* Doctor Cards */}
      {filteredDoctors.length === 0 ? (
        <p className="text-center text-gray-400">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.email} className="bg-gray-800 text-gray-200 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{doctor.name}</CardTitle>
                <p className="text-sm text-gray-400">{doctor.specialization}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Location:</strong> {doctor.clinicLocation}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Fees:</strong> ${doctor.fees}</p>
                <p><strong>Contact:</strong> {doctor.contactNumber}</p>
                <p><strong>Hospital:</strong> {doctor.hospitalAffiliation}</p>
                <p><strong>Availability:</strong> {doctor.availability}</p>
                <Button className="bg-green-500 hover:bg-green-400 mt-2" onClick={() => handleBookAppointment(doctor)}>
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Appointment Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogTitle>📅 Book Appointment with Dr. {selectedDoctor?.name}</DialogTitle>

          {/* Auto-filled Name and Email */}
          <Input type="text" placeholder="Your Name" value={appointmentDetails.patientName} disabled />
          <Input type="email" placeholder="Your Email" value={appointmentDetails.patientEmail} disabled />

          {/* Appointment Date & Time */}
          <Input
            type="date"
            value={appointmentDetails.appointmentDate}
            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, appointmentDate: e.target.value })}
          />
          <Input
            type="time"
            value={appointmentDetails.appointmentTime}
            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, appointmentTime: e.target.value })}
          />

          {/* Reason for Appointment */}
          <Input
            type="text"
            placeholder="Reason for Appointment"
            value={appointmentDetails.reason}
            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, reason: e.target.value })}
          />

          {/* Booking Message */}
          {bookingMessage && <p className="text-sm text-green-400">{bookingMessage}</p>}

          {/* Dialog Actions */}
          <DialogFooter>
            <Button className="bg-blue-500" onClick={handleSubmitAppointment}>Confirm Appointment</Button>
            <Button className="bg-gray-500" onClick={() => setOpenDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

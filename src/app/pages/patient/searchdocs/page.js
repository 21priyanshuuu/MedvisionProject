"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function DoctorSearchPage() {
  const searchParams = useSearchParams();
  const specializationFromURL = searchParams.get("specialization") || ""; // 🟡 Get from URL
 
  // Function to get color based on specialization
  const getSpecializationColor = (specialization) => {
    // Map of specializations to colors
    const colorMap = {
      "Cardiologist": "bg-blue-100 text-blue-800 border-blue-200",
      "cardiologist": "bg-blue-100 text-blue-800 border-blue-200",
      "Anaesthesiologist": "bg-purple-100 text-purple-800 border-purple-200",
      "Neurologist": "bg-red-100 text-red-800 border-red-200",
      "Radiologist": "bg-green-100 text-green-800 border-green-200",
      "Pediatrics": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Psychiatry": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Oncology": "bg-orange-100 text-orange-800 border-orange-200",
      "Gynecology": "bg-pink-100 text-pink-800 border-pink-200",
      "Ophthalmology": "bg-teal-100 text-teal-800 border-teal-200",
      "Urology": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Endocrinology": "bg-lime-100 text-lime-800 border-lime-200",
      "Gastroenterology": "bg-amber-100 text-amber-800 border-amber-200",
      "Pulmonology": "bg-sky-100 text-sky-800 border-sky-200",
      "Nephrology": "bg-violet-100 text-violet-800 border-violet-200",
      "Rheumatology": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
      "General Medicine": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "Family Medicine": "bg-green-100 text-green-800 border-green-200",
    };
   
    // Return the color for the specialization or a default color
    return colorMap[specialization] || "bg-gray-100 text-gray-800 border-gray-200";
  };
 
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(specializationFromURL);
  const [locationQuery, setLocationQuery] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
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
         
          // Extract unique specializations for dropdown
          const uniqueSpecializations = [...new Set(data.map(doc => doc.specialization))].filter(Boolean).sort();
          setSpecializations(uniqueSpecializations);
         
          // Set initial specialization if from URL
          if (specializationFromURL) {
            setSelectedSpecialization(specializationFromURL);
            const results = data.filter((doc) =>
              doc.specialization.toLowerCase().includes(specializationFromURL.toLowerCase())
            );
            setFilteredDoctors(results);
          } else {
            setSelectedSpecialization("all");
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
        (maxFees ? doc.fees <= parseFloat(maxFees) : true) &&
        (selectedSpecialization && selectedSpecialization !== "all" ? doc.specialization === selectedSpecialization : true)
    );
    setFilteredDoctors(results);
  }, [searchQuery, locationQuery, maxFees, selectedSpecialization, doctors]);
 
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
    <div className="min-h-screen bg-white text-green-900 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-800">🔍 Find Your Doctor</h2>
     
      {/* Active Filters Display */}
      {selectedSpecialization && selectedSpecialization !== "all" && (
        <div className="text-center mb-4">
          {(() => {
            const colorClasses = getSpecializationColor(selectedSpecialization);
            return (
              <span className={`inline-block ${colorClasses} px-3 py-1 rounded-full text-sm font-medium`}>
                Showing: {selectedSpecialization} Specialists
              </span>
            );
          })()}
        </div>
      )}
 
      {/* Search Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Input
          className="w-full border-green-300 focus:border-green-500"
          type="text"
          placeholder="Search by name, specialization, or hospital..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Input
          className="w-full border-green-300 focus:border-green-500"
          type="text"
          placeholder="Search by location..."
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
        />
        <Input
          className="w-full border-green-300 focus:border-green-500"
          type="number"
          placeholder="Maximum fees ($)"
          value={maxFees}
          onChange={(e) => setMaxFees(e.target.value)}
        />
       
        {/* Specialization Dropdown */}
        <Select
          value={selectedSpecialization}
          onValueChange={(value) => {
            setSelectedSpecialization(value);
            // Clear the search query if a specialization is selected
            if (value && value !== "all" && searchQuery) {
              setSearchQuery("");
            }
          }}
        >
          <SelectTrigger className="w-full border-green-300 focus:border-green-500 h-10">
            <SelectValue placeholder="Filter by specialization" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            <SelectItem value="all" className="font-semibold">All Specializations</SelectItem>
            <div className="h-px bg-gray-200 my-1"></div>
            {specializations.map((spec) => {
              const colorClasses = getSpecializationColor(spec);
              const bgClass = colorClasses.split(' ')[0];
              const textClass = colorClasses.split(' ')[1];
              
              return (
                <SelectItem key={spec} value={spec} className={`${bgClass} ${textClass} my-1 rounded`}>
                  {spec}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Recommend Button */}
      <div className="flex justify-center mb-6">
        <Button className="bg-green-600 hover:bg-green-500" onClick={recommendDoctors}>
          Recommend Best (by Experience)
        </Button>
      </div>

      {/* Doctor Cards */}
      {filteredDoctors.length === 0 ? (
        <p className="text-center text-green-400">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const specializationColor = getSpecializationColor(doctor.specialization);
            // Extract just the background color class
            const bgColorClass = specializationColor.split(' ')[0];
            const textColorClass = specializationColor.split(' ')[1];
            const borderColorClass = specializationColor.split(' ')[2];
            
            return (
              <Card key={doctor.email} className={`${bgColorClass} ${textColorClass} ${borderColorClass} shadow-md hover:shadow-lg transition-shadow duration-300`}>
                <CardHeader className="border-b border-opacity-20">
                  <CardTitle className="text-xl font-semibold">{doctor.name}</CardTitle>
                  <span className={`inline-block bg-white bg-opacity-50 ${textColorClass} px-2 py-1 rounded-full text-xs font-medium`}>
                    {doctor.specialization}
                  </span>
                </CardHeader>
                <CardContent className="space-y-2 pt-4">
                  <p><strong>Location:</strong> {doctor.clinicLocation}</p>
                  <p><strong>Experience:</strong> {doctor.experience} years</p>
                  <p><strong>Fees:</strong> ${doctor.fees}</p>
                  <p><strong>Contact:</strong> {doctor.contactNumber}</p>
                  <p><strong>Hospital:</strong> {doctor.hospitalAffiliation}</p>
                  <p><strong>Availability:</strong> {doctor.availability}</p>
                  <Button className="bg-white hover:bg-opacity-90 mt-2 w-full text-green-800 border border-current" onClick={() => handleBookAppointment(doctor)}>
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
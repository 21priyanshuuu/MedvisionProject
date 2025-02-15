"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorDetailsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    degree: "",
    clinicLocation: "",
    fees: "",
    contactNumber: "",
    hospitalAffiliation: "",
    availability: "",
    bio: "",
  });

  const [isProfileExists, setIsProfileExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Automatically fetch session and check doctor profile
  useEffect(() => {
    async function fetchDoctorDetails() {
      try {
        // ✅ Fetch user session
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (sessionRes.ok && sessionData.isAuthenticated && sessionData.user) {
          const { given_name, email } = sessionData.user;
          setFormData((prev) => ({
            ...prev,
            name: given_name || "",
            email: email || "",
          }));

          // ✅ Check if doctor profile exists
          const profileRes = await fetch(`/api/doctors?email=${email}`);
          const profileData = await profileRes.json();

          if (profileRes.ok && profileData.name) {
            setFormData(profileData);
            setIsProfileExists(true);
          } else {
            setIsProfileExists(false);
          }
        } else {
          setMessage("Session not found. Please login.");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctorDetails();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle profile creation
  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Doctor profile created successfully!");
        window.location.reload(); // ✅ Reload the page after creation
      } else {
        setMessage(data.error || "Failed to create profile.");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setMessage("Error creating profile.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle profile update
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/doctors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Doctor profile updated successfully!");
        window.location.reload(); // ✅ Reload the page after update
      } else {
        setMessage(data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
      setIsEditing(false); // Exit editing mode
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-blue-400">Loading...</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-400">{message}</p>
      </div>
    );
  }

  // ✅ Show Doctor Profile with Option to Edit
  if (isProfileExists && !isEditing) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">👨‍⚕️ Doctor Profile</h2>
        <Card className="bg-gray-800 text-gray-200">
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Specialization:</strong> {formData.specialization}</p>
            <p><strong>Experience:</strong> {formData.experience} years</p>
            <p><strong>Degree:</strong> {formData.degree}</p>
            <p><strong>Clinic Location:</strong> {formData.clinicLocation}</p>
            <p><strong>Fees:</strong> ${formData.fees}</p>
            <p><strong>Contact:</strong> {formData.contactNumber}</p>
            <p><strong>Hospital Affiliation:</strong> {formData.hospitalAffiliation}</p>
            <p><strong>Availability:</strong> {formData.availability}</p>
            <p><strong>Bio:</strong> {formData.bio}</p>
          </CardContent>
        </Card>
        <Button
          onClick={() => setIsEditing(true)}
          className="w-full bg-yellow-500 hover:bg-yellow-400 mt-4"
        >
          Edit Profile
        </Button>
      </div>
    );
  }

  // ✅ Show Doctor Creation/Update Form
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isProfileExists ? "✏️ Update Doctor Profile" : "👨‍⚕️ Create Doctor Profile"}
      </h2>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input name="name" value={formData.name} placeholder="Full Name" disabled />
        </div>

        <div>
          <Label>Email</Label>
          <Input name="email" value={formData.email} placeholder="Email" disabled />
        </div>

        <div>
          <Label>Specialization</Label>
          <Input
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="e.g. Cardiologist"
          />
        </div>

        <div>
          <Label>Experience (Years)</Label>
          <Input
            name="experience"
            type="number"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Years of experience"
          />
        </div>

        <div>
          <Label>Degree</Label>
          <Input
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="e.g. MBBS, MD"
          />
        </div>

        <div>
          <Label>Clinic Location</Label>
          <Input
            name="clinicLocation"
            value={formData.clinicLocation}
            onChange={handleChange}
            placeholder="e.g. Apollo Hospital, Mumbai"
          />
        </div>

        <div>
          <Label>Consultation Fees ($)</Label>
          <Input
            name="fees"
            type="number"
            value={formData.fees}
            onChange={handleChange}
            placeholder="e.g. 500"
          />
        </div>

        <div>
          <Label>Contact Number</Label>
          <Input
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="e.g. +91 9876543210"
          />
        </div>

        <div>
          <Label>Hospital Affiliation</Label>
          <Input
            name="hospitalAffiliation"
            value={formData.hospitalAffiliation}
            onChange={handleChange}
            placeholder="e.g. AIIMS"
          />
        </div>

        <div>
          <Label>Availability</Label>
          <Input
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="e.g. Mon-Fri 10AM-5PM"
          />
        </div>

        <div>
          <Label>Bio</Label>
          <Input
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Short profile summary"
          />
        </div>

        {/* Submit or Update Button */}
        {isProfileExists ? (
          <Button
            onClick={handleUpdate}
            className="w-full bg-yellow-500 hover:bg-yellow-400"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            className="w-full bg-green-600 hover:bg-green-500"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Profile"}
          </Button>
        )}

        {/* Cancel Edit Button */}
        {isEditing && (
          <Button
            onClick={() => setIsEditing(false)}
            className="w-full bg-red-500 hover:bg-red-400 mt-2"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

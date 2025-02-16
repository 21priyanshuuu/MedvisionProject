"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// 🟡 Enhanced Doctor Profile Page
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
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (sessionRes.ok && sessionData.isAuthenticated && sessionData.user) {
          const { given_name, email } = sessionData.user;
          setFormData((prev) => ({
            ...prev,
            name: given_name || "",
            email: email || "",
          }));

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
        window.location.reload();
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
        window.location.reload();
      } else {
        setMessage(data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  // 🟡 Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-lg text-blue-400">Loading...</p>
      </div>
    );
  }

  // 🔴 Error State
  if (message) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-lg text-red-400">{message}</p>
      </div>
    );
  }

  // ✅ Show Doctor Profile with Option to Edit
  if (isProfileExists && !isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">👨‍⚕️ Doctor Profile</h2>

        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader className="flex items-center gap-4">
            <Avatar className="w-20 h-20 bg-teal-500 text-xl">
              <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-semibold text-yellow-300">{formData.name}</CardTitle>
              <p className="text-gray-400 text-sm">{formData.email}</p>
              <Badge className="mt-2 bg-teal-600">{formData.specialization}</Badge>
            </div>
          </CardHeader>

          <Separator className="my-4 border-gray-600" />

          <CardContent className="grid grid-cols-2 gap-4 text-gray-300 text-sm">
            <p><strong>📚 Degree:</strong> {formData.degree}</p>
            <p><strong>🏥 Hospital:</strong> {formData.hospitalAffiliation}</p>
            <p><strong>📍 Location:</strong> {formData.clinicLocation}</p>
            <p><strong>💵 Fees:</strong> ${formData.fees}</p>
            <p><strong>📞 Contact:</strong> {formData.contactNumber}</p>
            <p><strong>🕒 Availability:</strong> {formData.availability}</p>
            <p><strong>🔬 Experience:</strong> {formData.experience} years</p>
            <p className="col-span-2"><strong>📝 Bio:</strong> {formData.bio}</p>
          </CardContent>
        </Card>

        {/* Edit Profile Button */}
        <Button
          onClick={() => setIsEditing(true)}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold mt-6"
        >
          ✏️ Edit Profile
        </Button>
      </div>
    );
  }

  // ✅ Show Doctor Creation/Update Form
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">
        {isProfileExists ? "✏️ Update Doctor Profile" : "👨‍⚕️ Create Doctor Profile"}
      </h2>

      <ScrollArea className="h-[500px] border border-gray-700 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400">Name</Label>
            <Input name="name" value={formData.name} placeholder="Full Name" disabled className="bg-gray-800" />
          </div>

          <div>
            <Label className="text-gray-400">Email</Label>
            <Input name="email" value={formData.email} placeholder="Email" disabled className="bg-gray-800" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400">Specialization</Label>
            <Input
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              className="bg-gray-800"
            />
          </div>

          <div>
            <Label className="text-gray-400">Experience (Years)</Label>
            <Input
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Years of experience"
              className="bg-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400">Degree</Label>
            <Input
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="e.g. MBBS, MD"
              className="bg-gray-800"
            />
          </div>

          <div>
            <Label className="text-gray-400">Contact Number</Label>
            <Input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="bg-gray-800"
            />
          </div>
        </div>

        <div>
          <Label className="text-gray-400">Hospital Affiliation</Label>
          <Input
            name="hospitalAffiliation"
            value={formData.hospitalAffiliation}
            onChange={handleChange}
            placeholder="e.g. AIIMS"
            className="bg-gray-800"
          />
        </div>

        <div>
          <Label className="text-gray-400">Clinic Location</Label>
          <Input
            name="clinicLocation"
            value={formData.clinicLocation}
            onChange={handleChange}
            placeholder="e.g. Apollo Hospital, Mumbai"
            className="bg-gray-800"
          />
        </div>

        <div>
          <Label className="text-gray-400">Availability</Label>
          <Input
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="e.g. Mon-Fri 10AM-5PM"
            className="bg-gray-800"
          />
        </div>

        <div>
          <Label className="text-gray-400">Bio</Label>
          <Input
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Short profile summary"
            className="bg-gray-800"
          />
        </div>

        {/* Submit or Update Button */}
        {isProfileExists ? (
          <Button
            onClick={handleUpdate}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold mt-4"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold mt-4"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Profile"}
          </Button>
        )}

        {/* Cancel Edit Button */}
        {isEditing && (
          <Button
            onClick={() => setIsEditing(false)}
            className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold mt-2"
          >
            Cancel
          </Button>
        )}
      </ScrollArea>
    </div>
  );
}

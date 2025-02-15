"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch user details from KindeAuth on component mount
  useEffect(() => {
    async function fetchUserFromKinde() {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();

        if (data.isAuthenticated && data.user) {
          const { email, given_name } = data.user;
          setFormData((prev) => ({
            ...prev,
            name: given_name || "",
            email: email || "",
          }));

          // Check if user already exists
          const checkRes = await fetch(`/api/users/check?email=${email}`);
          const checkData = await checkRes.json();

          if (checkData.exists) {
            // User exists - redirect to home
            router.push("/");
          } else {
            // User doesn't exist - show form
            setShowForm(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user details from Kinde:", error);
      }
    }
    fetchUserFromKinde();
  }, [router]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, gender, age, role } = formData;

    if (!name || !email || !gender || !age || !role) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        router.push("/");
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  // Render form only if `showForm` is true
  if (!showForm) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-300">Checking user information...</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input (Auto-filled from Kinde) */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            className="mt-2 bg-gray-800 border-gray-600"
            value={formData.name}
            onChange={handleChange}
            disabled
          />
        </div>

        {/* Email Input (Auto-filled from Kinde) */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="mt-2 bg-gray-800 border-gray-600"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
        </div>

        {/* Gender Input */}
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger className="mt-2 bg-gray-800 border-gray-600">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white">
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age Input */}
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            type="number"
            id="age"
            name="age"
            placeholder="Enter your age"
            className="mt-2 bg-gray-800 border-gray-600"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role Selection */}
        <div>
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger className="mt-2 bg-gray-800 border-gray-600">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white">
              <SelectItem value="Patient">Patient</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Hospital">Hospital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}

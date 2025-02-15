"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(result.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Header */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400">📞 Contact Us</h1>
        <p className="text-lg text-gray-300 mt-4">
          Have questions? We're here to help!
        </p>
      </section>

      {/* Contact Info */}
      <section className="flex flex-col md:flex-row justify-around items-center px-6 py-10">
        {/* Info Cards */}
        <div className="flex flex-col space-y-6 mb-6 md:mb-0">
          <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <FaMapMarkerAlt className="text-red-500 text-3xl" />
            <div>
              <p className="font-bold text-lg">Our Address</p>
              <p className="text-sm text-gray-300">123 Blockchain Street, Pune, India</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <FaPhoneAlt className="text-green-500 text-3xl" />
            <div>
              <p className="font-bold text-lg">Phone</p>
              <p className="text-sm text-gray-300">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <FaEnvelope className="text-yellow-500 text-3xl" />
            <div>
              <p className="font-bold text-lg">Email</p>
              <p className="text-sm text-gray-300">support@healthchain.io</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full md:w-2/3 lg:w-1/2 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-blue-300">📝 Send Us a Message</h2>
          {status && (
            <p
              className={`mb-4 text-center ${
                status.includes("successfully") ? "text-green-400" : "text-red-400"
              }`}
            >
              {status}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="mt-2 bg-gray-800 border-gray-600"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
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
                required
              />
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Enter your message"
                className="mt-2 bg-gray-800 border-gray-600"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500"
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-10 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-green-300">📍 Visit Us</h2>
        <div className="h-64 w-full rounded-lg overflow-hidden shadow-lg">
          {/* Placeholder for map - can be replaced with Google Maps iframe */}
          <img
            src="https://via.placeholder.com/800x300?text=Map+Placeholder"
            alt="Map location"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-10 px-4 bg-gray-900">
        <h2 className="text-4xl font-semibold mb-4 text-blue-400">Join Us in Revolutionizing Healthcare!</h2>
        <p className="text-gray-300 mb-6">Blockchain-powered healthcare data management for a better tomorrow.</p>
        <Button className="bg-blue-600 hover:bg-blue-500 text-lg">
          <a href="/register">Get Started</a>
        </Button>
      </section>
    </div>
  );
}

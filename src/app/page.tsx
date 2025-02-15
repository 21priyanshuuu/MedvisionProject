"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaLock, FaHeartbeat, FaUserMd, FaHospital, FaShieldAlt, FaClock } from "react-icons/fa";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-blue-400 animate-fadeIn">
          Blockchain-Powered Healthcare Management
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6">
          Secure, transparent, and efficient healthcare data management with the power of blockchain.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-500 text-lg">
          <Link href="/register">Get Started</Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-semibold mb-10 text-center text-blue-300">⚙️ Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl text-blue-500 mb-4">
                <FaLock />
              </div>
              <CardTitle>Secure Data Storage</CardTitle>
            </CardHeader>
            <CardContent>
              Blockchain encryption ensures sensitive healthcare data remains tamper-proof and secure.
            </CardContent>
          </Card>

          <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl text-green-500 mb-4">
                <FaHeartbeat />
              </div>
              <CardTitle>Patient-Centric Access</CardTitle>
            </CardHeader>
            <CardContent>
              Patients have full control over who accesses their healthcare data.
            </CardContent>
          </Card>

          <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl text-yellow-500 mb-4">
                <FaClock />
              </div>
              <CardTitle>Real-Time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              Data synchronization across hospitals, clinics, and pharmacies in real-time.
            </CardContent>
          </Card>

          <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl text-pink-500 mb-4">
                <FaShieldAlt />
              </div>
              <CardTitle>Immutable Records</CardTitle>
            </CardHeader>
            <CardContent>
              Records are immutable, preventing unauthorized alterations.
            </CardContent>
          </Card>

          <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl text-purple-500 mb-4">
                <FaHospital />
              </div>
              <CardTitle>Hospital Management</CardTitle>
            </CardHeader>
            <CardContent>
              Centralized management for appointments, patient records, and staff details.
            </CardContent>
          </Card>

          <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl text-teal-500 mb-4">
                <FaUserMd />
              </div>
              <CardTitle>Doctor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              Verify and authenticate healthcare professionals using blockchain.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Blockchain Section */}
      <section className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-green-300">🛠️ Why Blockchain for Healthcare?</h2>
        <p className="text-lg text-gray-300 mb-4">
          Traditional healthcare systems often struggle with fragmented records and data breaches. Blockchain technology 
          ensures:
        </p>
        <ul className="list-disc list-inside text-gray-200 text-left mx-auto max-w-xl">
          <li className="mb-2">🔐 **Data Security:** End-to-end encryption for patient records.</li>
          <li className="mb-2">🚑 **Interoperability:** Seamless access across institutions.</li>
          <li className="mb-2">📜 **Transparency:** Audit trails for all data modifications.</li>
          <li className="mb-2">✅ **Patient Control:** Patients can grant/revoke access anytime.</li>
        </ul>
      </section>

      {/* User Roles Section */}
      <section className="py-16 px-6 bg-gray-800">
        <h2 className="text-3xl font-semibold text-center mb-10 text-yellow-300">👥 User Roles</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Card className="w-64 bg-gray-700 text-white hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl mb-4 text-blue-400">
                <FaHeartbeat />
              </div>
              <CardTitle>Patients</CardTitle>
            </CardHeader>
            <CardContent>
              Access and control your health records securely.
            </CardContent>
          </Card>

          <Card className="w-64 bg-gray-700 text-white hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl mb-4 text-green-400">
                <FaUserMd />
              </div>
              <CardTitle>Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              View patient records with permission and update diagnoses.
            </CardContent>
          </Card>

          <Card className="w-64 bg-gray-700 text-white hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl mb-4 text-pink-400">
                <FaHospital />
              </div>
              <CardTitle>Hospital Admins</CardTitle>
            </CardHeader>
            <CardContent>
              Manage hospital resources and staff efficiently.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10 text-purple-300">🌟 What Our Users Say</h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 p-6 mb-4 rounded-lg shadow-md">
            <p className="text-lg italic">"This system has transformed our hospital operations with unparalleled efficiency."</p>
            <p className="text-sm text-right mt-2">- Dr. Rakesh Sharma</p>
          </div>
          <div className="bg-gray-800 p-6 mb-4 rounded-lg shadow-md">
            <p className="text-lg italic">"I can access my health records whenever needed without hassle."</p>
            <p className="text-sm text-right mt-2">- Sneha Patil, Patient</p>
          </div>
          <div className="bg-gray-800 p-6 mb-4 rounded-lg shadow-md">
            <p className="text-lg italic">"Blockchain ensures the integrity of our medical records."</p>
            <p className="text-sm text-right mt-2">- Ananya Singh, Hospital Admin</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-10 px-4 bg-gray-900">
        <h2 className="text-4xl font-semibold mb-4 text-blue-400">Ready to Secure Your Healthcare Data?</h2>
        <p className="text-gray-300 mb-6">Join us in our mission to transform healthcare data management.</p>
        <Button className="bg-blue-600 hover:bg-blue-500 text-lg">
          <Link href="/register">Get Started</Link>
        </Button>
      </section>
    </div>
  );
}

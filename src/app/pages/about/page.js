"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHospitalUser, FaUserMd, FaHeartbeat, FaUserNurse } from "react-icons/fa";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-blue-400">Empowering Healthcare with Blockchain</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6">
          A secure, transparent, and efficient healthcare data management system powered by blockchain technology.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-lg">
          <Link href="/register">Get Started</Link>
        </Button>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto text-center py-12 px-6">
        <h2 className="text-3xl font-semibold mb-6 text-blue-300">🌿 Our Mission</h2>
        <p className="text-lg text-gray-200 leading-relaxed">
          Our mission is to revolutionize the healthcare industry by introducing a decentralized, immutable, and secure 
          platform for managing patient records, hospital data, and doctor credentials. We believe in leveraging 
          blockchain technology to enhance transparency, efficiency, and patient-centric care.
        </p>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-10 text-blue-300">💡 Our Services</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Card className="w-64 bg-gray-700 text-white hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl mb-4 text-blue-400">
                <FaHospitalUser />
              </div>
              <CardTitle>Hospital Management</CardTitle>
            </CardHeader>
            <CardContent>
              Streamline hospital operations, manage resources, and improve patient outcomes with real-time insights.
            </CardContent>
          </Card>

          <Card className="w-64 bg-gray-700 text-white hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl mb-4 text-green-400">
                <FaUserMd />
              </div>
              <CardTitle>Doctor Management</CardTitle>
            </CardHeader>
            <CardContent>
              Manage doctor profiles, track certifications, and access authorized patient records securely.
            </CardContent>
          </Card>

          <Card className="w-64 bg-gray-700 text-white hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl mb-4 text-pink-400">
                <FaHeartbeat />
              </div>
              <CardTitle>Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              Enable patients to access their medical history, grant permissions, and control data sharing easily.
            </CardContent>
          </Card>

          <Card className="w-64 bg-gray-700 text-white hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="text-5xl mb-4 text-yellow-400">
                <FaUserNurse />
              </div>
              <CardTitle>Secure Data Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              Leverage blockchain encryption to ensure the confidentiality and integrity of healthcare data.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-gray-800">
        <h2 className="text-3xl font-semibold text-center mb-10 text-blue-300">👩‍⚕️ Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-40 text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full mb-3 border-4 border-blue-400"
            />
            <p className="font-medium">Tanay</p>
            <p className="text-sm text-gray-300">Founder & Blockchain Developer</p>
          </div>
          <div className="w-40 text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full mb-3 border-4 border-green-400"
            />
            <p className="font-medium">Aryan</p>
            <p className="text-sm text-gray-300">Healthcare Specialist</p>
          </div>
          <div className="w-40 text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full mb-3 border-4 border-pink-400"
            />
            <p className="font-medium">Riya</p>
            <p className="text-sm text-gray-300">UI/UX Designer</p>
          </div>
          <div className="w-40 text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full mb-3 border-4 border-yellow-400"
            />
            <p className="font-medium">Vikram</p>
            <p className="text-sm text-gray-300">Blockchain Architect</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-10 px-4 bg-gray-900">
        <h2 className="text-3xl font-semibold mb-4 text-blue-400">Ready to Secure Your Healthcare Data?</h2>
        <p className="text-gray-300 mb-6">Join us in our mission to transform healthcare data management.</p>
        <Button className="bg-blue-600 hover:bg-blue-500 text-lg">
          <Link href="/register">Get Started</Link>
        </Button>
      </section>
    </div>
  );
}

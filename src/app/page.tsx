"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaLock, FaHeartbeat, FaUserMd, FaHospital, FaShieldAlt, FaClock } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-green-700">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-20 px-4"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-5xl md:text-6xl font-bold mb-4 text-green-600"
        >
          A.I.-Powered Healthcare Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-lg md:text-xl text-green-400 mb-6"
        >
          Secure, transparent, and efficient healthcare data management with the power of A.I..
        </motion.p>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button className="bg-blue-600 hover:bg-blue-500 text-lg">
            <Link href="/register">Get Started</Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto py-16 px-6"
      >
        <motion.h2
          className="text-3xl font-semibold mb-10 text-center text-green-800"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ⚙️ Key Features
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaLock className="text-5xl text-green-600 mb-4" />,
              title: "Secure Data Storage",
              description: "A.I. encryption ensures sensitive healthcare data remains tamper-proof and secure."
            },
            {
              icon: <FaHeartbeat className="text-5xl text-green-600 mb-4" />,
              title: "Patient-Centric Access",
              description: "Patients have full control over who accesses their healthcare data."
            },
            {
              icon: <FaClock className="text-5xl text-green-600 mb-4" />,
              title: "Real-Time Updates",
              description: "Data synchronization across hospitals, clinics, and pharmacies in real-time."
            },
            {
              icon: <FaShieldAlt className="text-5xl text-green-600 mb-4" />,
              title: "Immutable Records",
              description: "Records are immutable, preventing unauthorized alterations."
            },
            {
              icon: <FaHospital className="text-5xl text-green-600 mb-4" />,
              title: "Hospital Management",
              description: "Centralized management for appointments, patient records, and staff details."
            },
            {
              icon: <FaUserMd className="text-5xl text-green-600 mb-4" />,
              title: "Doctor Authentication",
              description: "Verify and authenticate healthcare professionals using A.I.."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-green-50 hover:bg-green-100 transition-colors duration-300 p-6 rounded-lg shadow-lg">
                <CardHeader className="flex flex-col items-center">
                  {feature.icon}
                  <CardTitle className="text-xl font-bold text-green-800 mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-green-700 mt-2">{feature.description}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Why A.I. Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-5xl mx-auto py-16 px-6 text-center"
      >
        <motion.h2
          className="text-3xl font-semibold mb-6 text-green-800"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🛠️ Why A.I. for Healthcare?
        </motion.h2>
        <motion.p
          className="text-lg text-green-700 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Traditional healthcare systems often struggle with fragmented records and data breaches. A.I. technology ensures:
        </motion.p>
        <motion.ul
          className="list-disc list-inside text-green-700 text-left mx-auto max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <li className="mb-2">🔐 Data Security: End-to-end encryption for patient records.</li>
          <li className="mb-2">🚑 Interoperability: Seamless access across institutions.</li>
          <li className="mb-2">📜 Transparency: Audit trails for all data modifications.</li>
          <li className="mb-2">✅ Patient Control: Patients can grant/revoke access anytime.</li>
        </motion.ul>
      </motion.section>

      {/* User Roles Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-6 bg-green-50"
      >
        <motion.h2
          className="text-3xl font-semibold text-center mb-10 text-green-800"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          👥 User Roles
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              icon: <FaHeartbeat className="text-5xl text-blue-400 mb-4" />,
              title: "Patients",
              description: "Access and control your health records securely."
            },
            {
              icon: <FaUserMd className="text-5xl text-green-400 mb-4" />,
              title: "Doctors",
              description: "View patient records with permission and update diagnoses."
            },
            {
              icon: <FaHospital className="text-5xl text-pink-400 mb-4" />,
              title: "Hospital Admins",
              description: "Manage hospital resources and staff efficiently."
            }
          ].map((role, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-64 bg-green-50 text-green-900 hover:bg-green-100 transition-colors duration-300 p-6 rounded-lg shadow-lg">
                <CardHeader className="flex flex-col items-center">
                  {role.icon}
                  <CardTitle className="text-xl font-bold text-green-800 mt-4">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-green-700 mt-2">{role.description}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-6"
      >
        <motion.h2
          className="text-3xl font-semibold text-center mb-10 text-green-800"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🌟 What Our Users Say
        </motion.h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              quote: "This system has transformed our hospital operations with unparalleled efficiency.",
              author: "Dr. Rakesh Sharma"
            },
            {
              quote: "I can access my health records whenever needed without hassle.",
              author: "Sneha Patil, Patient"
            },
            {
              quote: "A.I. ensures the integrity of our medical records.",
              author: "Ananya Singh, Hospital Admin"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-green-50 p-6 rounded-lg shadow-md hover:bg-green-100 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg italic">"{testimonial.quote}"</p>
              <p className="text-sm text-right mt-2">- {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center py-10 px-4 bg-white"
      >
        <motion.h2
          className="text-4xl font-semibold mb-4 text-green-800"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Ready to Secure Your Healthcare Data?
        </motion.h2>
        <motion.p
          className="text-green-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Join us in our mission to transform healthcare data management.
        </motion.p>
        <Button className="bg-blue-600 hover:bg-blue-500 text-lg">
          <Link href="/register">Get Started</Link>
        </Button>
      </motion.section>
    </div>
  );
}
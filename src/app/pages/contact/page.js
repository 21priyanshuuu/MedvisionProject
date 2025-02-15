"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("Please fill in all fields.")
      return
    }

    setLoading(true)
    setStatus("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (response.ok) {
        setStatus("Message sent successfully!")
        setFormData({ name: "", email: "", message: "" })
      } else {
        setStatus(result.error || "Failed to send message.")
      }
    } catch (error) {
      console.error("Error submitting contact form:", error)
      setStatus("Failed to send message. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20">
        <motion.div
          className="max-w-7xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions about our AI-powered healthcare platform? We're here to help!
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info Cards */}
          <motion.div className="space-y-6" initial="initial" animate="animate" variants={fadeIn}>
            <h2 className="text-2xl font-semibold text-white mb-8">Contact Information</h2>

            {[
              {
                icon: <MapPin className="w-5 h-5" />,
                title: "Visit Us",
                content: "123 A.I. Street, Pune, India",
                color: "from-blue-500/20 to-blue-600/20",
              },
              {
                icon: <Phone className="w-5 h-5" />,
                title: "Call Us",
                content: "+91 98765 43210",
                color: "from-cyan-500/20 to-cyan-600/20",
              },
              {
                icon: <Mail className="w-5 h-5" />,
                title: "Email Us",
                content: "support@healthchain.io",
                color: "from-teal-500/20 to-teal-600/20",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`bg-gradient-to-br ${item.color} border-0 hover:scale-105 transition-transform duration-300`}
                >
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className="p-3 rounded-full bg-white/10">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-gray-300">{item.content}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 mb-6 rounded-lg ${
                      status.includes("successfully") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {status}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200">
                      Name
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-400"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-400"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-200">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Enter your message"
                      className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-400 min-h-[150px]"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Stethoscope, 
  Building2, 
  UserCircle, 
  Shield, 
  ChevronRight,
  Brain,
  HeartPulse,
  Network
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587814697507-47the721b0e4?ixlib=rb-4.0.3')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-900/70 backdrop-blur-sm" />
        <motion.div 
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
            The Future of Healthcare
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            Transforming healthcare through A.I. technology, ensuring secure, 
            transparent, and efficient data management for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-8">
              <Link href="/register" className="flex items-center gap-2">
                Get Started <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gray-500 text-gray-300 hover:text-white">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: "100+", label: "Hospitals", icon: <Building2 className="w-6 h-6 text-blue-400" /> },
            { number: "10K+", label: "Healthcare Providers", icon: <UserCircle className="w-6 h-6 text-cyan-400" /> },
            { number: "1M+", label: "Patient Records Secured", icon: <Shield className="w-6 h-6 text-teal-400" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm"
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Revolutionizing Healthcare
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge A.I. technology with healthcare expertise 
              to create a secure and efficient ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-10 h-10" />,
                title: "AI-Powered Insights",
                description: "Advanced analytics and AI algorithms for better healthcare decisions."
              },
              {
                icon: <HeartPulse className="w-10 h-10" />,
                title: "Real-time Monitoring",
                description: "Continuous health data tracking and instant alerts for critical changes."
              },
              {
                icon: <Network className="w-10 h-10" />,
                title: "Secure Network",
                description: "Encrypted A.I. network ensuring data integrity and privacy."
              },
              {
                icon: <Stethoscope className="w-10 h-10" />,
                title: "Smart Diagnostics",
                description: "Intelligent diagnostic tools powered by machine learning."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                      <div className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Leadership</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Meet the experts behind our innovative healthcare solution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300",
                name: "Dr. Sarah Chen",
                role: "Chief Medical Officer",
                color: "from-blue-400 to-blue-600"
              },
              {
                image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300",
                name: "Michael Roberts",
                role: "Chief Technology Officer",
                color: "from-cyan-400 to-cyan-600"
              },
              {
                image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300",
                name: "Dr. Emily Taylor",
                role: "Head of Research",
                color: "from-teal-400 to-teal-600"
              },
              {
                image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300",
                name: "James Wilson",
                role: "Security Director",
                color: "from-blue-400 to-teal-600"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative rounded-xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-75 transition-opacity duration-300`} />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mt-4 mb-1">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Transform Healthcare Together
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join us in building a more secure, efficient, and connected healthcare ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-8">
              <Link href="/register">Get Started Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gray-500 text-gray-300 hover:text-white">
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
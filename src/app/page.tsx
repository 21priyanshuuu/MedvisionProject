"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaLock, FaHeartbeat, FaUserMd, FaHospital, FaShieldAlt, FaClock, FaArrowDown } from "react-icons/fa";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { useCallback } from "react";

// Simplified animations using SVG icons instead of Lottie
const HealthcareIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-13h-2v4H7v2h4v4h2v-4h4v-2h-4V7z" fill="currentColor"/>
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l6 2.73v4.77c0 4.38-2.85 8.37-6 9.46-3.15-1.09-6-5.08-6-9.46V5.91l6-2.73z" fill="currentColor"/>
  </svg>
);

const PatientIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
  </svg>
);

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  // Setup mouse position for interactive elements
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Setup intersection observer refs for reveal animations
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [whyAIRef, whyAIInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [userRolesRef, userRolesInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  // For the floating cards effect
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };
  
  // Handle scroll and mouse movement
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (e: globalThis.MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };
  
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };
  
  // Floating animation variants
  const floatingAnimation: Variants = {
    initial: { y: 0 },
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-green-50 to-white text-green-700">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-green-100/50 via-blue-50/30 to-white opacity-50"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 via-blue-100/30 to-white" />
          <motion.div 
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 15,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%2334d399\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')",
              backgroundSize: "24px 24px"
            }}
          />
        </div>
        
        <div className="px-4 max-w-6xl mx-auto z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-left"
            >
              <motion.span 
                className="inline-block px-3 py-1 mb-4 text-sm font-semibold rounded-full bg-green-100 text-green-800"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                The Future of Healthcare
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
              >
                A.I.-Powered Healthcare Management
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-lg md:text-xl text-green-600 mb-6 font-light"
              >
                Secure, transparent, and efficient healthcare data management with the power of A.I.
              </motion.p>
              
              <motion.div
                className="flex gap-4 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </motion.div>
                
                <Link href="#features" scroll={false} className="flex items-center gap-2 text-green-700 hover:text-green-500 transition-colors">
                  <span>Learn more</span>
                  <motion.div
                    variants={floatingAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <FaArrowDown />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-full h-[400px] md:h-[500px]"
            >
              <div className="w-full h-full text-green-500">
                <HealthcareIcon />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        ref={featuresRef}
        className="py-24 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              Features
            </span>
            <h2 className="text-4xl font-bold mb-4 text-green-800">
              Powerful Healthcare Solutions
            </h2>
            <p className="text-lg text-green-600 max-w-2xl mx-auto">
              Our AI-powered platform offers a comprehensive suite of features designed to revolutionize healthcare management.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {[
              {
                icon: <FaLock className="text-5xl text-green-500 mb-4" />,
                title: "Secure Data Storage",
                description: "A.I. encryption ensures sensitive healthcare data remains tamper-proof and secure.",
                color: "from-green-400 to-green-600"
              },
              {
                icon: <FaHeartbeat className="text-5xl text-pink-500 mb-4" />,
                title: "Patient-Centric Access",
                description: "Patients have full control over who accesses their healthcare data.",
                color: "from-pink-400 to-pink-600"
              },
              {
                icon: <FaClock className="text-5xl text-blue-500 mb-4" />,
                title: "Real-Time Updates",
                description: "Data synchronization across hospitals, clinics, and pharmacies in real-time.",
                color: "from-blue-400 to-blue-600"
              },
              {
                icon: <FaShieldAlt className="text-5xl text-purple-500 mb-4" />,
                title: "Immutable Records",
                description: "Records are immutable, preventing unauthorized alterations.",
                color: "from-purple-400 to-purple-600"
              },
              {
                icon: <FaHospital className="text-5xl text-indigo-500 mb-4" />,
                title: "Hospital Management",
                description: "Centralized management for appointments, patient records, and staff details.",
                color: "from-indigo-400 to-indigo-600"
              },
              {
                icon: <FaUserMd className="text-5xl text-teal-500 mb-4" />,
                title: "Doctor Authentication",
                description: "Verify and authenticate healthcare professionals using A.I.",
                color: "from-teal-400 to-teal-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="relative"
                style={{
                  transform: featuresInView ? `translateY(${Math.sin(scrollY / 1000 + index) * 10}px)` : "none"
                }}
              >
                <Card className="h-full bg-white border-none overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-gradient-to-br ${feature.color} rounded-full opacity-20 blur-2xl`} />
                  <CardHeader className="flex flex-col items-center relative z-10">
                    <motion.div whileHover={{ rotate: 10 }}>
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-green-800 mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-green-700 mt-2 text-center relative z-10">{feature.description}</CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Integration Section */}
      <section 
        ref={whyAIRef}
        className="py-24 px-6 relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mt-32 -mr-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mb-32 -ml-32" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={whyAIInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-[400px] w-full">
                <div className="w-full h-full text-blue-500">
                  <SecurityIcon />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={whyAIInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                Why A.I.?
              </span>
              <h2 className="text-4xl font-bold mb-6 text-green-800">
                Reinventing Healthcare Data Management
              </h2>
              <p className="text-lg text-green-700 mb-6">
                Traditional healthcare systems often struggle with fragmented records and data breaches. A.I. technology ensures:
              </p>
              
              <motion.ul
                className="space-y-4"
                initial="hidden"
                animate={whyAIInView ? "visible" : "hidden"}
                variants={{
                  hidden: {},
                  visible: { 
                    transition: { staggerChildren: 0.2 }
                  }
                }}
              >
                {[
                  { icon: "🔐", text: "Data Security", desc: "End-to-end encryption for patient records" },
                  { icon: "🚑", text: "Interoperability", desc: "Seamless access across institutions" },
                  { icon: "📜", text: "Transparency", desc: "Audit trails for all data modifications" },
                  { icon: "✅", text: "Patient Control", desc: "Patients can grant/revoke access anytime" }
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-md"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold text-green-800">{item.text}</h3>
                      <p className="text-green-600">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={whyAIInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <Link href="#user-roles">Learn More</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section 
        id="user-roles"
        ref={userRolesRef}
        className="py-24 px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={userRolesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              User Access
            </span>
            <h2 className="text-4xl font-bold mb-4 text-green-800">
              Tailored For Healthcare Stakeholders
            </h2>
            <p className="text-lg text-green-600 max-w-2xl mx-auto">
              Our platform provides role-specific features to serve everyone in the healthcare ecosystem.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaHeartbeat className="text-5xl text-blue-500 mb-4" />,
                title: "Patients",
                description: "Access and control your health records securely. Manage appointments and medications with ease.",
                color: "from-blue-100 to-blue-50"
              },
              {
                icon: <FaUserMd className="text-5xl text-green-500 mb-4" />,
                title: "Doctors",
                description: "View patient records with permission and update diagnoses. Streamline your clinical workflow.",
                color: "from-green-100 to-green-50"
              },
              {
                icon: <FaHospital className="text-5xl text-pink-500 mb-4" />,
                title: "Hospital Admins",
                description: "Manage hospital resources and staff efficiently. Generate reports and optimize operations.",
                color: "from-pink-100 to-pink-50"
              }
            ].map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={userRolesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <Card className={`h-full bg-gradient-to-br ${role.color} border-none overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500`}>
                  <CardHeader className="flex flex-col items-center pt-8">
                    <div className="h-32 w-32 mb-4">
                      <div className="w-full h-full text-green-500">
                        <PatientIcon />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-800 mt-4">{role.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-green-700 mt-2 text-center pb-8">{role.description}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        ref={testimonialsRef}
        className="py-24 px-6 bg-gradient-to-br from-green-50 to-blue-50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 mb-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold mb-4 text-green-800">
              What Our Users Say
            </h2>
            <p className="text-lg text-green-600 max-w-2xl mx-auto">
              Hear from healthcare professionals and patients who have transformed their experience.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: { 
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            {[
              {
                quote: "This system has transformed our hospital operations with unparalleled efficiency and security. Patient data is now accessible exactly when needed.",
                author: "Dr. Rakesh Sharma",
                position: "Chief Medical Officer",
                color: "border-green-400"
              },
              {
                quote: "I can access my health records whenever needed without hassle. The interface is intuitive and gives me confidence in the security of my data.",
                author: "Sneha Patil",
                position: "Patient",
                color: "border-blue-400"
              },
              {
                quote: "A.I. ensures the integrity of our medical records and has reduced administrative overhead by 40%. A game-changer for hospital management.",
                author: "Ananya Singh",
                position: "Hospital Administrator",
                color: "border-purple-400"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.7 }
                  }
                }}
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <Card className={`bg-white border-t-4 ${testimonial.color} h-full rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col`}>
                  <CardHeader className="pb-2">
                    <svg width="45" height="36" className="mb-4 text-gray-300" fill="currentColor" viewBox="0 0 45 36">
                      <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z"></path>
                    </svg>
                    <CardTitle className="text-xl font-bold text-green-800">{testimonial.author}</CardTitle>
                    <p className="text-sm text-green-600">{testimonial.position}</p>
                  </CardHeader>
                  <CardContent className="text-green-700 italic flex-grow">"{testimonial.quote}"</CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        ref={ctaRef}
        className="py-24 px-6 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-blue-50/50 to-white" />
          <motion.div 
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 26c-6.065 0-11-4.935-11-11s4.935-11 11-11 11 4.935 11 11-4.935 11-11 11z\" fill=\"%2334d399\" fill-opacity=\"0.05\" fill-rule=\"nonzero\"/%3E%3C/svg%3E')",
              backgroundSize: "60px 60px"
            }}
          />
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10 bg-white bg-opacity-80 p-12 rounded-3xl shadow-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={ctaInView ? { scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            Ready to Secure Your Healthcare Data?
          </motion.h2>
          
          <motion.p
            className="text-xl text-green-700 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Join thousands of healthcare professionals and patients who have already transformed their experience with our AI-powered platform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                    <Link href="/register">Get Started Now</Link>
                  </Button>
                </motion.div>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-white text-green-700 border-2 border-green-500 hover:bg-green-50 text-lg px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="mt-12 flex items-center justify-center gap-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-500" />
              <span className="text-green-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLock className="text-green-500" />
              <span className="text-green-700">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeartbeat className="text-green-500" />
              <span className="text-green-700">99.9% Uptime</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gradient-to-br from-green-800 to-blue-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HealthAI</h3>
              <p className="text-green-100 mb-4">Transforming healthcare data management with AI technology.</p>
              <div className="flex gap-4">
                <a href="#" className="text-white hover:text-green-300 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-300 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-300 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-100 hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="text-green-100 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-green-100 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-green-100 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-100 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-green-100 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-green-100 hover:text-white transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="text-green-100 hover:text-white transition-colors">Data Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <a href="mailto:info@medivision.com" className="text-green-100 hover:text-white transition-colors">info@medivision.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <a href="tel:+1234567890" className="text-green-100 hover:text-white transition-colors">+91 8882228889</a>
                </li>
              </ul>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
                <div className="flex">
                  <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800" />
                  <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-r-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-green-700 mt-12 pt-6 text-center text-green-300">
            <p>&copy; {new Date().getFullYear()} Medivision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
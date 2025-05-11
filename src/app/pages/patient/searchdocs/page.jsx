"use client"

import { Suspense } from "react"
import DoctorSearchContent from "./doctor-search-content"

// Loading fallback component
function DoctorSearchFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-green-600">Loading doctor search...</p>
    </div>
  )
}

// Main page component that properly wraps the content with Suspense
export default function DoctorSearchPage() {
  return (
    <Suspense fallback={<DoctorSearchFallback />}>
      <DoctorSearchContent />
    </Suspense>
  )
}

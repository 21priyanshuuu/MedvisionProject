import mongoose from "mongoose";

const MedicalReportSchema = new mongoose.Schema({
  diagnosis: { type: String, required: true },
  observations: { type: [String], default: [] },
  potential_conditions: { type: [String], default: [] },
  areas_of_concern: { type: [String], default: [] },
  email: { type: String, required: true }, // Store user's email from Kinde
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MedicalReport || mongoose.model("MedicalReport", MedicalReportSchema);

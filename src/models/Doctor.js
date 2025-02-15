import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialization: { type: String },
    experience: { type: Number },
    degree: { type: String },
    clinicLocation: { type: String },
    fees: { type: Number },
    contactNumber: { type: String },
    hospitalAffiliation: { type: String },
    availability: { type: String }, // e.g. Mon-Fri 10am-5pm
    bio: { type: String },
    ratings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

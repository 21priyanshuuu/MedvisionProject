import mongoose from "mongoose";

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);
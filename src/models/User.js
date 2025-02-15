import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  age: { type: Number, required: true },
  role: {
    type: String,
    enum: ["Patient", "Doctor", "Hospital"],
    required: true,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Doctor from "@/models/Doctor";

// GET: Fetch doctor's profile
export async function GET(req) {
  await dbConnect();
  const email = req.nextUrl.searchParams.get("email");

  try {
    if (email) {
      // Fetch single doctor by email
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
      }
      return NextResponse.json(doctor);
    } else {
      // Fetch all doctors (for search & recommendations)
      const doctors = await Doctor.find({});
      return NextResponse.json(doctors, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching doctor(s):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
//POST
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { name, email, specialization, experience, degree, clinicLocation, fees, contactNumber, hospitalAffiliation, availability, bio } = body;

    if (!name || !email || !specialization) {
      return NextResponse.json({ error: "Name, Email, and Specialization are required" }, { status: 400 });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return NextResponse.json({ error: "Doctor profile already exists" }, { status: 409 });
    }

    const newDoctor = new Doctor({
      name,
      email,
      specialization,
      experience,
      degree,
      clinicLocation,
      fees,
      contactNumber,
      hospitalAffiliation,
      availability,
      bio,
    });

    await newDoctor.save();

    return NextResponse.json({ message: "Doctor profile created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Doctor Creation Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// PUT: Update doctor's profile
export async function PUT(req) {
  await dbConnect();
  try {
    const { email, ...updateData } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

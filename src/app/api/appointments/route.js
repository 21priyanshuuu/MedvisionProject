import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/dbConnect";
import Appointment from "@/models/Appointment";
// ✅ GET: Fetch Appointments for Doctor or Patient
export async function GET(req) {
  await dbConnect();
  const email = req.nextUrl.searchParams.get("email");
  const type = req.nextUrl.searchParams.get("type"); // 'doctor' or 'patient'

  if (!email || !type) {
    return NextResponse.json({ error: "Email and type are required" }, { status: 400 });
  }

  try {
    const filter = type === "doctor" ? { doctorEmail: email } : { patientEmail: email };
    const appointments = await Appointment.find(filter).sort({ appointmentDate: -1 });
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PUT: Update Appointment Status
export async function PUT(req) {
  await dbConnect();
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Appointment ID and status are required" }, { status: 400 });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `Appointment ${status} successfully!`,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST: Create New Appointment
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();

    const {
      patientName,
      patientEmail,
      doctorName,
      doctorEmail,
      appointmentDate,
      appointmentTime,
      reason,
    } = body;

    // Validation
    if (!patientName || !patientEmail || !doctorName || !doctorEmail || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const newAppointment = new Appointment({
      patientName,
      patientEmail,
      doctorName,
      doctorEmail,
      appointmentDate,
      appointmentTime,
      reason,
      status: "Pending",
    });

    await newAppointment.save();

    return NextResponse.json(
      { message: "Appointment created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update Appointment Status

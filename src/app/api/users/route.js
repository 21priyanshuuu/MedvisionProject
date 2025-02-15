import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

// Handle GET request (fetch full details or just role)
export async function GET(req) {
  await dbConnect();
  const email = req.nextUrl.searchParams.get("email");
  const type = req.nextUrl.searchParams.get("type"); // Check for type parameter

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return only role if type=role is present
    if (type === "role") {
      return NextResponse.json({ role: user.role });
    }

    // Otherwise, return full user details (without walletAddress)
    return NextResponse.json({
      name: user.name,
      email: user.email,
      gender: user.gender,
      age: user.age,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Handle POST request to save user data
export async function POST(req) {
  await dbConnect();
  try {
    const { name, email, gender, age, role } = await req.json();
    if (!name || !email || !gender || !age || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newUser = new User({ name, email, gender, age, role });
    await newUser.save();

    return NextResponse.json({ message: "User saved successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

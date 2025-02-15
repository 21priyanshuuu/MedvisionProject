import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Contact from "@/models/Contact";
// Handle POST requests
export async function POST(req) {
  await dbConnect();
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

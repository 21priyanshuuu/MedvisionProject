import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/dbConnect";
import MedicalReport from "@/models/MedicalReport"; // Ensure this is the correct import
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";




export async function POST(req) {
  if (req.method !== "POST") {
    console.log("❌ Method not allowed:", req.method);
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    console.log("🔗 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected successfully.");

    // Get user session and email from Kinde
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    console.log("🧑‍💻 Retrieved user:", user);
    console.log("📧 User email:", user?.email || "No email found");

    if (!user || !user.email) {
      console.log("❌ Unauthorized - No user email found");
      return NextResponse.json({ error: "Unauthorized - No user email found" }, { status: 401 });
    }

    // Read and print request body
    const body = await req.json();
    console.log("📥 Incoming request body:", JSON.stringify(body, null, 2));

    // Attach user's email before saving
    const medicalReportData = { ...body, email: user.email };
    console.log("📄 Final data to be saved:", JSON.stringify(medicalReportData, null, 2));

    // Save report in MongoDB
    const medicalReport = new MedicalReport(medicalReportData);
    await medicalReport.save();

    console.log("✅ Medical analysis saved successfully!");

    return NextResponse.json(
      { message: "Medical analysis saved successfully", medicalReport },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Error saving medical analysis:", error);
    return NextResponse.json(
      { error: "Error saving medical analysis", details: error.message }, 
      { status: 500 }
    );
  }
}

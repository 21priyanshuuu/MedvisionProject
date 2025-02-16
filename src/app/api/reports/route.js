import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import MedicalReport from "@/models/Analysis";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// ✅ GET: Fetch all previous medical reports
export async function GET(req) {
  try {
    console.log("🔗 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected successfully.");

    // Get user session from Kinde
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    console.log("🧑‍💻 Retrieved user:", user);
    if (!user || !user.email) {
      console.log("❌ Unauthorized - No user email found");
      return NextResponse.json({ error: "Unauthorized - No user email found" }, { status: 401 });
    }

    // Fetch all medical reports for the user
    const medicalReports = await MedicalReport.find({ email: user.email }).sort({ createdAt: -1 });

    if (!medicalReports || medicalReports.length === 0) {
      return NextResponse.json({ message: "No medical reports found." }, { status: 404 });
    }

    return NextResponse.json(medicalReports, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching medical reports:", error);
    return NextResponse.json(
      { error: "Error fetching medical reports", details: error.message },
      { status: 500 }
    );
  }
}

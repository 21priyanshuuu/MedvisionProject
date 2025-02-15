import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // TODO: Upload to a cloud storage like S3 or Cloudinary
  const uploadedUrl = "https://example.com/path/to/uploaded/file";
  return NextResponse.json({ url: uploadedUrl });
}

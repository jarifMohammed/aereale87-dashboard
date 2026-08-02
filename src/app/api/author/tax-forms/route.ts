import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function POST(req: NextRequest) {
  // Authenticate the request
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "AUTHOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const idFrontFile = formData.get("idFront");
  const idBackFile = formData.get("idBack");

  // Validate both files are present
  if (!(idFrontFile instanceof File) || !(idBackFile instanceof File)) {
    return NextResponse.json(
      { error: "Both ID front and back images are required." },
      { status: 400 }
    );
  }

  // Validate file types
  if (!ALLOWED_TYPES.includes(idFrontFile.type)) {
    return NextResponse.json(
      { error: `Invalid file type for ID front: ${idFrontFile.type}. Accepted: JPG, PNG, WEBP, PDF.` },
      { status: 422 }
    );
  }
  if (!ALLOWED_TYPES.includes(idBackFile.type)) {
    return NextResponse.json(
      { error: `Invalid file type for ID back: ${idBackFile.type}. Accepted: JPG, PNG, WEBP, PDF.` },
      { status: 422 }
    );
  }

  // Validate file sizes
  if (idFrontFile.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "ID front file exceeds the 5MB size limit." },
      { status: 422 }
    );
  }
  if (idBackFile.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "ID back file exceeds the 5MB size limit." },
      { status: 422 }
    );
  }

  // Forward to backend API if configured
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    try {
      const backendForm = new FormData();
      backendForm.append("idFront", idFrontFile);
      backendForm.append("idBack", idBackFile);

      const backendRes = await fetch(`${apiUrl}/author/tax-forms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: backendForm,
      });

      const backendJson = (await backendRes.json()) as { message?: string; error?: string };

      if (!backendRes.ok) {
        return NextResponse.json(
          { error: backendJson.error ?? backendJson.message ?? "Backend upload failed." },
          { status: backendRes.status }
        );
      }

      return NextResponse.json(
        {
          message:
            backendJson.message ??
            "Your ID documents have been submitted successfully. Our team will review them within 1–3 business days.",
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("[tax-forms] Backend request failed:", err);
      return NextResponse.json(
        { error: "Failed to reach the document service. Please try again later." },
        { status: 502 }
      );
    }
  }

  // Fallback: log receipt when no backend is configured (dev/staging)
  console.log(
    `[tax-forms] Received ID upload from user ${session.user.id ?? session.user.email}:`,
    {
      idFront: { name: idFrontFile.name, type: idFrontFile.type, size: idFrontFile.size },
      idBack: { name: idBackFile.name, type: idBackFile.type, size: idBackFile.size },
    }
  );

  return NextResponse.json(
    {
      message:
        "Your ID documents have been submitted successfully. Our team will review them within 1–3 business days.",
    },
    { status: 200 }
  );
}

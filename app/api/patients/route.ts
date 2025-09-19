import { connectDB } from "@/lib/db";
import { Patient } from "@/models/patient.model";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const patients = await Patient.find().sort({ createdAt: -1 });
    return NextResponse.json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const patient = await Patient.create(data);

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}

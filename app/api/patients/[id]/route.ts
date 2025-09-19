import { connectDB } from "@/lib/db";
import { Patient } from "@/models/patient.model";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: any) {
  try {
    await connectDB();
    const { id } = await context.params;

    const patient = await Patient.findOne({ medicalId: id });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}

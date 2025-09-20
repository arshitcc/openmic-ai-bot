import { connectDB } from "@/lib/db";
import { Appointment } from "@/models/appointment.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find().populate("patientId");
    return NextResponse.json({ appointments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

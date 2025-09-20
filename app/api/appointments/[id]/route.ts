import { Appointment } from "@/models/appointment.model";
import { Patient } from "@/models/patient.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: any) {
  const { id } = await context.params;

  const patient = await Patient.findOne({ medicalId: id });
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }
  const appointments = await Appointment.find({
    patientId: patient._id.toString(),
  }).populate("patientId");

  return NextResponse.json({ appointments });
}

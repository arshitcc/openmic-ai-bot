import { connectDB } from "@/lib/db";
import { Appointment } from "@/models/appointment.model";
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

    const { firstName, lastName, phone } = data;

    const patients = await Patient.find({});

    const patient = await Patient.create({
      firstName,
      lastName,
      phone,
      dateOfBirth : new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000),
      medicalId: patients.length + 1,
      address: {
        street: "521 Reid Cliff",
        city: "North Warrentown",
        state: "Serbia",
        zipCode: "400001",
      },
      gender: "male",
      medicalHistory: {
        allergies: [],
        medications: [],
        conditions: [],
        surgeries: [],
      },
      insurance: {
        provider: "Schumm LLC",
        policyNumber: "FNFILBF1657",
        groupNumber: "19697111",
      },
      notes: "",
      availableTimes: [],
      email: "random@example.com",
      emergencyContact: {
        name: "Phyllis Brakus",
        relationship: "Father",
        phone: "944-431-4178",
      },
    });

    await Appointment.create({
      patientId: patient._id.toString(),
      status: "pending",
      medicalId: patient.medicalId,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: "6:00 AM",
      note: "Routine Eye Checkup",
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}

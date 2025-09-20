import { connectDB } from "@/lib/db";
import { Appointment } from "@/models/appointment.model";
import { Patient } from "@/models/patient.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // const patients = await Patient.insertMany(body.patients);
    // let apps = [];
    // for (let i = 0; i < body.patients.length; i++) {
    //   apps.push({
    //     ...body.appointments[i],
    //     patientId: body.patients[i]._id?.toString(),
    //     medicalId: body.patients[i].medicalId,
    //   });
    // }

    // const apps = body.appointments.map((a : any) => ({...a, note:  "Hello"}))
    // const appointments = await Appointment.insertMany(apps);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      error: JSON.stringify(error),
    });
  }
}

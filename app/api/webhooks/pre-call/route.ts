import { connectDB } from "@/lib/db";
import openMicAPI from "@/lib/openmic-api";
import { Bot } from "@/models/bot.model";
import { Call } from "@/models/call.model";
import { Patient } from "@/models/patient.model";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const payload = await request.json();
    console.log("[Pre-Call Webhook] Received payload:", payload);

    const call = await Call.findOne({
      phoneNumber: payload.call.to_number,
      openMicBotId: payload.call.bot_id,
      status : "initiated"
    });

    if (!call) {
      return NextResponse.json(
        { error: "No Query Call found for this contact provided" },
        { status: 404 }
      );
    }

    console.log(call)

    const openMicCall = await openMicAPI.getCall(call.callId);

    const patient = await Patient.findOne({medicalId : openMicCall?.customer_id});

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `
         Patient Details:
        * Medical ID : ${patient.medicalId}
        * Name : ${patient.firstName} ${patient.lastName}
        * DOB : ${patient.dateOfBirth}
        * Address : ${patient.address.street}, ${patient.address.city}, ${patient.address.zipCode}
        * Phone : ${patient.phone}
        * Allergies : ${patient.medicalHistory.allergies} (list of strings)
        * Medications : ${patient.medicalHistory.medications} (list of strings)
        * Insurance : ${patient.insurance.provider} ${patient.insurance.policyNumber}
      `,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          "Welcome to our medical practice. I'll help you with your intake today.",
      },
      { status: 500 }
    );
  }
}
